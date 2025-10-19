import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const HUBSPOT_URL = 'https://api.hubapi.com/crm/v3/objects/contacts';
const HUBSPOT_TOKEN = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
const BATCH_SIZE = 10; // Send contacts in batches to respect rate limits
const DELAY_MS = 1000; 

export async function sendToHubspot(name: string, sex: string): Promise<any> {
  try {
    const response = await axios.post(
      HUBSPOT_URL,
      {
        properties: {
          firstname: name,
          sex: sex
        }
      },
      {
        headers: {
          Authorization: `Bearer ${HUBSPOT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    
    // Handle duplicate contact error
    if (axiosError.response?.status === 409) {
      console.log(`Contact already exists: ${name}`);
      return null;
    }
    
    throw error;
  }
}

export async function sendBatchToHubspot(
  contacts: Array<{ name: string; sex: string }>
): Promise<{ success: number; failed: number; skipped: number }> {
  let successCount = 0;
  let failedCount = 0;
  let skippedCount = 0;

  console.log(`\nStarting HubSpot sync for ${contacts.length} contacts...`);

  for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
    const batch = contacts.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(contacts.length / BATCH_SIZE);

    console.log(`\nProcessing batch ${batchNumber}/${totalBatches} (${batch.length} contacts)...`);

    for (const contact of batch) {
      try {
        const result = await sendToHubspot(contact.name, contact.sex);
        if (result) {
          successCount++;
          console.log(`   [SUCCESS] Created: ${contact.name} (${contact.sex})`);
        } else {
          skippedCount++;
        }
      } catch (error) {
        failedCount++;
        const axiosError = error as AxiosError;
        console.error(`   [ERROR] Failed: ${contact.name} - ${axiosError.message}`);
      }
    }

    if (i + BATCH_SIZE < contacts.length) {
      console.log(`   [INFO] Waiting ${DELAY_MS}ms before next batch...`);
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }

  console.log(`\nHubSpot sync complete:`);
  console.log(`   [SUCCESS] Success: ${successCount}`);
  console.log(`   [WARNING] Skipped: ${skippedCount}`);
  console.log(`   [ERROR] Failed: ${failedCount}`);

  return { success: successCount, failed: failedCount, skipped: skippedCount };
}

export async function testHubspotConnection(): Promise<boolean> {
  try {
    await axios.get(HUBSPOT_URL, {
      headers: {
        Authorization: `Bearer ${HUBSPOT_TOKEN}`
      },
      params: {
        limit: 1
      }
    });
    console.log('HubSpot API connection successful.');
    return true;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('HubSpot API connection failed:', axiosError.message);
    return false;
  }
}