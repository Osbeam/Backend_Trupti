const multer = require("multer");
    const imgUpload = multer({
        storage:multer.diskStorage({
            destination: function(req, file, cb){
                cb(null, "uploads")
            },
            filename:function(req, file, cb){
                cb(null, Date.now()+file.originalname)
            }
        })
    })



module.exports = imgUpload;