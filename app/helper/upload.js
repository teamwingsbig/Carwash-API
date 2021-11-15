const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, path.join(__dirname, '../Uploads/'))
        cb(null, 'Uploads/')
    },
    filename: function (req, file, cb) {
        filename = Date.now() + '-' + file.originalname;
        cb(null, filename)
    }
})
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5   // 5MB
    }
});
// var upload = multer({ dest: 'uploads/' })

module.exports=upload;
