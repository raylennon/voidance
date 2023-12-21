const express = require('express');
const path = require('path');
const browserSync = require('browser-sync').create();
const fs = require('fs');


const app = express();
const port = 3000;

var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


const jsFilesDirectory = 'public/assets/3D/';
app.get('/objs/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(jsFilesDirectory, fileName+".obj");
    console.log(filePath)
    // Read the JavaScript file
    // res.send("Whee!")
    fs.readFile(filePath, function (err, data) {
        var result = data;

        res.send(result);
    })
});



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


// FOR DEBUG: REFRESHES PAGE ON CHANGE
browserSync.init({
    // URL of the website we want to proxy
    proxy: 'http://localhost:3000',
    files: ["public", ""]
});
