let pulsePage = require('./pulsePage');
let csvIO = require('./csvIO');

describe('pulse tests', function() {
    let homePage = 'https://' + browser.params.ip;

    beforeAll(function() {
        browser.ignoreSynchronization = true;
        pulsePage.loadPulse(homePage);
        pulsePage.login();
        browser.ignoreSynchronization = false;
    });

    it('should have each page load in less than 30s', async function() {
        let processed = await csvIO.readCSV(browser.params.file);
        // if a page takes longer than 30s to load, something is probably wrong and spec will fail
        // this is NOT the master timeout, just the spec expectation
        await csvIO.getTimes(processed, 30);
        // if user specified output file, write to that; otherwise, write to input file
        if (browser.params.outfile != 'same') {
            csvIO.writeCSV(processed, browser.params.outfile);
        }
        else {
            csvIO.writeCSV(processed, browser.params.file);
        }
        //console.log(processed);
    }, 2147483647);
});