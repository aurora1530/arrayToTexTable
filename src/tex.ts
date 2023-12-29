import { isUniformColumnSize, uniformMatrix } from './components/array';

export type TableOptions = {
  tabularOptions?: TabularOptions;
  tableLocation?: 'h' | 't' | 'b' | 'p' | 'H';
  title?: string;
  matrixOptions?: MatrixOptions;
};

type MatrixOptions = {
  isAddingFromEnd?: boolean;
};

type TabularOptions = {
  columnParameters: string;
  rowsRequiringHline: Number[];
};

/**
 * 配列をテーブル形式の文字列に変換します。
 *
 * @param array - 変換する配列（文字列の2次元配列または数値の2次元配列）
 * @param options - オプションパラメータ（TableOptions）
 * @returns テーブル形式の文字列
 */
export function arrayToTable(
  array: string[][] | number[][],
  options?: TableOptions
): string {
  array = array.map((row) => row.map((cell) => escapeTexChar(cell.toString())));
  array = uniformMatrix(array, options?.matrixOptions?.isAddingFromEnd);

  const numOfColumns = array[0].length;
  const tabularOption = validateColumnParameters(
    options?.tabularOptions?.columnParameters,
    numOfColumns
  );
  const tabularBody = array
    .map((row, i) => {
      const hline = options?.tabularOptions?.rowsRequiringHline.includes(i)
        ? '\\hline'
        : '';
      return row.join(' & ') + ' \\\\' + hline;
    })
    .join('\n');

  const tabular = `\\begin{tabular}{${tabularOption}}\n${tabularBody}\n\\end{tabular}`;
  const tableLocation = options?.tableLocation ?? 'h';
  const title = options?.title ? `\\caption{${options.title}}\n` : '';
  const table = `\\begin{table}[${tableLocation}]\n${title}${tabular}\n\\end{table}`;
  return table;
}

/**
 * 文字列内のTeX文字をエスケープします。
 * @param str エスケープする文字列
 * @returns エスケープされた文字列
 */
export function escapeTexChar(str: string): string {
  const escapeRules: [string, string][] = [
    ['\\', '\\textbackslash'], //must be first in this array
    ['&', '\\&'],
    ['$', '\\$'],
    ['%', '\\%'],
    ['#', '\\#'],
    ['_', '\\_'],
    ['{', '\\{'],
    ['}', '\\}'],
    ['~', '\\textasciitilde'],
    ['^', '\\textasciicircum'],
    ['<', '\\textless'],
    ['>', '\\textgreater'],
    ['|', '\\textbar'],
    ['"', '\\textquotedbl'],
    ["'", '\\textquotesingle'],
    ['`', '\\textasciigrave'],
  ];
  escapeRules.forEach(([char, escapedChar]) => (str = str.replaceAll(char, escapedChar)));
  return str;
}

/**
 * カラムパラメータを検証します。
 * 適切でない文字は`c`に置き換えられます。
 * カラムパラメータの数がカラムの数より少ない場合、`c`が追加されます。
 * @param str カラムパラメータの文字列
 * @param numOfCol カラムの数
 * @returns 検証されたカラムパラメータの文字列
 */
export function validateColumnParameters(str: string = '', numOfCol: number): string {
  const columnParameters = str.replaceAll(' ', '').split('');
  const paramsWithoutBar = columnParameters.filter((v) => v !== '|');
  if (paramsWithoutBar.length !== numOfCol) {
    columnParameters.push(...Array(numOfCol - paramsWithoutBar.length).fill('c'));
  }

  const validParameters = ['l', 'c', 'r'];
  columnParameters.forEach((param, i) => {
    if (param !== '|' && !validParameters.includes(param)) columnParameters[i] = 'c';
  });
  return columnParameters.join('');
}
