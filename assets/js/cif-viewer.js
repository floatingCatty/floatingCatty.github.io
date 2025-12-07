document.addEventListener('DOMContentLoaded', function () {
  var debugLog = document.getElementById('debug-log');

  function log(message) {
    if (debugLog) {
      debugLog.style.display = 'block';
      debugLog.innerHTML += message + '<br>';
    }
    console.log(message);
  }

  log("DOM loaded (external script)");

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

      // Replicate unit cell
      if (x > 1 || y > 1 || z > 1) {
        if (typeof model.replicateUnitCell === 'function') {
          model.replicateUnitCell(x, y, z);
        } else {
          log("Error: model.replicateUnitCell is not a function. Model keys: " + Object.keys(model).join(", "));
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
