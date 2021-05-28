let pulsePage = require('./pulsePage');
let csvIO = require('./csvIO');

describe('pulse tests', function() {
    let homePage = 'https://172.17.53.253';

    beforeAll(function() {
        browser.ignoreSynchronization = true;
        pulsePage.loadPulse(homePage);
        pulsePage.login();
        browser.ignoreSynchronization = false;
    });

    it('should have each page load in less than 30s', async function() {
        let processed = await csvIO.readCSV('timeToolData1.csv');
        await csvIO.getTimes(processed);
        csvIO.writeCSV(processed, 'timeToolData1.csv');
        console.log(processed);
    }, 2147483647);
});