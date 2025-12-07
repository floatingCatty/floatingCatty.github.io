document.addEventListener('DOMContentLoaded', function () {
  var debugLog = document.getElementById('debug-log');

  function log(message) {
    if (debugLog) {
      debugLog.style.display = 'block';
      debugLog.innerHTML += message + '<br>';
    }
    console.log(message);
  }

  log("DOM loaded (external script v2.4)");

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
        log("Native replicateUnitCell not found. Using manual replication.");

        // Manual replication
        var atoms = model.selectedAtoms({});
        var unitCell = model.getUnitCell();

        if (atoms.length > 0 && unitCell) {
          // 3Dmol UnitCell usually has aAxis, bAxis, cAxis properties
          // We need to verify if they exist.
          // If not, we might need to calculate them from a, b, c, alpha, beta, gamma

          var aAxis = unitCell.aAxis;
          var bAxis = unitCell.bAxis;
          var cAxis = unitCell.cAxis;

          if (!aAxis || !bAxis || !cAxis) {
            // Fallback: try to calculate from parameters if available
            // For now, log error if missing
            log("Error: Unit cell vectors missing. Cannot replicate.");
          } else {
            var allNewAtoms = [];

            for (var i = 0; i < x; i++) {
              for (var j = 0; j < y; j++) {
                for (var k = 0; k < z; k++) {
                  if (i === 0 && j === 0 && k === 0) continue; // Skip original cell

                  var tx = i * aAxis.x + j * bAxis.x + k * cAxis.x;
                  var ty = i * aAxis.y + j * bAxis.y + k * cAxis.y;
                  var tz = i * aAxis.z + j * bAxis.z + k * cAxis.z;

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
          }
        } else {
          log("Cannot replicate: Unit cell info or atoms missing.");
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
