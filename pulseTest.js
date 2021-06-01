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
        let processed = await csvIO.readCSV(browser.params.inFile);
        await csvIO.getTimes(processed, 30);

        // if user specified output file, write to that; otherwise, write to input file
        if (browser.params.outFile != 'same') {
            csvIO.writeCSV(processed, browser.params.outFile);
        }
        else {
            csvIO.writeCSV(processed, browser.params.inFile);
        }
        console.log(processed);
    }, 2147483647);
});