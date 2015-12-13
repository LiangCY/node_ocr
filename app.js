var tesseract = require('node-tesseract');
var path = require('path');
var express = require('express');
var multer = require('multer');
var crypto = require('crypto');
var mime = require('mime');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/images')
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(8, function (err, raw) {
            cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
        });
    }
});
var upload = multer({storage: storage});
var app = express();

app.use(express.static(__dirname + '/uploads'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', upload.single('img'), function (req, res) {
    var lang = req.body.lang;
    var img = req.file;
    if (lang == 'EN') {
        tesseract.process(path.join(__dirname, img.path), function (err, text) {
            if (err) {
                res.json({
                    success: false,
                    error: err.message
                });
            } else {
                res.json({
                    success: true,
                    text: text
                });
            }
        });
    }
    else if (lang == 'CH') {
        var options = {
            l: 'chi_sim'
        };
        tesseract.process(path.join(__dirname, img.path), options, function (err, text) {
            if (err) {
                res.json({
                    success: false,
                    error: err.message
                });
            } else {
                res.json({
                    success: true,
                    text: text
                });
            }
        });
    }
});

app.get('/test', function (req, res) {
    //tesseract.process(__dirname + '/hask.jpg', function (err, text) {
    //    if (err) {
    //        console.log(err);
    //        res.send(err);
    //    } else {
    //        res.send(text);
    //    }
    //});
});

app.listen(3000);

