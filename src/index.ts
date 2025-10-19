import dotenv from "dotenv";
import dbConnect from "./db/dbConnect";
import sequelize from "./db/sequelize";
import { sendBatchToHubspot, testHubspotConnection } from "./hubspot/hubspotClient";
import scrape from "./scraper/kaggleScraper";
import parseCSVFile from "./utils/csv";
import csvToDb from "./processors/csvToDb";
import { BabyName } from "./db/models/BabyName";

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
      await csvToDb(parsedData);

   let hubspotResult = { success: 0, failed: 0, skipped: 0 };

      if (connected) {
      console.log("Fetching data");
      const fetchedData = await BabyName.findAll({limit:100});
      console.log('Step 7: Syncing data to HubSpot...');
      const plainData = fetchedData.map(b => b.get({ plain: true }));
      hubspotResult = await sendBatchToHubspot(plainData);
    } else {
      console.log('Step 7: Skipping HubSpot sync (API connection failed)');
      console.log('Update HUBSPOT_ACCESS_TOKEN in .env to enable HubSpot sync');
    }
   }
   catch(err){
      console.log(err);
      process.exit(1);
   }
   finally {
    await sequelize.close();
    console.log('Database connection closed');
  }

}

main();