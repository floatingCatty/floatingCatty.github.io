var mockCIF = "data_Test\n" +
    "_cell_length_a    5.0\n" +
    "_cell_length_b    5.0\n" +
    "_cell_length_c    5.0\n" +
    "_cell_angle_alpha 90\n" +
    "_cell_angle_beta  90\n" +
    "_cell_angle_gamma 90\n" +
    "loop_\n" +
    "_atom_site_label\n" +
    "_atom_site_fract_x\n" +
    "_atom_site_fract_y\n" +
    "_atom_site_fract_z\n" +
    "Si 0.0 0.0 0.0\n";

function log(msg) {
    WScript.Echo(msg);
}

function parseCIFCell(cifText) {
    var cell = { a: 0, b: 0, c: 0, alpha: 90, beta: 90, gamma: 90 };
    var lines = cifText.split('\n');
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].replace(/^\s+|\s+$/g, ''); // trim
        if (line.indexOf('_cell_length_a') === 0) cell.a = parseFloat(line.split(/\s+/)[1]);
        if (line.indexOf('_cell_length_b') === 0) cell.b = parseFloat(line.split(/\s+/)[1]);
        if (line.indexOf('_cell_length_c') === 0) cell.c = parseFloat(line.split(/\s+/)[1]);
        if (line.indexOf('_cell_angle_alpha') === 0) cell.alpha = parseFloat(line.split(/\s+/)[1]);
        if (line.indexOf('_cell_angle_beta') === 0) cell.beta = parseFloat(line.split(/\s+/)[1]);
        if (line.indexOf('_cell_angle_gamma') === 0) cell.gamma = parseFloat(line.split(/\s+/)[1]);
    }
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

// Mock atoms
var atoms = [{ elem: 'Si', x: 0, y: 0, z: 0 }];

log("Starting verification...");
var cell = parseCIFCell(mockCIF);
log("Cell: a=" + cell.a + " b=" + cell.b + " c=" + cell.c);

if (cell.a === 5 && cell.b === 5 && cell.c === 5) {
    log("Parsing SUCCESS");
} else {
    log("Parsing FAILED");
}

var vectors = calculateLatticeVectors(cell);
log("Vectors calculated.");

var x = 2, y = 1, z = 1;
var allNewAtoms = [];
var va = vectors.va;
var vb = vectors.vb;
var vc = vectors.vc;

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
                newAtom.x = atom.x + tx;
                newAtom.y = atom.y + ty;
                newAtom.z = atom.z + tz;
                allNewAtoms.push(newAtom);
            }
        }
    }
}

log("Original atoms: " + atoms.length);
log("New atoms added: " + allNewAtoms.length);
log("Total expected: " + (atoms.length * x * y * z));

if (allNewAtoms.length === 1) {
    log("Replication SUCCESS (2x1x1 should add 1 atom)");
} else {
    log("Replication FAILED");
}
