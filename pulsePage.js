let pulsePage = function() {
    this.loadPulse = function(url) {
        browser.get(url);
    };

    /**
     * Handles the login of a Pulse instance. The login page should already be loaded.
     * 
     * @todo Add the ability to specify username and password from command line.
     */
    this.login = function() {
        let username = browser.driver.findElement(by.name('Core.Login.user_name'));
        let password = browser.driver.findElement(by.name('Core.Login.password'));
        let loginButton = browser.driver.findElement(by.id('form-login-button'));
        username.sendKeys('admin');
        password.sendKeys('admin');
        loginButton.click();
        console.log("logged in")
    };

    /**
     * Calcualtes various metrics related to the time needed to load a page from the 
     * Pulse interface.
     * 
     * @param {numeric} maxTime 
     * @return finishTime The amount of time taken to load the specific async javascript so 
     * the page is usable.
     * @return DOMConLoaded The amount of time taken to load DOM content.
     * @return loadTime The amount of time taken to load all blocking javascript.
     */
    this.checkTime = async function (maxTime, async) {
        browser.waitForAngular();
        async function pageNav() {
          try {
            const nav = browser.executeScript("return window.performance.timing");
            return nav; // Returns a Promise since it's an async function
          } 
          catch (err) {
            console.error(
              `Oh no, this thing must be hanging around Ravens:\n${err}`
            );
          }
        }

        const pagePerf = await pageNav(); // await on the resolved Promise
        //console.log(pagePerf);
        let gridExist;
        const kGrid = element(by.className(async));
        async function checkEle() {
          // Logic would need to be added for how long it should wait prior to
          // jumping to the else clause
          if (await kGrid.isPresent()) {
            gridExist = Date.now();
            console.log(`The Kendo Grid populated at this time: ${gridExist}`);
          } 
          else {
            console.log("The Kendo Grid never showed up...");
          }
        }
        await checkEle();

        const finishTime = (gridExist - pagePerf.navigationStart) / 1000;
        const loadTime = (pagePerf.loadEventEnd - pagePerf.navigationStart) / 1000;
        const DOMConLoaded = (pagePerf.domComplete - pagePerf.domLoading) / 1000;
        console.log(`The finish time with AJAX/fetch requests was: ${finishTime.toFixed(2)} seconds`);
        console.log(`Load time is: ${loadTime.toFixed(2)} seconds`);
        console.log(`DOM Content Load Time is: ${DOMConLoaded.toFixed(2)} seconds`);
        return finishTime;
    };
};

module.exports = new pulsePage();