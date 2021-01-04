var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');
var fs = require('fs');
var convert = require('../lib/convert');
const global_config = require('../config/global_config.json');

var storage = multer.diskStorage({
    destination:function(req, file, cb){
        var _path = "uploadFile";
        if(!fs.existsSync(_path)){
            fs.mkdirSync(_path);
        }
        cb(null, _path);
    },
    filename:function(req, file, cb){
        cb(null, file.originalname);
    }
});

var upload = multer({storage:storage, limits: { fileSize: global_config.max_file_size*1024*1024 }});

/* GET users listing. */
router.post('/', upload.single('avatar'), function(req, res, next) {
    console.log('upload path: '+req.file.path);
    convert(req.file.path);
    //{code:200, msg:'upload successfully!'}
    res.end();
});

module.exports = router;
