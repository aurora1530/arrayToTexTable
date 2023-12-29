import {
  arrayToTable,
  TableOptions,
  validateColumnParameters,
  escapeTexChar,
} from '../src/tex';

describe('arrayToTable()', () => {
  test('均一な列サイズの配列が与えられた場合、正しいテーブルを生成する', () => {
    const array = [
      ['A', 'B', 'C'],
      ['D', 'E', 'F'],
    ];
    const expectedTable = `\\begin{table}[h]\n\\begin{tabular}{ccc}\nA & B & C \\\\\nD & E & F \\\\\n\\end{tabular}\n\\end{table}`;
    expect(arrayToTable(array)).toBe(expectedTable);
  });

  test('均一な列サイズでない配列が与えられた場合、成形した上でテーブルを生成する', () => {
    const array = [
      ['A', 'B'],
      ['C', 'D', 'E'],
    ];
    const options: TableOptions = {
      matrixOptions: {
        isAddingFromEnd: true,
      },
    };
    const expectedTable = `\\begin{table}[h]\n\\begin{tabular}{ccc}\nA & B &  \\\\\nC & D & E \\\\\n\\end{tabular}\n\\end{table}`;
    expect(arrayToTable(array, options)).toBe(expectedTable);
  });

  test('オプションが指定された場合、正しいテーブルを生成する', () => {
    const array = [
      ['A', 'B', 'C'],
      ['D', 'E', 'F'],
    ];
    const options: TableOptions = {
      tabularOptions: {
        columnParameters: 'l c r',
        rowsRequiringHline: [0],
      },
      tableLocation: 't',
      title: 'Sample Table',
    };
    const expectedTable = `\\begin{table}[t]\n\\caption{Sample Table}\n\\begin{tabular}{lcr}\nA & B & C \\\\\\hline\nD & E & F \\\\\n\\end{tabular}\n\\end{table}`;
    expect(arrayToTable(array, options)).toBe(expectedTable);
  });
});

describe('validateColumnParameters()', () => {
  test('正しい列パラメータが与えられた場合、元の文字列を返す', () => {
    const testCases: [string, number][] = [
      ['c', 1],
      ['l c r', 3],
      ['lcr', 3],
      ['|c|c|c|', 3],
      ['l | c | r', 3],
      ['l|c|r', 3],
      ['l   c   r    ', 3],
    ];
    testCases.forEach(([testCase, numOfCol]) => {
      expect(validateColumnParameters(testCase, numOfCol)).toBe(
        testCase.replace(/ /g, '')
      );
    });
  });
  test('不正な列パラメータが与えられた場合、その文字を`c`に置き換えた文字列を返す', () => {
    const testCases: [string, number, string][] = [
      ['a', 1, 'c'],
      ['l a r', 3, 'lcr'],
      ['l|a|r', 3, 'l|c|r'],
    ];
    testCases.forEach(([testCases, numOfCol, expected]) => {
      expect(validateColumnParameters(testCases, numOfCol)).toBe(expected);
    });
  });
  test('カラムパラメータの数がカラム数より少ない場合、cが追加される', () => {
    const testCases: [string | undefined, number, string][] = [
      ['l', 3, 'lcc'],
      ['l|', 3, 'l|cc'],
      ['|l', 3, '|lcc'],
      ['|l|', 3, '|l|cc'],
      ['', 4, 'cccc'],
      [undefined, 2, 'cc'],
    ];
    testCases.forEach(([testCases, numOfCol, expected]) => {
      expect(validateColumnParameters(testCases, numOfCol)).toBe(expected);
    });
  });
  test('カラムパラメータの数がカラム数より多い場合、余計なパラメータが削除される', () => {
    const testCases: [string, number, string][] = [
      ['lcr', 2, 'lc'],
      ['l|c|r', 2, 'l|c|'],
      ['l|c|r|t|e||s|t', 3, 'l|c|r|'],
      ['l|c||r', 2, 'l|c||'],
    ];
    testCases.forEach(([testCases, numOfCol, expected]) => {
      expect(validateColumnParameters(testCases, numOfCol)).toBe(expected);
    });
  });
});
describe('escapeTexChar()', () => {
  test('特殊文字がエスケープされること', () => {
    const input = '\\ & $ % # _ { } ~ ^ < > | " \' `';
    const expectedOutput =
      '\\textbackslash \\& \\$ \\% \\# \\_ \\{ \\} \\textasciitilde \\textasciicircum \\textless \\textgreater \\textbar \\textquotedbl \\textquotesingle \\textasciigrave';
    expect(escapeTexChar(input)).toBe(expectedOutput);
  });

  test('特殊文字以外の文字列は変更されないこと', () => {
    const input = 'Hello, World!';
    expect(escapeTexChar(input)).toBe(input);
  });
});
