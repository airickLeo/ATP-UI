import React, { StrictMode, createContext, useContext } from 'react';
import './home.css';
import 'bootstrap/dist/css/bootstrap.css';
import FileUploader from '../FileUploader/fileUploader';
import { Alert, Fade, Table, Toast, ToastContainer } from 'react-bootstrap';
import bgImage from "../../background-image/automated-testing.svg"
import EditButton from '../EditJSON/editButton';
import { LocationContext, JsonContext, OutputContext, OutputUploadContext } from "../../index"
import { useState } from 'react';
import ExecuteTest from "../ExecuteTest/executeTest"

/* 
  Notes:
    - The functional component "Output" is the parent component 
    - The other functional components are called by Output
    to parse the uploaded JSON file 
    - The parsing algorithm starts from LoadJson functional component
*/

// Render arrays and objects
function RenderObject(props) {
  const result = Object.entries(props.data).map((data, index) => {
    if (!(typeof data[1] === "object")) {
      return (
        <dd key={index + data[1].toString()}> * {data[0]}: {data[1].toString()} </dd>
      )
    } else {
      // Recursion to obtain all nested data
      return (
        <div key={new Date().getTime() + data[0]}>
          <RenderObject data={data[1]} />
        </div>
      )
    }
  })
  return result;
}

// Render plain objects (key:value pair)
function RenderPair(props) {
  return <div>{props.data[0]}: {props.data[1].toString()}</div>;
}

// child component of LoadJson
class LoadParams extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paramNum: 1,
    }
  }

  arrayHasObj = (arr) => {
    const result = arr.some((element) => {
      return (typeof element === "object");
    })
    return result;
  }

  render() {
    return (
      <td>
        {this.props.data.map((pair, index) => {
          if (typeof (pair[1]) === "object") {
            // Return immediately if array of primitive values
            if (pair[1] instanceof Array && !this.arrayHasObj(pair[1])) {
              return (
                <div key={index}>
                  {pair[0]}: {pair[1].toString()}
                </div>
              )
            }
            // More complex data structures, array of objects or object within objects
            return (
              <dl className='nested-obj' key={index}>
                <dt>{pair[0]}:</dt>
                <RenderObject data={pair[1]} />
              </dl>
            )
          } else {
            return (
              // Key is subject to change once the edit feature is included
              <RenderPair key={index} data={pair} />
            )
          }
        })}
      </td>
    )
  }
}

// This component is the main parsing algorithm 
function LoadJSON({ file }) {
  return (
    <tbody>
      {file.map((obj, key) => {
        return (
          <tr key={"row" + key + obj.action}>
            <td key={key + "." + obj.action}> {obj.action} </td>
            <LoadParams key={"row" + key + obj.action + "Params"}
              data={Object.entries(obj.data)} />
          </tr>
        )
      })}
    </tbody>
  )
}

function Output({ setUploaded, fileUploaded }) {
  const { fileLocation, setFileLocation } = useContext(LocationContext);
  const { jsonContent, setJsonContent } = useContext(JsonContext);
  const { output, setOutput } = useContext(OutputContext);
  const [fileUploadNotif, setUploadNotif] = useState(false);
  const {outputUploaded, setOutputUploaded} = useContext(OutputUploadContext);

  return (
    <>
      <div className='header'>
        <h1 style={{ backgroundImage: bgImage }}> Welcome To The Automated Testing Platform! </h1>
      </div>
      <div className='fileUploaders'>
        <FileUploader key={"testInput"} setFile={(data) => { setFileLocation(data.path) }}
          setFileUploaded={(uploaded) => { setUploaded(uploaded); setUploadNotif(uploaded) }}
          setJsonContent={setJsonContent} uploadType={"test-input"} setOutputUploaded={setOutputUploaded}
          setOutput={setOutput} />
        <FileUploader key={"testOutput"} setFile={(data) => { setFileLocation(data.path) }}
          setFileUploaded={(uploaded) => { setUploaded(uploaded); setUploadNotif(uploaded) }}
          setJsonContent={setJsonContent} uploadType={"output"} setOutputUploaded={setOutputUploaded}
          setOutput={setOutput} />
      </div>
      <ToastContainer position='top-start'>
        <Toast bg='info' delay={5000} autohide show={fileUploadNotif} onClose={() => setUploadNotif(!fileUploadNotif)}>
          <Toast.Header>
            <div className='notif'></div>
            <strong className='me-auto'>Notification</strong>
          </Toast.Header>
          <Toast.Body>
            File Successfully Uploaded
          </Toast.Body>
        </Toast>
      </ToastContainer>
      {fileUploaded && (
        <div>
          <div className='clickable-buttons'>
            <EditButton />
            <ExecuteTest />
          </div>
          <Table striped bordered hover width={"90%"}>
            <thead>
              <tr className='justify-content-center'>
                <th className='actions'>Actions</th>
                <th className='parameters'>Parameters</th>
                <th className='output'>Output</th>
              </tr>
            </thead>
            <LoadJSON file={jsonContent} className='justify-content-center' />
          </Table>
        </div>
      )}
    </>
  )
}

export default Output;