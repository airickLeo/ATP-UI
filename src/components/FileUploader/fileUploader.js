import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, Form, Toast, ToastContainer } from 'react-bootstrap';
import "./fileUploader.css"
import axios from "axios"
import { OutputContext } from '../..';

/* 
  Notes:
    - Below functional component implements the file uploader the user will see 
    on the home page
    - Currently used for uploading Test JSON and Results JSON
*/

function FileUploader({ setFile, setJsonContent, setFileUploaded, uploadType, setOutput, setOutputUploaded }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [json, setJson] = useState(null);
  const [wrongFileMsg, setWrongFileMsg] = useState("");
  const {output} = useContext(OutputContext);

  const handleFileInput = (event) => {
    const file = event.target.files[0];
    if ((typeof file != "undefined") && (file.type != "application/json")) {
      setWrongFileMsg("The uploaded file is not in JSON format, please upload another file");
      return;
    } else if (typeof file == "undefined") {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const json = JSON.parse(event.target.result);
      setJson(json);
    };
    reader.readAsText(file);
    setSelectedFile(file);
  };

  const handleSubmitInput = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedFile);
    axios.post("http://localhost:8000/upload", formData).then(
      (res) => {
        if (res.status === 200) {
          // setFileUploaded(true);
          // setFilePath(res.data.path);
          setFileUploaded(true);
          setFile(res.data);
          setJsonContent(json);
        }
      }
    ).catch(err => {
      console.log(err);
    });
  };

  const handleSubmitOutput = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedFile);
    axios.post("http://localhost:8000/upload", formData).then(
      (res) => {
        if (res.status === 200) {
          setOutput(res.data);
          console.log(res.data);
        }
      }
    ).catch(err => {
      console.log(err);
    });
  };

  return (
    <>
      <ToastContainer position='top-start'>
        <Toast delay={7000} autohide show={wrongFileMsg != ""} 
        onClose={() => {setWrongFileMsg(""); uploadType === "output" ? setOutputUploaded(false) :
         setFileUploaded(false)}} bg="danger">
          <Toast.Header>
            <strong className='me-auto'>Error</strong>
          </Toast.Header>
          <Toast.Body>
            {wrongFileMsg}
          </Toast.Body>
        </Toast>
      </ToastContainer>
      <div className='upload'>
        {uploadType === "output" ? <h2>Upload Test Result</h2>: <h2>Upload Test JSON File</h2>}
        <form onSubmit={uploadType === "output" ? handleSubmitOutput : handleSubmitInput}>
          <Form.Control type='file' name='file' onChange={handleFileInput} />
          <Button disabled={!selectedFile} variant='primary' size='sm' type="submit">Upload</Button>
        </form>
      </div>
    </>
  );
}

export default FileUploader;
