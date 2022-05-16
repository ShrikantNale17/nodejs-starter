const multer = require('multer');
// const logger =

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'src/uploads')
        },
        filename: function (req, file, cb) {
            console.log(file);
            cb(null, file.fieldname + '-' + Date.now() + '.jpg')
        }
    }),
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            // upload only png and jpg format
            return cb(new Error("Please upload a Image"));
        }
        cb(undefined, true);
        // cb(undefined, {...req.body, file});
    }
})

module.exports = upload