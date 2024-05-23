const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const FileModel = require("../models/file");

const uploadDirectoryPath = path.join(__dirname, "..", "files");

console.log(uploadDirectoryPath);

const storage  = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectoryPath)
    },
    filename: (req, file, cb) => {
        // console.log(file.originalname);
        const fileName = uuidv4() + path.extname(file.originalname);
        cb(null, fileName);
    },
})

const upload = multer({
    storage : storage,
}).single("file");


const uploadFile = async(req,res) => {
    try {
        upload(req,res, async (error) => {
            if(error){
                console.log("Error While Uploading");
                return res.status(500).json({
                    success: false,
                    message: "Error While Uploading",
                });
            }

            //save to DB
            // console.log(req.file);

            const newFile = new FileModel({
                originalFileName : req.file.originalname,
                newFileName : req.file.filename,
                path : req.file.path
            })

            const newlyInsertedFile = await newFile.save();
            console.log("File uploaded successfully");
            res.json({
                success: true,
                message: "File uploaded successfully",
                fileId : newlyInsertedFile._id,
            });
        })
    } 
    catch (error) {
        res.json({
            success: false,
            message: "Error While File Uploaded",
          });
    }
}

const generateDynamicLink = async(req,res) => {
    
}

const downloadFile = async(req,res) => {
    
}

const sendFile = async(req,res) => {
    
}

const fileControllers = {
    uploadFile,generateDynamicLink,downloadFile,sendFile
}

module.exports = fileControllers;