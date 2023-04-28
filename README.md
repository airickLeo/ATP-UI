### Introduction
This web app serves to display the contents within JSON files that will be used to run tests in
the Playwright platform. The web app also allows users to edit the uploaded JSON file and
download a modified version of it

### Installation
Download all required files and modules from package.json

### Running the web app
1. cd to atp-ui
2. start backend server with nodemon
3. start frontend with react through "npm start"

### Currently Existing Bugs
1. In the edit routing page, the UI contains bugs
when changing object key names (For example, changeXVal for action: changeMarker). The cause of this unexpected
behaviour is because JS doesn't allow empty key names
2. Currently, the editing feature was not implemented
for objects within object (i.e key value pairs in option, under moreOptions, of action: useToolbar ).
"HandleObject" component ini editJson.js under EditJSON directory needs to include an algorithm
to detect objects in object, and needs to include its own handler for onChange.

### Expectation / to be implemented
- The "Run Test" button was originally designed to directly run the 
Playwright platform. But this method is currently not viable, so
the "Results Uploader" was created to allow users to upload test results from Playwright platform, and the UI will render the results
__refer to test_driver.spec.js for more comments regarding this__
- If directly executing Playwright platform doesn't turn out to be viable, then create an algorithm to parse the uploaded results file and display it with the UI.
- Allow users to name the file they download in the edit page
- Allow users to run test both on the production and the dev page (currently only runs with dev, since all the locators are currently based on production)
- Add a download button on home page if needed

