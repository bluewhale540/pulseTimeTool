const fs = require('fs');
const csv = require('csv-parser');
let converter = require('json-2-csv');
let pulsePage = require('./pulsePage');
const sortPackageJson = require('sort-package-json');

/**
 * Reads a csv file that contains rows corresponding to pages to test. The CSV
 * should have columns for the page URL, the element locator to use, and the 
 * content to wait for, titled 'Page', 'Locator', and 'Content', respectively.
 * 
 * @param {String} file The name of the file to be read.
 * @returns a Promise that resolves to an array of JSONs representing the csv 
 * file when it has been read, where each row is a JSON.
 */
async function readCSV(file) {
    let processed = [];
    return new Promise((resolve) => {
        fs.createReadStream(file)
        .pipe(csv())
        .on('data', (row) => {
            processed.push(row);
        })
        .on('end', () => {
            resolve(processed);
        });
    })
}

/**
 * Calculates the finish times for each page and adds it to a new field in each JSON titled
 * the date in ISO format.
 * 
 * @param {Array} jsons An array of JSONs representing the csv file, where each JSON/row
 * corresponds to a page to test.
 * @param {int} maxTime The maximum amount of time the element can take to load before failing the spec.
 */
async function getTimes(jsons, maxTime) {
    // get the date to use as the column header for the new data
    const now = new Date(Date.now());
    const today = now.toISOString();
    // get array of header labels and splice the new date into the most recent position
    let sortKeys = Object.keys(jsons[0]);
    sortKeys.splice(1, 0, today);
    //console.log(sortKeys);
    
    for await (let [index, json] of jsons.entries()) {
        // loading a dummy page forces the browser to load the next page from scratch, 
        // instead of reusing the already loaded page's base
        pulsePage.loadPulse('http://192.0.43.10/');
        
        startTime = Date.now()
        
        // if the page entry starts with a slash, it needs the IP added on first
        if (json.Page[0] == '/') {
            let fullPage = 'https://' + browser.params.ip + json.Page;
            console.log('\x1b[33m%s\x1b[0m', '\n' + fullPage); // just prints the page yellow
            pulsePage.loadPulse(fullPage);
        }
        else {
            console.log('\x1b[33m%s\x1b[0m', '\n' + json.Page);
            pulsePage.loadPulse(json.Page);
        }

        let finish;
        try {
            finish = await pulsePage.checkTime(startTime);
        }
        catch (err) {
            console.log(`Page failed to load:\n${err}`);
        }
        expect(finish).toBeLessThan(maxTime);
        json[today] = finish;
        // sort the JSON by the array created above
        jsons[index] = sortPackageJson(json, {
            sortOrder: sortKeys
        });
    }
}

/**
 * Writes the finished array of JSONs to the output csv file.
 * 
 * @param {Array} jsons An array of JSONs representng the desired output csv file, where
 * each JSON should have a new field added for the calculated finish time.
 * @param {String} file The output filename.
 */
function writeCSV(jsons, file) {
    converter.json2csv(jsons, (err, csv) => {
        if (err) {
            throw err;
        }
        //console.log(csv);
        fs.writeFileSync(file, csv);
    });
}

module.exports = {
    readCSV: readCSV,
    getTimes: getTimes,
    writeCSV: writeCSV
}