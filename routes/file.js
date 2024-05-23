const express = require("express");
const router = express.Router();

const fileControllers = require("../controllers/file");

router.post("/api/files/",fileControllers.uploadFile)

router.get("/files/:uuid", fileControllers.generateDynamicLink)

router.get("/files/download/:uuid", fileControllers.downloadFile)

router.post("/api/files/send", fileControllers.sendFile)


module.exports = router;