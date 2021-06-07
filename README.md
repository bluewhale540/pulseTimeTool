## About

This tool was created to enable the automated timing of Pulse (and other platforms) page load times across releases. It will read the pages and the content to look for from a CSV file and write the load time to the file.

### Built With

* [Node.js](https://nodejs.org/en/)
* [Protractor](http://www.protractortest.org/#/)

## Getting Started

This guide will give instructions on setting up this tool locally. To get the tool up and running on your local machine, follow these steps.

### Prerequisites

To use this tool you will need the following packages. They can be installed globally with the -g flag after install, if desired.
* npm
  ```sh
  npm install protractor
  npm install csv-parser
  npm install json2csv
  npm install sort-package-json
  ```

Then start a Selenium Server with the following commands. Ignore the update command if it is already up to date. If the running server is different from the default (http://localhost:4444/wd/hub), change seleniumAddress to that instead in the conf.js file.
* WebDriver
  ```sh
  webdriver-manager update
  webdriver-manager start
  ```

## Usage

### Execution
The base command for executing this tool is as follows:
```sh
protractor conf.js --params.parameter=value
```
Alternatively, the equals sign between the parameter and value can be omitted.

The parameters that can be passed are:
<pre>
* params.ip            The IP address
* params.file          The file to read from
* params.outfile       The file to write to; if not given, will write to the input file
* params.username      The username to use on the login screen; default is admin
* params.password      The password to use on the login screen; default is admin
</pre>

At minumum we will need to specify the IP address and file to read/write from, like so:

```sh
protractor conf.js --params.ip x.x.x.x --params.file sample.csv
```

### The CSV
The tool uses a CSV file to read and write its data. The file sample.csv shows the required format; the first three columns must be named 'Page', 'Locator', and 'Content'. In the Page column, a URL or URL suffix can be entered. If a URL suffix is given, it will be prefixed with https://params.ip. The Locator column contains the element locator Protractor should use to find the element in question. The 3 locators supported are class, id, and css. Lastly, the Content column contains the element to wait for. Locator and Content must be found manually; inspect element is a good tool for this. For example, if an element contains: class="k-grid-content", the Locator column should be 'class' and the Content column should be 'k-grid-content'.

The tool will write the most recent data to the fourth column, with older entires extending rightward. Each data column will have a header containing the timestamp the data was obtained.

It is recommended to have separate files for each interface (Pulse, Ravens, etc.), since pages present in one platform but not others will cause the tool to hang.