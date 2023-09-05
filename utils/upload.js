const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

const fileValidator = (req, file, cb) => {
    const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg'];

    if (allowedFormats.includes(file.mimetype)) {
        return cb(null, true);
    }
    return cb(null, false);
}

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGOIN
});


const storage = multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET,
    acl: 'public-read', 
  
    key: (req, file, cb) => {
        const ext = path.extname(file.originalname);
            let temp = "img/";
            if(ext == ".mp3"){
                temp = "audio/"
            }
            cb(null, temp + Date.now().toString() + "-" + file.originalname);
    }

});

const limits = { fileSize: 1024 * 1024 * 5 };

module.exports = multer({ storage, fileFilter: fileValidator, limits });