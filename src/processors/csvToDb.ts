import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import { BabyName } from '../db/models/BabyName';
import sequelize from '../db/sequelize';

const csvToDb = async (records:Array<Record<string, string>>) => {
    const nameKey = 'Name'
    const sexKey = "Sex"

    // const limit = 100;
    // const data = records.slice(0,limit);
    let count = 0;

    for( const r of records){
        const name = r[nameKey]?.trim();
        let sex = r[sexKey]?.trim().toUpperCase();

        if (sex?.startsWith('F')) sex = 'F';
        else if (sex?.startsWith('M')) sex = 'M';
        else sex = 'U'; // defaults to unknown

        try {
            await BabyName.create({ name, sex });
            count++;
        } catch (err) {
            console.error('DB insert error for', name, err);
        }
    }

   console.log(`Done inserting ${count} records`);
}

export default csvToDb;