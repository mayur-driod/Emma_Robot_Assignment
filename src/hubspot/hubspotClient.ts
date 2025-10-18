// import axios from 'axios';
// import dotenv from 'dotenv';
// import sequelize from '../db/sequelize';
// import { BabyName } from '../db/models/BabyName';
// dotenv.config();

// const HUBSPOT_TOKEN = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
// const HUBSPOT_BASE = 'https://api.hubapi.com';

// if (!HUBSPOT_TOKEN) {
//   console.warn('No HubSpot token set; set HUBSPOT_PRIVATE_APP_TOKEN in .env to push to HubSpot');
// }

// const createOrUpsertContacts = async () => {
//     await sequelize.authenticate();
//     const rows = await BabyName.findAll({limit:500});

//     const inputs = rows.map(r => {

//     })
// }