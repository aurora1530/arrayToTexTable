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
  const lines = mdTable.split('\n').map((line) => line.replace(/^\||\|$/g, '')); //この後"|"でsplitするので、先頭と末尾の|を削除
  const align: ('l' | 'c' | 'r')[] =
    lines[1]?.split('|').map((cell) => {
      cell = cell.trim();
      if (cell.startsWith(':') && cell.endsWith(':')) return 'c';
      if (cell.startsWith(':')) return 'l';
      if (cell.endsWith(':')) return 'r';
      return 'c';
    }) ?? 'c'.repeat(lines[0].split('|').length).split('');
  const table = [
    lines[0].split('|').map((cell) => cell.trim()),
    ...lines.slice(2).map((row) => row.split('|').map((cell) => cell.trim())),
  ];
  return { table, align };
}
