import { LocationContext, JsonContext } from "../../index"
import { useContext, useEffect, useState, useRef } from "react";
import { Button, ButtonGroup, Dropdown, Form, FormControl, FormGroup, FormLabel, Toast, ToastContainer } from "react-bootstrap";
import "./editJson.css"
import { useNavigate } from "react-router-dom";
import Download from "../DownloadFile/download";

function HandleObject(props) {
  const handleKeyChange = (index, newKeyName, testName, originalEntry, keyName, propertyIndex) => {
    props.setEditableJson(prevState => {
      const editableJsonCopy = JSON.parse(JSON.stringify(prevState));
      const entryCopy = JSON.parse(JSON.stringify(originalEntry));

      const entries = Object.entries(entryCopy.data[testName]);
      entries[propertyIndex] = [newKeyName, entries[propertyIndex][1]];
      const result = Object.fromEntries(entries);
      console.log(entries);
      console.log(Object.fromEntries(entries));

      const editedCopy = {
        ...entryCopy, "data": {
          ...entryCopy.data,
          [testName]: {
            ...result
          }
        }
      }

      return ([
        ...editableJsonCopy.slice(0, index),
        {
          ...editedCopy
        },
        ...editableJsonCopy.slice(index + 1)
      ])
    })
  }

  const handlePropertyChange = (index, newValue, testName, originalEntry, keyName, propertyIndex) => {
    const editableJsonCopy = JSON.parse(JSON.stringify(props.editableJson));
    const entryCopy = JSON.parse(JSON.stringify(originalEntry));
    const entries = Object.entries(entryCopy.data[testName]);
    entries[propertyIndex] = [keyName, newValue];
    const result = Object.fromEntries(entries);

    const editedCopy = {
      ...entryCopy, "data": {
        ...entryCopy.data,
        [testName]: {
          ...result
        }
      }
    }

    props.setEditableJson([
      ...editableJsonCopy.slice(0, index),
      {
        ...editedCopy
      },
      ...editableJsonCopy.slice(index + 1)
    ])
  }

  const handleArrayKeyChange = (index, newKeyName, testName, originalEntry, keyName, propertyIndex, arrayIndex) => {
    const editableJsonCopy = JSON.parse(JSON.stringify(props.editableJson));
    const entryCopy = JSON.parse(JSON.stringify(originalEntry));
    let entries = entryCopy.data[testName];

    const result = [];

    for (const entry of Object.entries(entries[arrayIndex])) {
      if (entry[0] === keyName) {
        result.push([newKeyName, entry[1]])
      } else {
        result.push(entry);
      }
    }

    entries[arrayIndex] = Object.fromEntries(result);

    const editedCopy = {
      ...entryCopy, "data": {
        ...entryCopy.data,
        [testName]: entries
      }
    }

    props.setEditableJson([
      ...editableJsonCopy.slice(0, index),
      editedCopy,
      ...editableJsonCopy.slice(index + 1)
    ])
  }

  const handleArrayValueChange = (index, newValue, testName, originalEntry, keyName, propertyIndex, arrayIndex) => {
    const editableJsonCopy = JSON.parse(JSON.stringify(props.editableJson));
    const entryCopy = JSON.parse(JSON.stringify(originalEntry));
    let entries = entryCopy.data[testName];

    const result = [];

    for (const entry of Object.entries(entries[arrayIndex])) {
      if (entry[0] === keyName) {
        result.push([entry[0], newValue])
      } else {
        result.push(entry);
      }
    }

    entries[arrayIndex] = Object.fromEntries(result);

    const editedCopy = {
      ...entryCopy, "data": {
        ...entryCopy.data,
        [testName]: entries
      }
    }

    props.setEditableJson([
      ...editableJsonCopy.slice(0, index),
      editedCopy,
      ...editableJsonCopy.slice(index + 1)
    ])
  }

  let propCounter = 1;

  return (
    <>
      {Object.entries(props.input).map((data, propertyIndex) => {
        if (typeof (data[1]) != "object") {
          if (props.isArray) {
            return (
              <div className="obj-keyValue-pair" key={`entry-${props.entryIndex}-test-${props.testIndex}-pair-${propertyIndex}`}>
                <FormLabel>Property Key</FormLabel>
                <FormControl className="obj-key" type="text" value={data[0]}
                  key={`key-${propertyIndex}-${propCounter++}`}
                  onChange={(e) => handleArrayKeyChange(props.entryIndex, e.target.value, props.test, props.entry, data[0], propertyIndex, props.arrayIndex)} />
                <FormLabel>Property Value</FormLabel>
                <FormControl className="obj-value" type="text" value={data[1]}
                  key={`value-${propertyIndex}`}
                  onChange={(e) => handleArrayValueChange(props.entryIndex, e.target.value, props.test, props.entry, data[0], propertyIndex, props.arrayIndex)}
                />
              </div>
            )
          } else {
            return (
              <div className="obj-keyValue-pair" key={`entry-${props.entryIndex}-test-${props.testIndex}-pair-${propertyIndex}`}>
                <FormLabel>Property Key</FormLabel>
                <FormControl className="obj-key" type="text" value={data[0]}
                  key={`key-${propertyIndex}-${propCounter++}`}
                  onChange={(e) => handleKeyChange(props.entryIndex, e.target.value, props.test, props.entry, data[0], propertyIndex)} />
                <FormLabel>Property Value</FormLabel>
                <FormControl className="obj-value" type="text" value={data[1]}
                  key={`value-${propertyIndex}`}
                  onChange={(e) => handlePropertyChange(props.entryIndex, e.target.value, props.test, props.entry, data[0], propertyIndex)}
                />
              </div>
            )
          }
        } else {
          return (
            <HandleObject key={`handle-recursion-test-${props.testIndex}-list-${propertyIndex}`} entryIndex={props.entryIndex} test={props.test} testIndex={props.testIndex} input={data[1]} entry={props.entry} editableJson={props.editableJson} setEditableJson={props.setEditableJson} isArray={true} arrayIndex={propertyIndex}/>
          )
        }
      })}
    </>
  )
}

function EditJson() {
  const { fileLocation, setFileLocation } = useContext(LocationContext);
  const { jsonContent, setJsonContent } = useContext(JsonContext);

  const [editableJson, setEditableJson] = useState(JSON.parse(JSON.stringify(jsonContent)));
  const [saveChanges, setSave] = useState(false);
  const navigate = new useNavigate();

  const [fileDownloaded, setDownloaded] = useState(false);

  const handleActionChange = (index, value, originalEntry) => {
    const editableJsonCopy = JSON.parse(JSON.stringify(editableJson));
    const entryCopy = JSON.parse(JSON.stringify(originalEntry));

    setEditableJson([
      ...editableJsonCopy.slice(0, index),
      { ...entryCopy, "action": value },
      ...editableJsonCopy.slice(index + 1)
    ])
  }

  const handleSingleInputChange = (index, value, testName, originalEntry) => {
    const editableJsonCopy = JSON.parse(JSON.stringify(editableJson));
    const entryCopy = JSON.parse(JSON.stringify(originalEntry));
    setEditableJson([
      ...editableJsonCopy.slice(0, index),
      {
        ...entryCopy, "data": {
          ...entryCopy.data,
          [testName]: value
        }
      },
      ...editableJsonCopy.slice(index + 1)
    ])
  }

  const handleSimpleArrayChange = (index, value, testName, originalEntry, paramIndex) => {
    const editableJsonCopy = JSON.parse(JSON.stringify(editableJson));
    const entryCopy = JSON.parse(JSON.stringify(originalEntry));
    entryCopy.data[testName][paramIndex] = value;
    setEditableJson([
      ...editableJsonCopy.slice(0, index),
      {
        ...entryCopy, "data": {
          ...entryCopy.data
        }
      },
      ...editableJsonCopy.slice(index + 1)
    ])
  }

  // Rename a specific test
  const handleTestChange = (index, newTestName, testName, originalEntry) => {
    setEditableJson(prevState => {
      const editableJsonCopy = JSON.parse(JSON.stringify(prevState));
      const entryCopy = JSON.parse(JSON.stringify(originalEntry));

      // Create a new Object to switch the key name based on input
      const updatedData = Object.fromEntries(
        Object.entries(originalEntry.data).map(
          ([key, value]) => ((key === testName) ? [newTestName, value] : [key, value])
        )
      );

      console.log(updatedData);

      // Create a new copy of the entry with modified test names
      const updatedEntry = { ...entryCopy, "data": updatedData };

      return [
        ...editableJsonCopy.slice(0, index),
        updatedEntry,
        ...editableJsonCopy.slice(index + 1)
      ]
    })
  }

  useEffect(() => {
    if (saveChanges) {
      setJsonContent(editableJson);
    }
  })

  return (
    <>
      <ToastContainer>
        <Toast bg='success' delay={5000} autohide show={saveChanges} onClose={() => setSave(!saveChanges)}
          style={{ position: "fixed", top: "2%", right: "3%" }}>
          <Toast.Header>
            <div className='notif'></div>
            <strong className='me-auto'>Notification</strong>
          </Toast.Header>
          <Toast.Body style={{ color: "white" }}>
            Changes Saved!
          </Toast.Body>
        </Toast>
      </ToastContainer>
      <ToastContainer position='top-start'>
        <Toast delay={7000} autohide show={fileDownloaded}
          onClose={() => setDownloaded(!fileDownloaded)} bg="success">
          <Toast.Header>
            <strong className='me-auto'>Notification</strong>
          </Toast.Header>
          <Toast.Body>
            File Successfully Download To Downloads Folder
          </Toast.Body>
        </Toast>
      </ToastContainer>
      <div className="toolbar">
        <Dropdown as={ButtonGroup} style={{ position: "fixed", top: `3%`, right: "10%" }}>
          <Download setDownloaded={setDownloaded}/>
          <Dropdown.Toggle split variant="primary" id="toolbar-dropdown" />
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => navigate("/")}>Back To Home</Dropdown.Item>
            <Dropdown.Item onClick={() => setSave(true)}>Save Changes</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div>
        {editableJson && (
          <Form>
            {editableJson.map((entry, entryIndex) => (
              <div className="editJsonGroup" key={`editJsonGroup-entry-${entryIndex}`}>
                <FormGroup className="mb-3" key={`entry-${entryIndex}`} controlId={`form-control-${entryIndex}`}>
                  <FormLabel> <b>Action</b> </FormLabel>
                  <FormControl type="text" value={entry.action}
                    onChange={(e) => handleActionChange(entryIndex, e.target.value, entry)} />
                </FormGroup>

                {Object.entries(entry.data).map(([test, input], testIndex) => (
                  <FormGroup className="test-input-pair" key={`entry-${entryIndex}-test-${testIndex}`}
                    controlId={`sub-control-${entryIndex}-${testIndex}`}>
                    <FormLabel><em>Test Name</em></FormLabel>
                    <FormControl className="mb-3" type="text" value={test}
                      onChange={(e) => handleTestChange(entryIndex, e.target.value, test, entry)}
                    />
                    <FormLabel><em>Value(s)</em></FormLabel>
                    {typeof input === "object" ? (
                      <>
                        {/* An Array of primitive values */}
                        {((input instanceof Array) && !(input.some((element) => (typeof element === "object")))) ? (
                          <>
                            {input.map((inputValue, paramIndex) => (
                              <FormControl className="mb-3"
                                key={`entry-${entryIndex}-test-${testIndex}-parameter-${paramIndex}`}
                                type="text" value={inputValue}
                                onChange={(e) => handleSimpleArrayChange(entryIndex, e.target.value, test, entry, paramIndex)} />
                            ))}
                          </>
                        ) : (
                          <HandleObject entryIndex={entryIndex} test={test} testIndex={testIndex} input={input}
                            entry={entry} editableJson={editableJson} setEditableJson={setEditableJson}
                          />
                        )}
                      </>
                    ) : (
                      <FormControl className="mb-3" type="text" value={input}
                        onChange={(e) => handleSingleInputChange(entryIndex, e.target.value, test, entry)} />
                    )}
                  </FormGroup>
                ))}
              </div>
            ))}
          </Form>
        )}
      </div>
      {/* {console.log(editableJson)} */}
    </>
  )
}

export default EditJson