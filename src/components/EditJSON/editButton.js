import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "./editButton.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";
const fs = require("fs");

function simulateNetworkRequest() {
  return new Promise((resolve) => setTimeout(resolve, 500));
}

function EditButton() {
  const [isLoading, setLoading] = useState(false);
  const navigate = new useNavigate();

  useEffect(() => {
    if (isLoading) {
      simulateNetworkRequest().then(() => {
        setLoading(false);
        navigate("edit");
      })
    }
  }, [isLoading])

  const handleClick = () => {
    setLoading(true);
  }

  return (
    <>
      <Button variant="secondary" className="editButton"
        onClick={!isLoading ? handleClick : null}>{isLoading ? "Loading..." : "Edit JSON File"}</Button>
    </>
  )
}

export default EditButton