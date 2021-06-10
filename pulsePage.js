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
   * @param {String} content The content to find/wait for
   * @param {String} locator The By.locator element finder to use.
   * @returns finishTime The amount of time taken to load the specific async javascript so 
   * the page is usable.
   * @returns DOMConLoaded The amount of time taken to load DOM content.
   * @returns loadTime The amount of time taken to load all blocking javascript.
   */
  this.checkTime = async function (content, locator) {
    browser.waitForAngular();
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
          `Oh no, this thing must be hanging around Ravens:\n${err}`
        );
      }
    }

    const pagePerf = await pageNav(); // await on the resolved Promise
    //console.log(pagePerf);
    let contentExist;
    let theElem;
    switch (locator) {
      case 'class':
        theElem = element(by.className(content));
        break;
      case 'id':
        theElem = element(by.id(content));
        break;
      case 'css':
        theElem = element(by.css(content));
        break;
      default:
        throw new Error('element location by ' + locator + ' not currently supported. Try class, id, or css instead.');
    }

    /**
     * waits for the content to load and stores the time it loaded in ContentExist.
     */
    async function checkEle() {
      if (await theElem.isPresent()) {
        contentExist = Date.now();
        console.log('The content populated at this time: ' + contentExist);
      }
      else {
        console.log('The content never showed up...');
      }
    }
    await checkEle();

    // print the statistics for this page
    const finishTime = (contentExist - pagePerf.navigationStart) / 1000;
    const loadTime = (pagePerf.loadEventEnd - pagePerf.navigationStart) / 1000;
    const DOMConLoaded = (pagePerf.domComplete - pagePerf.domLoading) / 1000;
    console.log(`The finish time with AJAX/fetch requests was: ${finishTime.toFixed(2)} seconds`);
    console.log(`Load time is: ${loadTime.toFixed(2)} seconds`);
    console.log(`DOM Content Load Time is: ${DOMConLoaded.toFixed(2)} seconds`);
    return finishTime;
  };
};

module.exports = new pulsePage();