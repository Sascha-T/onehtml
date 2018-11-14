import * as fs from "fs";
import * as fetch from "node-fetch";
import * as path from "path";
import * as zlib from "zlib";
import * as commander from "commander";
let file = "";
let dir = "";
let reaD;
let starte = "<html>\n<head>\n<script>\n";
let middle = "";
let finale = "</script>\n<body onload='onloadX();'>\n</body>\n</head>\n</html>";
let onload = ""
let outfile = path.join(process.cwd(), "fin.html");
function gzip(text) {
    return new Promise((res, rej) => {
        zlib.gzip(text, function(err, buf) {
            var b64 = new Buffer(buf).toString('base64');
            res(b64);
        });
    })
}
function ungzip(text) {
    return new Promise((res, rej) => {
        zlib.gunzip(new Buffer(text, 'base64'), function(err, buf) {
            res(buf.toString())
        });
    })
}
let files = [];
async function main() {
    middle+=`let dcmpjs = atob("${fs.readFileSync(path.join(__dirname, 'ziplib.comp'))}");`
    middle+="eval(dcmpjs);"
    reaD.replace("\r", "")
    let lines = reaD.split("\n")
    for(let lineI in lines)
    {
        let line = lines[lineI];
        let m = line.match(/.*src=\"(.*)\".*/g)
        if (!m)
            continue;
        let mem = m[0].match(/src="(.*)"/g)
        let truest = mem[0]
        let externLoc = truest.substr(5)
        externLoc = externLoc.slice(0, -1)
        if(externLoc.match(/.*:\/\/.*/g)) {
            // External
            let getEm = await gzip(await (await fetch(externLoc)).text());
            files.push({path: externLoc.split("/")[externLoc.split("/").length-1].replace(/\./g, "_").replace(/\,/g, "_"), data: getEm})
        } else {
            // Internal
            let getEm = await gzip(fs.readFileSync(path.join(dir, externLoc), "UTF8"));
            files.push({path: externLoc.replace("\\", "/").split("/")[externLoc.replace("\\", "/").split("/").length-1].replace(/\./g, "_").replace(/\,/g, "_"), data: getEm})
        }
    }
    for(let p in files) {
        let file = files[p];
        middle += `let ${file.path} = "${file.data}";`;
        onload += `eval(JXG.decompress(${file.path}));`
    }
    if(!fs.existsSync(path.join(process.cwd(), outfile)))
        fs.writeFileSync(path.join(process.cwd(), outfile), starte + middle + `function onloadX() {${onload}}` + finale)
    else
        throw new Error("Output file already exists")

}
commander
    .version('1.0.0')
    .option('-i, --input <required>', 'Input file (Can be relative)')
    .option('-o, --output [optional]', 'Output file (default cwd+fin.html) (MUST BE ABSOLUTE)')
    .parse(process.argv);

if(commander.input) {
    if(!fs.existsSync(commander.input))
        throw new Error('File doesn\'t exist')
    if(path.extname(commander.input) != '.html')
        throw new Error('The file isn\'t a html file')
    if(commander.output)
        outfile = commander.output
    file = commander.input
    dir = path.dirname(file);
    reaD = fs.readFileSync(file, "UTF-8")
} else {
    commander.outputHelp();
}
