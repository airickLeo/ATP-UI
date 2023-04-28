import axios from "axios";
import { useContext, useState } from "react";
import { Button, Toast, ToastContainer } from "react-bootstrap";
import { JsonContext } from "../..";

/* 
  Notes:
  - Below component implements the downloading feature in the edit page
*/

function Download({ data, setDownloaded }) {
  const { jsonContent } = useContext(JsonContext);

  const handleDownload = () => {
    //API call to download to local diskstorage
    axios.post("http://localhost:8000/download", jsonContent).then(
      (res) => {
        if (res.status === 200) {
          setDownloaded(true);
        }
      }
    ).catch("There was an error downloading the JSON file")
  }
  return (
    <>
      <Button type="submit" onClick={() => handleDownload()}>
        Download Current
      </Button>
    </>
  )
}

export default Download;