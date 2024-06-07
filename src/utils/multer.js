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





const excelUpload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb){
      cb(null, "uploads");
    },
    filename: function(req, file, cb){
      cb(null, Date.now() + "-" + file.originalname);
    }
  }),
  fileFilter: function(req, file, cb) {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Excel files are allowed.'));
    }
  }
});

module.exports = excelUpload;
