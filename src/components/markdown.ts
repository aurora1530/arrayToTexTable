export type MarkdownArray = {
  table: string[][];
  align: ('l' | 'c' | 'r')[];
};

export function markdownToArray(md: string): MarkdownArray {
  const lines = md.split('\n').map((line) => line.replace(/^\||\|$/g, ''));
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
