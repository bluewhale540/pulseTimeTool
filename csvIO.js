const fs = require('fs');
const csv = require('csv-parser');
let converter = require('json-2-csv');
let pulsePage = require('./pulsePage');

async function mapCSV(file) {
    let map = await readCSV(file);
    console.log(map);
}

/**
 * Reads a csv file that contains rows corresponding to pages to test. The CSV
 * should have columns for the page URL and the content to wait for, titled 'Page' 
 * and 'Content', respectively.
 * 
 * @param {String} file The name of the file to be read.
 * @returns a Promise that resolves to an array of JSONs representing the csv 
 * file when it has been read, where each row is a JSON.
 */
async function readCSV(file) {
    let processed = [];
    return new Promise(function(resolve, reject) {
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
 * 
 * @todo Prefix the date with user specified Pulse/Ravens/etc.
 * @todo Insert the most recent date and finish time after Content and before older dates.
 * Look into sort-package-json or convert json to array and back.
 */
async function getTimes(jsons) {
    const now = new Date(Date.now());
    const today = now.toISOString();

    for await (let json of jsons) {
        pulsePage.loadPulse(json.Page);
        let finish = await pulsePage.checkTime(30000, json.Content);
        json[today] = finish;
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