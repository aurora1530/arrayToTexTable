import { csvToMatrix } from '../src/components/csv';

describe('csvToMatrix()', () => {
  test('csvファイルを正しく二次元配列に変換できる', async () => {
    const filePath = __dirname + '/data/test.csv';
    const matrix = await csvToMatrix(filePath);
    expect(matrix).toEqual([
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
    ]);
  });
});
