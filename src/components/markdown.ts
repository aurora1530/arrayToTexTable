export type MarkdownArray = {
  table: string[][];
  align: ('l' | 'c' | 'r')[];
};

export function markdownToArray(md: string): MarkdownArray {
  const lines = md.split('\n').map((line) => line.replace(/^\||\|$/g, ''));
  const align: ('l' | 'c' | 'r')[] = lines[1].split('|').map((x) => {
    switch (x.trim()) {
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
    lines[0].split('|').map((x) => x.trim()),
    ...lines.slice(2).map((x) => x.split('|').map((x) => x.trim())),
  ];
  return { table, align };
}
