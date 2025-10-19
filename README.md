# Emma Robot - Plena Assignment

## Overview

This project automates the process of fetching baby names data from Kaggle, processing it, storing it in a MySQL database, and syncing it to HubSpot as contacts. The system leverages Playwright for browser automation, Sequelize for database management, and the HubSpot API for CRM integration.

The goal of this pipeline is to fully automate data collection, transformation, and synchronization between Kaggle and HubSpot without any manual intervention.

---

## Tech Stack

* **Node.js** (TypeScript)
* **Playwright** – Web automation and file download
* **Sequelize** – ORM for MySQL database interaction
* **MySQL2** – Database driver
* **Axios** – API communication
* **CSV-Parse** – CSV parsing utility
* **Dotenv** – Environment variable management
* **Unzipper** – ZIP file extraction

---

## Features

* Automated Kaggle login and dataset download using Playwright
* CSV extraction and parsing to structured JavaScript objects
* Insertion of records into MySQL database
* Data synchronization to HubSpot CRM through REST API
* Configurable environment setup via `.env` file
* Robust error handling and logging throughout the pipeline

---

## Process Walkthrough

```
Start 
 → Playwright launches headless Chromium 
 → Logs in to Kaggle using credentials from .env 
 → Navigates to dataset and triggers download 
 → Extracted CSV is parsed and transformed to JS objects 
 → Only 'Name' and 'Sex' columns are retained 
 → Data is inserted into MySQL database 
 → First 100 records are fetched 
 → Records are pushed to HubSpot via REST API
```

---

## Prerequisites

* Node.js (v14 or later) [Typescript]
* MySQL (local or hosted instance)
* Kaggle account with credentials
* HubSpot account with a private app token

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/mayur-driod/Emma_Robot_Assignment.git
cd Emma_Robot_Assignment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Duplicate the `.env.example` file and rename to `.env` in the root directory and include the following with your own credentials:

```bash
KAGGLE_EMAIL="you@gmail.com"
KAGGLE_PASSWORD="SuperSecret1234"
DOWNLOAD_DIR=./downloads
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=babynames_db
DB_USER=root
DB_PASS=secretsecret
HUBSPOT_PRIVATE_APP_TOKEN=acbbdjjejejejejeje234
HUBSPOT_CLIENT_TOKEN=jdjjejehhdjejeh
HUBSPOT_BATCH_UPSERT=true
```

### 4. Create the MySQL database

Log into your MySQL client and run:

```sql
CREATE DATABASE baby_names_db;
```

---

## Setup Instructions

### Step 1: Kaggle Credentials

1. Visit [https://www.kaggle.com/account](https://www.kaggle.com/account)
2. Scroll to the **API** section
3. Click **Create New API Token**
4. Use the email and password from your Kaggle account in the `.env` file

### Step 2: HubSpot API Token

1. Log into your HubSpot account
2. Go to **Settings → Integrations → Private Apps**
3. Create a new private app and enable `crm.objects.contacts.write` and `crm.objects.contacts.read` scope
4. Copy the generated token and add it to `.env` as `HUBSPOT_PRIVATE_APP_TOKEN`

### Step 3: Database Configuration

Ensure your `.env` file correctly references your local or remote MySQL setup.

---

## Running the Application

```bash
npm run start
```

This command executes the entire workflow:

1. Automates Kaggle login and dataset download
2. Extracts and parses the CSV file
3. Inserts parsed records into the MySQL database
4. Fetches the first 100 records
5. Syncs them to HubSpot as contact entries

---

## Project Structure

```
src/
├── db/
│   ├── migrations/
│   │   └── 20251018041004-create-baby-names.js   # Sequelize migration file
│   ├── models/
│   │   └── BabyName.ts                           # Sequelize model definition
│   ├── dbConnect.ts                              # Database connection helper
│   └── sequelize.ts                              # Sequelize instance setup
│
├── hubspot/
│   └── hubspotClient.ts                          # HubSpot API client and data sync logic
│
├── processors/
│   └── csvToDb.ts                                # Handles CSV-to-database processing logic
│
├── scraper/
│   └── kaggleScraper.ts                          # Playwright-based Kaggle automation and download
│
├── utils/
│   └── csv.ts                                    # CSV parsing utility
│
└── index.ts                                      # Main entry point
```

---

## Data Flow

| Step | File | Description |
|------|------|--------------|
| 1 | `scraper/kaggleScraper.ts` | Automates Kaggle login using Playwright and triggers dataset download |
| 2 | `utils/csv.ts` | Parses the downloaded CSV file and extracts only `Name` and `Sex` columns |
| 3 | `processors/csvToDb.ts` | Handles batch insertion of parsed data into the MySQL database |
| 4 | `db/models/BabyName.ts` | Defines the Sequelize model used to represent and store baby name records |
| 5 | `hubspot/hubspotClient.ts` | Fetches records from the database and syncs them to HubSpot as contacts |

---

## Data Model

| Field     | Type     | Description                |
| --------- | -------- | -------------------------- |
| id        | Integer  | Auto-increment primary key |
| name      | String   | Baby name from dataset     |
| sex       | String   | Gender from dataset (M/F/U)  |
| createdAt | DateTime | Auto-generated             |
| updatedAt | DateTime | Auto-generated             |

---

## Limitations

* HubSpot Free tier restricts contact creation to 100 records.
* Kaggle automation relies on current website structure and may break if UI changes.
* CSV parsing performance may vary depending on file size and batch configuration.
* Each stage (scraping, parsing, database insertion, HubSpot sync) runs sequentially. There’s currently no parallelization or queue-based architecture, which can limit scalability for very large datasets.
* Logs are primarily console-based. There’s no centralized logging or monitoring system (e.g., Winston, Grafana, or ELK) for tracking long-term performance or debugging issues.
  
---

## Video explenation


https://github.com/user-attachments/assets/0ab6e7f0-7f45-4802-888a-4deca12f5b1d

