import { arrayToTable, TableOptions } from './tex';
import { csvToMatrix } from './components/csv';
import * as path from 'path';
import * as fs from 'fs';

async function writeTexTableFromCsv(
  csvPath: string,
  outputPath: string,
  options?: TableOptions
): Promise<void> {
  const matrix = await csvToMatrix(csvPath);
  const table = arrayToTable(matrix, options);
  fs.writeFileSync(outputPath, table);
}

const csvPath = path.resolve(__dirname, '../data/test.csv');
const outputPath = path.resolve(__dirname, '../data/test.txt');
const options: TableOptions = {
  tabularOptions: {
    columnParameters: 'l c r',
    rowsRequiringHline: [0, 1, 2],
  },
  tableLocation: 't',
  title: 'Sample Table',
};

writeTexTableFromCsv(csvPath, outputPath, options);
