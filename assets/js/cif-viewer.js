document.addEventListener('DOMContentLoaded', function () {
  var debugLog = document.getElementById('debug-log');

  function log(message) {
    if (debugLog) {
      debugLog.style.display = 'block';
      debugLog.innerHTML += message + '<br>';
    }
    console.log(message);
  }

  log("DOM loaded (external script v3.1 - Fixes)");

  // Initialize viewer
  var element = document.getElementById('container-01');
  var config = { backgroundColor: 'white' };

  if (typeof $3Dmol === 'undefined') {
    log("Error: 3Dmol.js is not loaded");
    if (element) element.innerHTML = "Error: 3Dmol.js library not loaded.";
    return;
  }

  var viewer = $3Dmol.createViewer(element, config);
  var currentContent = null;
  var currentMode = 'view'; // view, select, move
  var selectedAtoms = []; // Array of atom objects (references)

  // --- CIF Parsing & Supercell Logic ---
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
    var a = cell.a; var b = cell.b; var c = cell.c;
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

  // --- Rendering ---
  function renderModel() {
    if (!currentContent) return;

    selectedAtoms = [];

    var x = parseInt(document.getElementById('supercell-x').value) || 1;
    var y = parseInt(document.getElementById('supercell-y').value) || 1;
    var z = parseInt(document.getElementById('supercell-z').value) || 1;

    try {
      viewer.clear();
      var model = viewer.addModel(currentContent, "cif");

      // Supercell Logic
      if (typeof model.replicateUnitCell === 'function') {
        model.replicateUnitCell(x, y, z);
      } else {
        // Manual replication
        var atoms = model.selectedAtoms({});
        if (atoms.length > 0 && x * y * z > 1) {
          var cell = parseCIFCell(currentContent);
          if (cell.a && cell.b && cell.c) {
            var vectors = calculateLatticeVectors(cell);
            var va = vectors.va; var vb = vectors.vb; var vc = vectors.vc;
            var allNewAtoms = [];
            for (var i = 0; i < x; i++) {
              for (var j = 0; j < y; j++) {
                for (var k = 0; k < z; k++) {
                  if (i === 0 && j === 0 && k === 0) continue;
                  var tx = i * va.x + j * vb.x + k * vc.x;
                  var ty = i * va.y + j * vb.y + k * vc.y;
                  var tz = i * va.z + j * vb.z + k * vc.z;
                  for (var a = 0; a < atoms.length; a++) {
                    var atom = atoms[a];
                    var newAtom = {};
                    for (var prop in atom) { if (atom.hasOwnProperty(prop)) newAtom[prop] = atom[prop]; }
                    newAtom.x += tx; newAtom.y += ty; newAtom.z += tz;
                    delete newAtom.serial; delete newAtom.index;
                    allNewAtoms.push(newAtom);
                  }
                }
              }
            }
            if (allNewAtoms.length > 0) model.addAtoms(allNewAtoms);
          }
        }
      }

      applyStyles();
      viewer.addUnitCell();
      viewer.zoomTo();
      viewer.render();

      setupClickHandlers();

    } catch (err) {
      log("Error rendering model: " + err.message);
    }
  }

  function applyStyles() {
    viewer.setStyle({}, {
      sphere: { scale: 0.3, colorscheme: 'Jmol' },
      stick: { radius: 0.15, colorscheme: 'Jmol' }
    });

    if (selectedAtoms.length > 0) {
      viewer.setStyle({ selected: true }, { sphere: { scale: 0.35, color: 'yellow' }, stick: { radius: 0.15, color: 'yellow' } });
    }
  }

  // --- Interaction Logic ---
  var hoveredAtom = null;
  var draggingAtom = null;
  var dragStartMouse = null;
  var dragStartAtom = null;

  function setupClickHandlers() {
    viewer.setClickable({}, true, function (atom) {
      if (currentMode === 'select') {
        toggleSelection(atom);
      }
    });

    // Hover handler for Move mode
    viewer.setHoverable({}, true, function (atom, viewer, event, container) {
      if (currentMode === 'move') {
        element.style.cursor = 'move';
        hoveredAtom = atom;
      }
    }, function (atom) {
      element.style.cursor = 'default';
      hoveredAtom = null;
    });
  }

  function toggleSelection(atom) {
    var index = selectedAtoms.indexOf(atom);
    if (index > -1) {
      selectedAtoms.splice(index, 1);
      atom.selected = false;
      viewer.setStyle({ index: atom.index }, { sphere: { scale: 0.3, colorscheme: 'Jmol' }, stick: { radius: 0.15, colorscheme: 'Jmol' } });
    } else {
      selectedAtoms.push(atom);
      atom.selected = true;
      viewer.setStyle({ index: atom.index }, { sphere: { scale: 0.35, color: 'yellow' }, stick: { radius: 0.15, color: 'yellow' } });
    }
    viewer.render();
    log("Selected atoms: " + selectedAtoms.length);
  }

  // --- Dragging Events ---
  element.addEventListener('mousedown', function (e) {
    if (currentMode === 'move' && hoveredAtom) {
      draggingAtom = hoveredAtom;
      viewer.enableMouse(false); // Disable camera
      dragStartMouse = { x: e.clientX, y: e.clientY };
      dragStartAtom = { x: draggingAtom.x, y: draggingAtom.y, z: draggingAtom.z };
      log("Started dragging atom " + draggingAtom.serial);
    }
  });

  window.addEventListener('mousemove', function (e) {
    if (draggingAtom) {
      var factor = 0.05; // Sensitivity
      var dx = (e.clientX - dragStartMouse.x) * factor;
      var dy = (e.clientY - dragStartMouse.y) * factor;

      draggingAtom.x = dragStartAtom.x + dx;
      draggingAtom.y = dragStartAtom.y - dy;

      viewer.render();
    }
  });

  window.addEventListener('mouseup', function (e) {
    if (draggingAtom) {
      draggingAtom = null;
      viewer.enableMouse(true); // Re-enable camera
      log("Stopped dragging");
      viewer.render();
    }
  });

  // --- UI Event Listeners ---

  // Mode Switching
  var modeRadios = document.getElementsByName('mode');
  for (var i = 0; i < modeRadios.length; i++) {
    modeRadios[i].addEventListener('change', function () {
      currentMode = this.value;
      log("Mode changed to: " + currentMode);
    });
  }

  // Actions
  document.getElementById('btn-clear-selection').addEventListener('click', function () {
    selectedAtoms = [];
    viewer.setStyle({}, { sphere: { scale: 0.3, colorscheme: 'Jmol' }, stick: { radius: 0.15, colorscheme: 'Jmol' } });
    viewer.render();
    log("Selection cleared");
  });

  document.getElementById('btn-delete-selected').addEventListener('click', function () {
    if (selectedAtoms.length === 0) {
      alert("No atoms selected.");
      return;
    }

    var model = viewer.getModel(0);
    if (!model) return;

    var indices = selectedAtoms.map(function (a) { return a.index; });
    model.removeAtoms({ index: indices });

    selectedAtoms = [];
    viewer.render();
    log("Deleted " + indices.length + " atoms.");
  });

  document.getElementById('btn-add-atom').addEventListener('click', function () {
    var elem = prompt("Enter Element Symbol (e.g., Si, O):", "Si");
    if (!elem) return;

    var coordStr = prompt("Enter Coordinates (x, y, z):", "0, 0, 0");
    if (!coordStr) return;

    var coords = coordStr.split(',').map(parseFloat);
    if (coords.length !== 3 || isNaN(coords[0])) {
      alert("Invalid coordinates.");
      return;
    }

    var model = viewer.getModel(0);
    if (!model) {
      alert("Please load a model first.");
      return;
    }

    model.addAtoms([{ elem: elem, x: coords[0], y: coords[1], z: coords[2] }]);

    viewer.setStyle({}, { sphere: { scale: 0.3, colorscheme: 'Jmol' }, stick: { radius: 0.15, colorscheme: 'Jmol' } });
    setupClickHandlers();
    viewer.render();
    log("Added atom " + elem + " at " + coords.join(','));
  });

  // --- File Input & Init ---
  var fileInput = document.getElementById('file-input');
  if (fileInput) {
    fileInput.addEventListener('change', function () {
      var file = this.files[0];
      if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
          currentContent = e.target.result;
          renderModel();
        };
        reader.readAsText(file);
      }
    });
  }

  document.getElementById('update-view').addEventListener('click', function () {
    renderModel();
  });
});
