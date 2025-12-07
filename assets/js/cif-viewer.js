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

  try {
    var viewer = $3Dmol.createViewer(element, config);
    log("Viewer created");
  } catch (e) {
    log("Error creating viewer: " + e.message);
    return;
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
          try {
            var content = e.target.result;
            viewer.clear();
            viewer.addModel(content, "cif");
            viewer.setStyle({}, { stick: {} });
            viewer.zoomTo();
            viewer.render();
            log("Model rendered");
          } catch (err) {
            log("Error rendering model: " + err.message);
          }
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
});
