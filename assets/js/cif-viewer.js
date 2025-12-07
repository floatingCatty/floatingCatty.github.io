document.addEventListener('DOMContentLoaded', function () {
  var debugLog = document.getElementById('debug-log');

  function log(message) {
    if (debugLog) {
      debugLog.style.display = 'block';
      debugLog.innerHTML += message + '<br>';
    }
    console.log(message);
  }

  log("DOM loaded (external script v4.0 - State Based)");

  // --- State Management ---
  var state = {
    unitCellAtoms: [],    // {elem, x, y, z} (Fractional coordinates)
    lattice: { a: 10, b: 10, c: 10, alpha: 90, beta: 90, gamma: 90 },
    displayAtoms: [],     // {elem, x, y, z, id, sourceIndex} (Cartesian coordinates)
    selectedIds: new Set(), // Set of unique IDs in displayAtoms
    mode: 'view',         // 'view', 'select', 'move'
    supercell: { x: 1, y: 1, z: 1 }
  };

  // --- Initialization ---
  var element = document.getElementById('container-01');
  var selectionBox = document.getElementById('selection-box');
  var config = { backgroundColor: 'white' };

  if (typeof $3Dmol === 'undefined') {
    log("Error: 3Dmol.js is not loaded");
    if (element) element.innerHTML = "Error: 3Dmol.js library not loaded.";
    return;
  }

  var viewer = $3Dmol.createViewer(element, config);

  // --- Core Logic ---

  function parseCIF(cifText) {
    var cell = { a: 10, b: 10, c: 10, alpha: 90, beta: 90, gamma: 90 };
    var atoms = [];

    var lines = cifText.split('\n');
    var loopHeaders = [];
    var inLoop = false;

    lines.forEach(function (line) {
      line = line.trim();
      if (!line || line.startsWith('#')) return;

      // Cell Parameters
      if (line.startsWith('_cell_length_a')) cell.a = parseFloat(line.split(/\s+/)[1]);
      if (line.startsWith('_cell_length_b')) cell.b = parseFloat(line.split(/\s+/)[1]);
      if (line.startsWith('_cell_length_c')) cell.c = parseFloat(line.split(/\s+/)[1]);
      if (line.startsWith('_cell_angle_alpha')) cell.alpha = parseFloat(line.split(/\s+/)[1]);
      if (line.startsWith('_cell_angle_beta')) cell.beta = parseFloat(line.split(/\s+/)[1]);
      if (line.startsWith('_cell_angle_gamma')) cell.gamma = parseFloat(line.split(/\s+/)[1]);

      // Atom Loop Parsing (Simple version)
      if (line.startsWith('loop_')) {
        inLoop = true;
        loopHeaders = [];
        return;
      }

      if (inLoop) {
        if (line.startsWith('_')) {
          loopHeaders.push(line);
        } else {
          // Data line
          var parts = line.split(/\s+/);
          if (parts.length >= loopHeaders.length) { // Basic validation
            var atom = {};
            var labelIdx = loopHeaders.indexOf('_atom_site_label');
            var typeIdx = loopHeaders.indexOf('_atom_site_type_symbol');
            var xIdx = loopHeaders.indexOf('_atom_site_fract_x');
            var yIdx = loopHeaders.indexOf('_atom_site_fract_y');
            var zIdx = loopHeaders.indexOf('_atom_site_fract_z');

            // Fallback for label/type
            var elem = "X";
            if (typeIdx > -1) elem = parts[typeIdx];
            else if (labelIdx > -1) elem = parts[labelIdx].replace(/[0-9+-]/g, ''); // Strip numbers

            atom.elem = elem;
            atom.x = parseFloat(parts[xIdx]);
            atom.y = parseFloat(parts[yIdx]);
            atom.z = parseFloat(parts[zIdx]);

            if (!isNaN(atom.x)) {
              atoms.push(atom);
            }
          }
        }
      }
    });

    state.lattice = cell;
    state.unitCellAtoms = atoms;
    log("Parsed CIF: " + atoms.length + " atoms in unit cell.");
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

  function regenerateSupercell() {
    state.displayAtoms = [];
    var vectors = calculateLatticeVectors(state.lattice);
    var va = vectors.va; var vb = vectors.vb; var vc = vectors.vc;

    var idCounter = 0;

    for (var i = 0; i < state.supercell.x; i++) {
      for (var j = 0; j < state.supercell.y; j++) {
        for (var k = 0; k < state.supercell.z; k++) {

          var tx = i * va.x + j * vb.x + k * vc.x;
          var ty = i * va.y + j * vb.y + k * vc.y;
          var tz = i * va.z + j * vb.z + k * vc.z;

          state.unitCellAtoms.forEach(function (atom, idx) {
            // Convert fractional to cartesian
            var cx = atom.x * va.x + atom.y * vb.x + atom.z * vc.x;
            var cy = atom.x * va.y + atom.y * vb.y + atom.z * vc.y;
            var cz = atom.x * va.z + atom.y * vb.z + atom.z * vc.z;

            state.displayAtoms.push({
              id: idCounter++,
              elem: atom.elem,
              x: cx + tx,
              y: cy + ty,
              z: cz + tz,
              sourceIndex: idx // Link back to unit cell atom
            });
          });
        }
      }
    }
    log("Regenerated supercell: " + state.displayAtoms.length + " atoms.");
  }

  function renderScene() {
    viewer.clear();

    // Create XYZ string
    var xyz = state.displayAtoms.length + "\n\n";
    state.displayAtoms.forEach(function (atom) {
      xyz += atom.elem + " " + atom.x + " " + atom.y + " " + atom.z + "\n";
    });

    var model = viewer.addModel(xyz, "xyz");

    // Apply Styles
    viewer.setStyle({}, {
      sphere: { scale: 0.3, colorscheme: 'Jmol' },
      stick: { radius: 0.15, colorscheme: 'Jmol' }
    });

    // Apply Selection Halo
    state.selectedIds.forEach(function (id) {
      // Map ID to atom index in model (should match order)
      // Since we generated XYZ in order, index i corresponds to displayAtoms[i]
      // But we need to find the index of the atom with this ID.
      var index = state.displayAtoms.findIndex(function (a) { return a.id === id; });
      if (index > -1) {
        // Halo style: larger transparent sphere + outline
        viewer.setStyle({ index: index }, {
          sphere: { scale: 0.3, colorscheme: 'Jmol' },
          stick: { radius: 0.15, colorscheme: 'Jmol' }
        });
        // Add a separate shape or style for highlight?
        // 3Dmol doesn't support multiple styles per atom easily in one pass.
        // We can add a label or a separate shape.
        // Or just change color? User said "ugly".
        // Let's try "Clickable" style which adds an outline? No.
        // Let's add a 3D shape (sphere) at the atom position.

        var atom = state.displayAtoms[index];
        viewer.addSphere({
          center: { x: atom.x, y: atom.y, z: atom.z },
          radius: 0.5,
          color: 'yellow',
          opacity: 0.4,
          wireframe: true
        });
      }
    });

    viewer.addUnitCell(state.lattice); // This might not work with XYZ model?
    // XYZ model doesn't have unit cell info. We need to pass it manually?
    // viewer.addUnitCell(state.lattice) works if we pass the object.
    // But we need to ensure the box matches the supercell?
    // The native addUnitCell draws the *original* unit cell.
    // If we want a supercell box, we might need to draw it manually.
    // For now, let's just draw the base unit cell to keep it simple.

    viewer.zoomTo();
    viewer.render();

    // Re-bind interaction
    setupInteraction();
  }

  // --- Interaction ---

  var isDragging = false;
  var dragStart = { x: 0, y: 0 };
  var dragStartCam = null;
  var draggingAtomId = null;

  function setupInteraction() {
    // Click Selection
    viewer.setClickable({}, true, function (atom) {
      if (state.mode === 'select') {
        // Atom index matches displayAtoms index
        var id = state.displayAtoms[atom.index].id;
        if (state.selectedIds.has(id)) {
          state.selectedIds.delete(id);
        } else {
          state.selectedIds.add(id);
        }
        renderScene();
      }
    });

    // Hover for Move Mode
    viewer.setHoverable({}, true, function (atom) {
      if (state.mode === 'move') {
        element.style.cursor = 'move';
      }
    }, function () {
      element.style.cursor = 'default';
    });
  }

  // Box Selection & Move Logic (Container Events)
  element.addEventListener('mousedown', function (e) {
    var rect = element.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    if (state.mode === 'select') {
      // Start Box Selection
      isDragging = true;
      dragStart = { x: x, y: y };
      selectionBox.style.display = 'block';
      selectionBox.style.left = x + 'px';
      selectionBox.style.top = y + 'px';
      selectionBox.style.width = '0px';
      selectionBox.style.height = '0px';

      // Disable camera rotation while selecting
      viewer.enableMouse(false);
    } else if (state.mode === 'move') {
      // Start Move
      // We need to find if we clicked an atom.
      // Since 3Dmol doesn't give us the atom on mousedown easily,
      // we rely on the Hover state or a proximity check.
      // Let's use a proximity check in screen space.

      var closestAtom = null;
      var minDist = 20; // pixels

      state.displayAtoms.forEach(function (atom) {
        var screenPos = viewer.project(atom.x, atom.y, atom.z);
        // viewer.project returns {x, y} relative to canvas?
        // We need to verify coordinates. usually it's canvas coords.
        var dx = screenPos.x - x;
        var dy = screenPos.y - y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) {
          minDist = dist;
          closestAtom = atom;
        }
      });

      if (closestAtom) {
        draggingAtomId = closestAtom.id;
        isDragging = true;
        dragStart = { x: x, y: y };
        viewer.enableMouse(false); // Disable camera
        log("Dragging atom " + draggingAtomId);
      }
    }
  });

  element.addEventListener('mousemove', function (e) {
    if (!isDragging) return;

    var rect = element.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    if (state.mode === 'select') {
      // Update Box
      var left = Math.min(dragStart.x, x);
      var top = Math.min(dragStart.y, y);
      var width = Math.abs(x - dragStart.x);
      var height = Math.abs(y - dragStart.y);

      selectionBox.style.left = left + 'px';
      selectionBox.style.top = top + 'px';
      selectionBox.style.width = width + 'px';
      selectionBox.style.height = height + 'px';

    } else if (state.mode === 'move' && draggingAtomId !== null) {
      // Move Atom
      var atom = state.displayAtoms.find(function (a) { return a.id === draggingAtomId; });
      if (atom) {
        // Simple screen-plane movement
        var factor = 0.05; // Sensitivity
        var dx = (x - dragStart.x) * factor;
        var dy = (y - dragStart.y) * factor;

        // Update atom position
        // Note: This updates the Display Atom (Cartesian).
        // It does NOT update the Unit Cell Atom (Fractional).
        // So if you regenerate supercell, this move is lost.
        // This is expected behavior for "defect engineering" on a supercell.

        atom.x += dx;
        atom.y -= dy; // Screen Y is inverted

        dragStart = { x: x, y: y }; // Reset delta

        renderScene(); // Re-render to show movement
      }
    }
  });

  element.addEventListener('mouseup', function (e) {
    if (!isDragging) return;
    isDragging = false;
    viewer.enableMouse(true); // Re-enable camera

    if (state.mode === 'select') {
      selectionBox.style.display = 'none';

      // Calculate Selection
      var rect = element.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      var left = Math.min(dragStart.x, x);
      var top = Math.min(dragStart.y, y);
      var right = Math.max(dragStart.x, x);
      var bottom = Math.max(dragStart.y, y);

      // Project all atoms
      state.displayAtoms.forEach(function (atom) {
        var screenPos = viewer.project(atom.x, atom.y, atom.z);
        if (screenPos.x >= left && screenPos.x <= right &&
          screenPos.y >= top && screenPos.y <= bottom) {
          state.selectedIds.add(atom.id);
        }
      });
      renderScene();
      log("Selected " + state.selectedIds.size + " atoms.");
    } else if (state.mode === 'move') {
      draggingAtomId = null;
      log("Stopped dragging");
    }
  });

  // --- UI Handlers ---

  document.getElementById('file-input').addEventListener('change', function () {
    var file = this.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function (e) {
        parseCIF(e.target.result);
        regenerateSupercell();
        renderScene();
      };
      reader.readAsText(file);
    }
  });

  document.getElementById('update-view').addEventListener('click', function () {
    state.supercell.x = parseInt(document.getElementById('supercell-x').value) || 1;
    state.supercell.y = parseInt(document.getElementById('supercell-y').value) || 1;
    state.supercell.z = parseInt(document.getElementById('supercell-z').value) || 1;
    regenerateSupercell();
    renderScene();
  });

  var modeRadios = document.getElementsByName('mode');
  for (var i = 0; i < modeRadios.length; i++) {
    modeRadios[i].addEventListener('change', function () {
      state.mode = this.value;
      log("Mode: " + state.mode);
      // Reset selection box if switching away
      selectionBox.style.display = 'none';
    });
  }

  document.getElementById('btn-clear-selection').addEventListener('click', function () {
    state.selectedIds.clear();
    renderScene();
  });

  document.getElementById('btn-delete-selected').addEventListener('click', function () {
    if (state.selectedIds.size === 0) return;

    // Filter out selected atoms from displayAtoms
    state.displayAtoms = state.displayAtoms.filter(function (atom) {
      return !state.selectedIds.has(atom.id);
    });

    state.selectedIds.clear();
    renderScene();
    log("Deleted selected atoms.");
  });

  document.getElementById('btn-add-atom').addEventListener('click', function () {
    var elem = prompt("Enter Element (e.g., Si):", "Si");
    if (!elem) return;
    var coordStr = prompt("Enter Fractional Coords (x, y, z):", "0.5, 0.5, 0.5");
    if (!coordStr) return;
    var parts = coordStr.split(',');
    if (parts.length !== 3) return;

    var newAtom = {
      elem: elem,
      x: parseFloat(parts[0]),
      y: parseFloat(parts[1]),
      z: parseFloat(parts[2])
    };

    // Add to Unit Cell (Source)
    state.unitCellAtoms.push(newAtom);

    // Regenerate to show it (and replicate it)
    regenerateSupercell();
    renderScene();
    log("Added atom to unit cell.");
  });

});
