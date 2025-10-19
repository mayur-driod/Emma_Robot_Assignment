import dotenv from "dotenv";
import dbConnect from "./db/dbConnect";
import sequelize from "./db/sequelize";
import { testHubspotConnection } from "./hubspot/hubspotClient";
import scrape from "./scraper/kaggleScraper";
import parseCSVFile from "./utils/csv";
import csvToDb from "./processors/csvToDb";

dotenv.config();

const main = async () => {
   
   try{
      console.log("Testing database connection");
      await dbConnect();

      console.log("Syncing database");
      await sequelize.sync();
      console.log("Syncing Successful!");

      console.log("Test hubspot connection");
      const connected = await testHubspotConnection();
      if(!connected){
         console.log('HubSpot API connection failed. Continuing without HubSpot sync...');
      }

      console.log("Scraping from kaggle");
      let csvPath: string

      csvPath = await scrape();

      if(csvPath.length < 0){
         console.log("There was an error fetching CSV file path");
      }

      console.log("Parsing CSV File");
      const parsedData = parseCSVFile(csvPath);
      console.log("CSV data parsed!");

      console.log("Uploading to database");
      csvToDb(parsedData);
   }
   catch(err){
      console.log(err);
   }

}

main();