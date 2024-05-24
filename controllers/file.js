const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");

const FileModel = require("../models/file");

const transporter = nodemailer.createTransport({
    host: "127.0.0.1",
    port: 1025,
    secure: false,
    debug: true, // Enable debug mode
    logger: true // Enable logger
});

  

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
            console.log(req.file);

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
    try {
        // console.log(req.params.uuid);
        const fileId = req.params.uuid;
        const file = await FileModel.findById(fileId)

        //check if file is present in our mongoDB Database 
        if(!file){
            return res.status(404).json({
                success : false,
                message : "File With Given Id Not Found"
            })
        }
        res.json({
            success: true,
            message: "Generate Link Successfully",
            result: "http://localhost:5050/files/download/" + fileId
        });
    } 
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error While Generate Link",
        });
    }
}

const downloadFile = async(req,res) => {
    try {
        const fileId = req.params.uuid;
        const file = await FileModel.findById(fileId)

        if(!file){
            // DB Doesn't have this file information
            return res.end("File with given ID not found");
        }

        res.download(file.path,file.originalFileName)   
    }

    catch (error) {
        res.json({
            success: false,
            message: "Error While Download File",
        });
    }
}

const sendFile = async(req,res) => {
    try {
        console.log(req.body);
        const {fileId,shareTo} = req.body;
        const downloadableLink = "http://localhost:5050/files/download/" + fileId;

        const info = await transporter.sendMail({
            from: "do-not-reply@file-sharing.com", // sender address
            to: shareTo, // list of receivers
            subject: "A new file has been shared from File Sharing Platform", // Subject line
            html: `
              <html>
              <head>
              </head>
              <body>
                Your friend has shared a new file with you click the below link to download the file
              <br />
              <a href="${downloadableLink}">Click Here</a>
              </body>
              </html>
            `,
          });
        
        console.log("Message sent: %s", info.messageId);

        res.json({
            success: true,
            message: "Sending File  Successfully",
        });
    } 
    catch (error) {
        res.json({
            success: false,
            message: "Error While Sending File",
        });
    }
}

const fileControllers = {
    uploadFile,generateDynamicLink,downloadFile,sendFile
}

module.exports = fileControllers;