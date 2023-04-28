import React, { StrictMode, useState, useContext, createContext } from 'react';
import ReactDOM from 'react-dom/client';
import Output from './components/Home/home';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import EditJson from './components/EditJSON/editJson';
import Nav from './components/NavBar/nav';

export const LocationContext = createContext(null);
export const UploadedContext = createContext(null);
export const JsonContext = createContext(null);
export const OutputContext = createContext(null);
export const OutputUploadContext = createContext(null);

function App() {
  // Lifted all the states up to the parent at the highest level
  const [fileLocation, setFileLocation] = useState(null);
  const [fileUploaded, setUploaded] = useState(null); // test file uploaded
  const [jsonContent, setJsonContent] = useState(null);
  const [output, setOutput] = useState(null);
  const [outputUploaded, setOutputUploaded] = useState(null);

  // Below contains nested contexts (contexts are pretty much global variables 
  // in a sense). These contexts are used for child components (to change state
  // or to access state variables)
  return (
    <>
      <OutputUploadContext.Provider value={{ outputUploaded, setOutputUploaded }}>
        <OutputContext.Provider value={{ output, setOutput }}>
          <LocationContext.Provider value={{ fileLocation, setFileLocation }}>
            <JsonContext.Provider value={{ jsonContent, setJsonContent }}>
              <Routes>
                <Route path='/' element={<Output setUploaded={setUploaded} fileUploaded={fileUploaded} />} />
                <Route path='/edit' element={<EditJson />} />
              </Routes>
            </JsonContext.Provider>
          </LocationContext.Provider>
        </OutputContext.Provider>
      </OutputUploadContext.Provider>
    </>
  )
}


// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
