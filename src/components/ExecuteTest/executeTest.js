import axios from "axios";
import { ReactDOM, useContext } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { JsonContext, LocationContext } from "../..";
import "./executeTest.css"

/* 
  Notes:
    - The code below was intended to directly run the Playwright platform through the
    API endpoint
    - However, this was not viable at the moment
*/

function ExecuteTest() {
  const { fileLocation } = useContext(LocationContext);
  const { jsonContent, setJsonContent } = useContext(JsonContext);
  const handleRunTest = () => {
    axios.post("http://localhost:8000/api/run-tests", {
      tests: jsonContent
    }).then(response => {
      console.log(response.data)
    }).catch(error => {
      console.error("An error occurred when attempting to run tests", error)
    })
  }

  return (
    <Button className="runTest" type="link" variant="info"
      onClick={() => handleRunTest()}>Run Test</Button>
  )
}

export default ExecuteTest;