## About

This tool was created to enable the automated timing of Pulse (and other platforms) page load times across releases. It will read the pages from a CSV file and write the load time to the file. This tool is primarily intended to time the Pulse interface, but may be used with other platforms if they use loading overlays.

### Author

* Mathew Pham

### Built With

* [Node.js](https://nodejs.org/en/)
* [Protractor](http://www.protractortest.org/#/)

## Getting Started

This guide will give instructions on setting up this tool locally. To get the tool up and running on your local machine, follow these steps.

### Prerequisites

To use this tool you will need the following packages:
* npm
  ```sh
  npm install -g protractor
  npm install csv-parser@3.0.0
  npm install json-2-csv@3.13.0
  npm install sort-package-json@1.50.0
  ```

Then execute the tool using the command in the Execution section. The tool is configured to start a Selenium server on a random port and shut it down when it finishes. To manually start the Selenium server, uncomment the seleniumAddress line in conf.js and execute the two commands below. Ignore the update command if WebDriver is already up to date. If the running server is different from the default (http://localhost:4444/wd/hub), change seleniumAddress to that instead in the conf.js file.
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
* params.ip               The IP address
* params.file             The file to read from
* params.outfile          The file to write to; if not given, will write to the input file
* params.username         The username to use on the login screen; default is admin
* params.password         The password to use on the login screen; default is admin
* params.initialtimeout   The maximum time to wait for the first overlay to appear;
                          default is 300000 (5 minutes)
* params.overlaytimeout   The maximum time to wait for a single overlay to disappear; 
                          default is 300000 (5 minutes)
</pre>

At minumum we will need to specify the IP address and file to read/write from, like so:

```sh
protractor conf.js --params.ip=x.x.x.x --params.file=sample.csv
```

### The CSV
The tool uses a CSV file to read and write its data. The file sample.csv shows the required format; the first column must be named 'Page', where a URL or URL suffix can be entered. If a URL suffix is given, it will be prefixed with https://params.ip.

The tool will write the most recent data to the second column, with older entires extending rightward. Each data column will have a header containing the timestamp the data was obtained.

It is recommended to have separate files for each interface (Pulse, Ravens, etc.), since pages present in one platform but not others will cause the tool to hang.

## Jenkins Build
The tool is also set up as a Jenkins job for ease of use across teams and platforms. To run the tool on the remote automation server, go to the Pulse_Page_Load_Timing_Tool job in Jenkins and click "Build with Parameters." 

![jenkins-build.png](https://i.postimg.cc/x1q5XRCh/jenkins-build.png)

Ensure the parameters are as desired and upload a file containing the links like pulseData.csv, then click "Build." Files output from previous runs can also be used, since the latest times will be written to the second column, producing a running history of times. 

![jenkins-running.png](https://i.postimg.cc/VsDXXC38/jenkins-running.png)

Once the job has completed, the output csv will be saved as a build artifact availible to download.

![output.png](https://i.postimg.cc/qv0tYMfL/output.png)

## Notes
* http://192.0.43.10/ must be accessible for the tool to return accurate load times, since the tool loads this example domain in between each page specified on the csv. This forces the browser to load the next page from scratch instead of partially relying on the already loaded components on the previous page, which shortens load times. If access to the above link cannot be obtained, any other page not in the Pulse interface can be used instead, such as 8.8.8.8 or google.com. To disable this behavior, comment out line 50 of csvIO.js.

### Screenshots

![time-tool.png](https://i.postimg.cc/cJrRJ4DS/time-tool.png)
![overlay.png](https://i.postimg.cc/sxBq9rDd/overlay.png)
![loading.png](https://i.postimg.cc/L8zdb2km/loading.png)
![loaded.png](https://i.postimg.cc/PrVcVN8G/loaded.png)