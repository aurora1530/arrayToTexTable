import { parse } from 'csv-parse';
import * as fs from 'fs';
import * as path from 'path';

/**
 * CSVファイルを読み込んで行列形式に変換する関数です。
 * @param {string} filePath CSVファイルのパス
 * @returns {Promise<string>} 行列形式に変換されたCSVデータのPromise
 * @error {Error} ファイルの読み込みに失敗した場合
 */
export function csvToMatrix(filePath: string): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const csv = fs.readFileSync(path.join(filePath));
    const parser = parse(csv, {
      delimiter: ',',
      columns: false,
    });

    const records: string[][] = [];
    parser.on('readable', () => {
      let record;
      while ((record = parser.read())) {
        records.push(record);
      }
    });

    parser.on('error', (err) => {
      console.error(err.message);
      reject(err);
    });

    parser.on('end', () => {
      resolve(records);
    });
  });
}
