const puppeteer = require("puppeteer");

/**
 * Screenshots the body tag of the provided html page and returns a bytebuffer containing the image data
 */
async function makeScreenshot(html, selector) {
  if (!html) {
    return null;
  }

  let browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  let page = await browser.newPage();

  // networkidle0 - consider setting content to be finished when there are
  // no more than 0 network connections for at least 500 ms.
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.addStyleTag({ path: "./index.css" });

  let element = await page.$(selector);
  if (!element) {
    throw Error(`Could not file selector \'${selector}\' in HTML.`);
  }

  const buffer = await element.screenshot({ encoding: "buffer" });

  await browser.close();

  return buffer;
}

module.exports.makeScreenshot = makeScreenshot;
