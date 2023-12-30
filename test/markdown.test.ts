import { markdownToArray, MarkdownArray } from '../src/components/markdown';

describe('markdownToArray()', () => {
  test('Markdown形式の文字列をMarkdownArrayに変換する', () => {
    const mdstr = `| th | th | th |
| --- | --- | --- |
| td | td | td |
| td | td | td |`;
    const mdarr: MarkdownArray = {
      table: [
        ['th', 'th', 'th'],
        ['td', 'td', 'td'],
        ['td', 'td', 'td'],
      ],
      align: ['c', 'c', 'c'],
    };
    expect(markdownToArray(mdstr)).toEqual(mdarr);

    const mdstr2 = `| th | th | th |
| :--- | :---: | ---: |
| td | td | td |
| td | td | td |`;
    const mdarr2: MarkdownArray = {
      table: [
        ['th', 'th', 'th'],
        ['td', 'td', 'td'],
        ['td', 'td', 'td'],
      ],
      align: ['l', 'c', 'r'],
    };
    expect(markdownToArray(mdstr2)).toEqual(mdarr2);

    const mdstr3 = `| th | th | th |
| :--- | :---: | ---: |`;
    const mdarr3: MarkdownArray = {
      table: [['th', 'th', 'th']],
      align: ['l', 'c', 'r'],
    };
    expect(markdownToArray(mdstr3)).toEqual(mdarr3);
  });
});
