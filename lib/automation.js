import puppeteer from "puppeteer";
import { CONFIG } from "./constants.js";

class Automation {
  browser = null;
  headless = false;
  wsEndpoint = "wss://localhost:4000?--user-data-dir=/tmp/session-123&blockAds";

  async init() {
    this.browser = await this.getBrowser();
  }

  getBrowser() {
    const browser = puppeteer.launch({
      browserWSEndpoint: this.wsEndpoint,
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
      ignoreHTTPSErrors: true,
      acceptInsecureCerts: true,
      product: "firefox",
      timeout: CONFIG.defaulTimeout,
      devtools: true,
      args: [
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--enable-features=NetworkService",
        "--start-maximized",
      ],
    });
    return browser;
    // return puppeteer.launch(
    //   {
    //     browserWSEndpoint: this.wsEndpoint,
    //     headless: this.headless
    //   }
    // );
  }
}

export const automation = new Automation();
