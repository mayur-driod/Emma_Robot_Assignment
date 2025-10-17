import {chromium} from 'playwright';
import dotenv from 'dotenv';
import * as fs from "fs";
import * as path from "path";
import * as unzipper from "unzipper";

dotenv.config();

// initialising variables
const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR || './downloads';
const KAGGLE_EMAIL = process.env.KAGGLE_EMAIL!;
const KAGGLE_PASSWORD = process.env.KAGGLE_PASSWORD!;
const KAGGLE_URl = 'https://www.kaggle.com';
const Data_Endpoint = `${KAGGLE_URl}/datasets/thedevastator/us-baby-names-by-year-of-birth?select=babyNamesUSYOB-full.csv`

// main function
const scrape = async () => {
    if(!KAGGLE_EMAIL || !KAGGLE_PASSWORD){
        throw new Error("Please set the kaggle email and password correctly.");
    }

    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true }); //

    const browser = await chromium.launch({headless: false}); // headless for testing.
    const context = await browser.newContext({acceptDownloads:true});
    const page = await context.newPage();

    // log in
    await page.goto(`${KAGGLE_URl}/account/login?phase=emailSignIn&returnUrl=/`);
    await page.getByPlaceholder('Enter your email address or username').fill(KAGGLE_EMAIL);
    await page.getByPlaceholder('Enter Password').fill(KAGGLE_PASSWORD);
    await page.getByRole('button', { name: 'Sign In' }).click();

    await page.waitForURL("https://www.kaggle.com/"); // waits until the dashboard loads.

    await page.goto(Data_Endpoint); // goes to data download page

    await page.getByRole('button', { name: 'Download' }).click();
    const downloadPromise = page.waitForEvent('download');
    await page.getByText("Download dataset as zip").click();

  // Download logic
  const download = await downloadPromise;
  const zipFileName = download.suggestedFilename();
  const zipPath = path.join(DOWNLOAD_DIR, zipFileName);
  await download.saveAs(zipPath);
  console.log(`Download complete: ${zipPath}`);

  // zip file extraction
  console.log('Extracting ZIP now...');
  await fs
    .createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: DOWNLOAD_DIR }))
    .promise();

  // full list CSV file located
  const extractedFiles = fs.readdirSync(DOWNLOAD_DIR);
  const csvFile = extractedFiles.find(
    file => file.toLowerCase().includes('babynamesus') && file.toLowerCase().endsWith('.csv')
  );

  if (!csvFile) {
    throw new Error('babyNamesUSYOB-full.csv not found after extracting ZIP');
  }

  const csvPath = path.join(DOWNLOAD_DIR, csvFile);
  console.log(`CSV file stored: ${csvPath}`);

  await browser.close(); // close the chromium browser
  return csvPath;

}

export default scrape;