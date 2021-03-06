/**
 * @module pulsePage
 */
let pulsePage = function () {
  this.loadPulse = function (url) {
    browser.get(url);
  };

  /**
   * Handles the login of a Pulse instance. The login page should already be loaded.
   * The username and password can be passed as a command line argument.
   */
  this.login = function () {
    let user = browser.driver.findElement(by.name('Core.Login.user_name'));
    let pass = browser.driver.findElement(by.name('Core.Login.password'));
    let loginButton = browser.driver.findElement(by.id('form-login-button'));
    user.sendKeys(browser.params.username);
    pass.sendKeys(browser.params.password);
    loginButton.click();
    console.log('Logged in');
  };

  /**
   * Calcualtes various metrics related to the time needed to load a page from the 
   * Pulse interface. Thanks to Patrick Hanley for the finish time code.
   * 
   * @returns finishTime The amount of time taken to load the page to a fully usable state.
   * @returns DOMConLoaded The amount of time taken to load DOM content.
   * @returns loadTime The amount of time taken to load all blocking javascript.
   */
  this.checkTime = async function (start) {
    /**
     * Executes the script in chrome to retrieve performance stats.
     * 
     * @returns nav The Chrome dev tools performance statistics object.
     */
    async function pageNav() {
      try {
        const nav = browser.executeScript('return window.performance.timing');
        return nav; // Returns a Promise since it's an async function
      }
      catch (err) {
        console.error(
          `Error fetching the Chrome statistics:\n${err}`
        );
      }
    }

    const pagePerf = await pageNav(); // await on the resolved Promise
    //console.log(pagePerf);

    /**
     * waits for all the loading overlays and spinners to dissappear and returns the time.
     */
    async function checkEle() {
      let until = protractor.ExpectedConditions;
      // wait for the first overlay to appear - this ensures that the page is starting to load
      await browser.wait(until.presenceOf(element(by.id('global-spinner'))), browser.params.initialtimeout);
      
      // wait for all overlays to dissapear
      let overlays = element.all(by.className('overlay'));
      await overlays.each(async (element) => {
        await browser.wait(until.invisibilityOf(element), browser.params.overlaytimeout);
      });
      
      // multiple checks because spinners might disappear and reappear
      let spinners;
      for (let i = 0; i < 10; i++) {
        spinners = element.all(by.className('spinner'));
        await spinners.each(async (element) => {
          await browser.wait(until.invisibilityOf(element), browser.params.overlaytimeout);
        });
      }
      
      return Date.now();
    }

    let contentExist = await checkEle();

    // print the statistics for this page
    const finishTime = ((contentExist - start) / 1000).toFixed(2);
    const loadTime = ((pagePerf.loadEventEnd - pagePerf.navigationStart) / 1000).toFixed(2);
    const DOMConLoaded = ((pagePerf.domComplete - pagePerf.domLoading) / 1000).toFixed(2);
    console.log(`The time for all loading overlays/spinners to dissappear was: ${finishTime} seconds`);
    console.log(`Load time is: ${loadTime} seconds`);
    console.log(`DOM Content Load Time is: ${DOMConLoaded} seconds`);
    return finishTime;
  };
};

module.exports = new pulsePage();