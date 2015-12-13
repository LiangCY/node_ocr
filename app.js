var tesseract = require('node-tesseract');
var path = require('path');
var express = require('express');
var multer = require('multer');
var crypto = require('crypto');
var mime = require('mime');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype.indexOf('image') < 0) {
            return cb('Not image file!')
        }
        cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(8, function (err, raw) {
            cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
        });
    }
});
var upload = multer({storage: storage});
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', upload.single('img'), function (req, res) {
    var lang = req.body.lang;
    var img = req.file;
    tesseract.process(path.join(__dirname, img.path), function (err, text) {
        if (err) {
            res.json({
                success: false,
                error: err.message
            });
        } else {
            res.json({
                success: true,
                image: '/uploads/' + img.filename,
                text: '123'
            });
        }
    });
});

app.listen(3000);

