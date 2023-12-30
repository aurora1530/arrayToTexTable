export type MarkdownArray = {
  table: string[][];
  align: ('l' | 'c' | 'r')[];
};

/**
 * マークダウン形式のテーブルを配列に変換する関数です。
 *
 * @param mdTable マークダウン形式のテーブル
 * @returns 変換された配列とセルの配置情報を含むオブジェクト
 */
export function markdownToArray(mdTable: string): MarkdownArray {
  const lines = mdTable.split('\n').map((line) => line.replace(/^\||\|$/g, ''));
  const align: ('l' | 'c' | 'r')[] = lines[1].split('|').map((cell) => {
    switch (cell.trim()) {
      case ':---':
        return 'l';
      case ':---:':
        return 'c';
      case '---:':
        return 'r';
      default:
        return 'c';
    }
  });
  const table = [
    lines[0].split('|').map((cell) => cell.trim()),
    ...lines.slice(2).map((row) => row.split('|').map((cell) => cell.trim())),
  ];
  return { table, align };
}
