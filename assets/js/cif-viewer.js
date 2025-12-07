document.addEventListener('DOMContentLoaded', function () {
  var debugLog = document.getElementById('debug-log');

  function log(message) {
    if (debugLog) {
      debugLog.style.display = 'block';
      debugLog.innerHTML += message + '<br>';
    }
    console.log(message);
  }

  log("DOM loaded (external script v2.5)");

  // Initialize viewer
  var element = document.getElementById('container-01');
  var config = { backgroundColor: 'white' };

  // Ensure 3Dmol is loaded
  if (typeof $3Dmol === 'undefined') {
    log("Error: 3Dmol.js is not loaded");
    if (element) element.innerHTML = "Error: 3Dmol.js library not loaded.";
    return;
  } else {
    log("3Dmol.js loaded successfully");
  }

  var viewer;
  try {
    viewer = $3Dmol.createViewer(element, config);
    log("Viewer created");
  } catch (e) {
    log("Error creating viewer: " + e.message);
    return;
  }

  var currentContent = null;

  function parseCIFCell(cifText) {
    var cell = { a: 0, b: 0, c: 0, alpha: 90, beta: 90, gamma: 90 };
    var lines = cifText.split('\n');
    lines.forEach(function (line) {
      line = line.trim();
      if (line.startsWith('_cell_length_a')) cell.a = parseFloat(line.split(/\s+/)[1]);
      if (line.startsWith('_cell_length_b')) cell.b = parseFloat(line.split(/\s+/)[1]);
      if (line.startsWith('_cell_length_c')) cell.c = parseFloat(line.split(/\s+/)[1]);
      if (line.startsWith('_cell_angle_alpha')) cell.alpha = parseFloat(line.split(/\s+/)[1]);
      if (line.startsWith('_cell_angle_beta')) cell.beta = parseFloat(line.split(/\s+/)[1]);
      if (line.startsWith('_cell_angle_gamma')) cell.gamma = parseFloat(line.split(/\s+/)[1]);
    });
    return cell;
  }

  function calculateLatticeVectors(cell) {
    var a = cell.a;
    var b = cell.b;
    var c = cell.c;
    var alpha = cell.alpha * Math.PI / 180;
    var beta = cell.beta * Math.PI / 180;
    var gamma = cell.gamma * Math.PI / 180;

    var va = { x: a, y: 0, z: 0 };
    var vb = { x: b * Math.cos(gamma), y: b * Math.sin(gamma), z: 0 };

    var cx = c * Math.cos(beta);
    var cy = c * (Math.cos(alpha) - Math.cos(beta) * Math.cos(gamma)) / Math.sin(gamma);
    var cz = Math.sqrt(c * c - cx * cx - cy * cy);

    var vc = { x: cx, y: cy, z: cz };

    return { va: va, vb: vb, vc: vc };
  }

  function renderModel() {
    if (!currentContent) return;

    var x = parseInt(document.getElementById('supercell-x').value) || 1;
    var y = parseInt(document.getElementById('supercell-y').value) || 1;
    var z = parseInt(document.getElementById('supercell-z').value) || 1;

    try {
      viewer.clear();
      var model = viewer.addModel(currentContent, "cif");

      // Try native replicateUnitCell first
      if (typeof model.replicateUnitCell === 'function') {
        model.replicateUnitCell(x, y, z);
        log("Used native replicateUnitCell");
      } else {
        log("Native replicateUnitCell not found. Using manual replication with custom CIF parsing.");

        // Manual replication
        var atoms = model.selectedAtoms({});

        if (atoms.length > 0 && x * y * z > 1) {
          var cell = parseCIFCell(currentContent);

          if (cell.a && cell.b && cell.c) {
            var vectors = calculateLatticeVectors(cell);
            var va = vectors.va;
            var vb = vectors.vb;
            var vc = vectors.vc;

            var allNewAtoms = [];

            for (var i = 0; i < x; i++) {
              for (var j = 0; j < y; j++) {
                for (var k = 0; k < z; k++) {
                  if (i === 0 && j === 0 && k === 0) continue; // Skip original cell

                  var tx = i * va.x + j * vb.x + k * vc.x;
                  var ty = i * va.y + j * vb.y + k * vc.y;
                  var tz = i * va.z + j * vb.z + k * vc.z;

                  for (var a = 0; a < atoms.length; a++) {
                    var atom = atoms[a];
                    var newAtom = {};
                    // Copy properties
                    for (var prop in atom) {
                      if (atom.hasOwnProperty(prop)) {
                        newAtom[prop] = atom[prop];
                      }
                    }
                    // Update position
                    newAtom.x += tx;
                    newAtom.y += ty;
                    newAtom.z += tz;

                    // Clear unique IDs
                    delete newAtom.serial;
                    delete newAtom.index;

                    allNewAtoms.push(newAtom);
                  }
                }
              }
            }

            if (allNewAtoms.length > 0) {
              model.addAtoms(allNewAtoms);
              log("Manual replication added " + allNewAtoms.length + " atoms.");
            }
          } else {
            log("Error: Could not parse unit cell parameters from CIF.");
          }
        }
      }

      // Style: Ball and Stick
      viewer.setStyle({}, {
        sphere: { scale: 0.3, colorscheme: 'Jmol' },
        stick: { radius: 0.15, colorscheme: 'Jmol' }
      });

      // Add Unit Cell Box
      viewer.addUnitCell();

      viewer.zoomTo();
      viewer.render();
      log("Model rendered with supercell " + x + "x" + y + "x" + z);
    } catch (err) {
      log("Error rendering model: " + err.message);
    }
  }

  var fileInput = document.getElementById('file-input');
  if (fileInput) {
    fileInput.addEventListener('change', function () {
      log("File input changed");
      var file = this.files[0];
      if (file) {
        log("File selected: " + file.name);
        var reader = new FileReader();
        reader.onload = function (e) {
          log("File read successfully");
          currentContent = e.target.result;
          renderModel();
        };
        reader.onerror = function () {
          log("Error reading file");
        };
        reader.readAsText(file);
      } else {
        log("No file selected");
      }
    });
  } else {
    log("Error: File input element not found");
  }

  var updateButton = document.getElementById('update-view');
  if (updateButton) {
    updateButton.addEventListener('click', function () {
      log("Update view clicked");
      renderModel();
    });
  }
});
