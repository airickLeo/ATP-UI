const express = require("express");
const app = express();
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const os = require("os");
const path = require("path");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

// Store to storage
let upload = multer({ storage: storage }).single('file');

// Setup post method
app.post("/upload", (req, res) => {
  // upload(req, res, (err) => {
  //   console.log(req.body);
  //   if (err instanceof multer.MulterError || err) {
  //     return res.status(500).json(err);
  //   } 
  //   return res.status(200).send(req.file);
  // })
  return res.status(200).send(req.file);
});

// app.post('/api/run-tests', async (req, res) => {
// const runTests = require("../tests/test_driver.spec")
//   // let tests = req.body.tests;
//   // let results = await runTests(tests);
//   // res.json(results);
// })

app.post('/download', (req, res) => {
  const jsonContent = req.body;

  // Create a unique filename for the downloaded JSON file.
  const timestamp = new Date().getTime();
  const filename = `downloaded-${timestamp}.json`;

  // Determine the path to the user's downloads folder.
  const downloadPath = path.join(os.homedir(), 'Downloads', filename);

  // Write the JSON content to the file.
  try {
    fs.writeFileSync(downloadPath, JSON.stringify(jsonContent));
  } catch (err) {
    console.error(`Error writing file: ${err}`);
    res.status(500).send('Error writing file');
  }

  return res.status(200).send("File downloaded");
});

app.listen(8000, () => {
  console.log("Server listening on 8000...")
});




