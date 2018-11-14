"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs = require("fs");
var fetch = require("node-fetch");
var path = require("path");
var zlib = require("zlib");
var commander = require("commander");
var file = "";
var dir = "";
var reaD;
var starte = "<html>\n<head>\n<script>\n";
var middle = "";
var finale = "</script>\n<body onload='onloadX();'>\n</body>\n</head>\n</html>";
var onload = "";
var outfile = path.join(process.cwd(), "fin.html");
function gzip(text) {
    return new Promise(function (res, rej) {
        zlib.gzip(text, function (err, buf) {
            var b64 = new Buffer(buf).toString('base64');
            res(b64);
        });
    });
}
function ungzip(text) {
    return new Promise(function (res, rej) {
        zlib.gunzip(new Buffer(text, 'base64'), function (err, buf) {
            res(buf.toString());
        });
    });
}
var files = [];
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var lines, _a, _b, _i, lineI, line, m, mem, truest, externLoc, getEm, _c, getEm, p, file_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    middle += "let dcmpjs = atob(\"" + fs.readFileSync(path.join(__dirname, 'ziplib.comp')) + "\");";
                    middle += "eval(dcmpjs);";
                    reaD.replace("\r", "");
                    lines = reaD.split("\n");
                    _a = [];
                    for (_b in lines)
                        _a.push(_b);
                    _i = 0;
                    _d.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                    lineI = _a[_i];
                    line = lines[lineI];
                    m = line.match(/.*src=\"(.*)\".*/g);
                    if (!m)
                        return [3 /*break*/, 7];
                    mem = m[0].match(/src="(.*)"/g);
                    truest = mem[0];
                    externLoc = truest.substr(5);
                    externLoc = externLoc.slice(0, -1);
                    if (!externLoc.match(/.*:\/\/.*/g)) return [3 /*break*/, 5];
                    _c = gzip;
                    return [4 /*yield*/, fetch(externLoc)];
                case 2: return [4 /*yield*/, (_d.sent()).text()];
                case 3: return [4 /*yield*/, _c.apply(void 0, [_d.sent()])];
                case 4:
                    getEm = _d.sent();
                    files.push({ path: externLoc.split("/")[externLoc.split("/").length - 1].replace(/\./g, "_").replace(/\,/g, "_"), data: getEm });
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, gzip(fs.readFileSync(path.join(dir, externLoc), "UTF8"))];
                case 6:
                    getEm = _d.sent();
                    files.push({ path: externLoc.replace("\\", "/").split("/")[externLoc.replace("\\", "/").split("/").length - 1].replace(/\./g, "_").replace(/\,/g, "_"), data: getEm });
                    _d.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 1];
                case 8:
                    for (p in files) {
                        file_1 = files[p];
                        middle += "let " + file_1.path + " = \"" + file_1.data + "\";";
                        onload += "eval(JXG.decompress(" + file_1.path + "));";
                    }
                    if (!fs.existsSync(path.join(process.cwd(), outfile)))
                        fs.writeFileSync(path.join(process.cwd(), outfile), starte + middle + ("function onloadX() {" + onload + "}") + finale);
                    else
                        throw new Error("Output file already exists");
                    return [2 /*return*/];
            }
        });
    });
}
commander
    .version('1.0.0')
    .option('-i, --input <required>', 'Input file (Can be relative)')
    .option('-o, --output [optional]', 'Output file (default cwd+fin.html) (MUST BE ABSOLUTE)')
    .parse(process.argv);
if (commander.input) {
    if (!fs.existsSync(commander.input))
        throw new Error('File doesn\'t exist');
    if (path.extname(commander.input) != '.html')
        throw new Error('The file isn\'t a html file');
    if (commander.output)
        outfile = commander.output;
    file = commander.input;
    dir = path.dirname(file);
    reaD = fs.readFileSync(file, "UTF-8");
}
else {
    commander.outputHelp();
}
