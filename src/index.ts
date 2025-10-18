import scrape from "./scraper/kaggleScraper"
import parseCSVFile from "./utils/csv";

const run = async () => {
   const csvpath = await scrape();
   const parsedData = parseCSVFile(csvpath);
   console.log(parsedData);
}

run();