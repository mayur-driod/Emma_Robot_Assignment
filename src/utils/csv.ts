import fs from 'fs';
import {parse} from 'csv-parse/sync';

const parseCSVFile = (filePath: string) => {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const records = parse(raw, { columns: true, skip_empty_lines: true });
    return records as Array<Record<string, string>>;
}

export default parseCSVFile;