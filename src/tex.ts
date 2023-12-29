import { isUniformColumnSize, uniformMatrix } from './components/array';

export type TableOptions = {
  tabularOptions?: TabularOptions;
  tableLocation?: 'h' | 't' | 'b' | 'p' | 'H';
  caption?: string;
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
  const title = options?.caption ? `\\caption{${options.caption}}\n` : '';
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
    ['\\', '\\textbackslash'], //must be first
    ['\\textbackslashn', '\\par '],
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
 * 適切でないパラメータは`c`に置き換えられます。
 * カラムパラメータの数がカラムの数より少ない場合、`c`が追加されます。
 * カラムパラメータの数がカラムの数より多い場合、末尾のパラメータが削除されます。
 * @param str カラムパラメータの文字列
 * @param numOfCol カラムの数
 * @returns 検証されたカラムパラメータの文字列
 */
export function validateColumnParameters(str: string = '', numOfCol: number): string {
  const parameters = str.replaceAll(' ', '').split('');
  const paramsWithoutBar = parameters.filter((v) => v !== '|');
  if (paramsWithoutBar.length < numOfCol) {
    parameters.push(...Array(numOfCol - paramsWithoutBar.length).fill('c'));
  } else if (paramsWithoutBar.length > numOfCol) {
    let paramCount = 0;
    parameters.forEach((c, i) => {
      if (c !== '|') paramCount++;
      if (paramCount > numOfCol) {
        parameters.splice(i);
        return;
      }
    });
  }

  const validParameters = ['l', 'c', 'r'];
  parameters.forEach((param, i) => {
    if (param !== '|' && !validParameters.includes(param)) parameters[i] = 'c';
  });
  return parameters.join('');
}
