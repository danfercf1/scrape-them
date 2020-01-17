const puppeteer = require('puppeteer');

class Automation{
    browser = null;
    headless = true;
    wsEndpoint = 'wss://localhost:4000?--user-data-dir=/tmp/session-123&blockAds';

    async init () {
      this.browser = await this.getBrowser();
    }

    getBrowser () {
    // Show browser
    // const browser = await puppeteer.launch({headless: false});
    return puppeteer.launch(
      {
        browserWSEndpoint: this.wsEndpoint,
        headless: this.headless
      }
    );
  };
}

export const automation = new Automation();