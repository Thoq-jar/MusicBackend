const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const { exec } = require('child_process');
const os = require('os');

const VERSION = 'v1.3';
const PORT = '3000';

console.clear();
console.log("----------------------------------------------------");
console.log(`SlateBackend server ${VERSION}`);
console.log("Developed by Tristan @ Thoq Industries");
console.log("Node.js Version: " + process.version);
exec('npm -v', (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
});
console.log("CPU: " + os.cpus()[0].model);
console.log("RAM: " + Math.round(os.totalmem() / 1024 / 1024) + " MB");
console.log("----------------------------------------------------");
console.log(" ");

app.use(cors({
    origin: 'http://localhost:11111',
    methods: ['GET'],
    credentials: true
}));

app.get('/songs/:filename', (req, res) => {
    res.sendFile(path.join(__dirname, req.params.filename));
});

app.get('/songs/:filename', (req, res) => {
    res.sendFile(path.join(__dirname, 'songs', req.params.filename));
});

app.get('/songs', (req, res) => {
    fs.readdir('./', (err, files) => {
        if (err) {
            res.status(500).send({ error: 'Failed to read directory' });
        } else {
            const songs = files
               .filter(file => ['.wav', '.mp3', '.ogg', '.flac', '.m4a', '.aac', '.wma', 
                '.aiff', '.alac', '.ape', '.dsd', '.dsf', '.dff', '.mp4', '.m4a', '.aac'].includes(path.extname(file)))
               .map(file => ({ name: path.basename(file, path.extname(file)), extension: path.extname(file) }));
            res.json(songs);
        }
    });
});


function getInternalIP() {
    const networkInterfaces = os.networkInterfaces();
    let internalIP = 'unknown';

    for (const name of Object.keys(networkInterfaces)) {
        for (const netInfo of networkInterfaces[name]) {
            if (netInfo.family === 'IPv4' && !netInfo.internal) {
                internalIP = netInfo.address;
                break;
            }
        }
    }

    return internalIP;
}

app.listen(3000, () => {
    console.log('[SlateBackend] → Server Running...');
    console.log(`[SlateBackend] → Local server running at http://localhost:${PORT}/`);
    console.log(`[SlateBackend] → Network server running at http://${getInternalIP()}:${PORT}/`);
    console.log(" ");
});