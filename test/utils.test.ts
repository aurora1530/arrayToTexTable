import { isUniformColumnSize, uniformMatrix } from '../src/components/array';

describe('isUniformColumnSize()', () => {
  test('trueを返す。if 長さが1以下の配列の場合', () => {
    const matrixEmpty = [[]];
    const matrix1 = [[1]];
    expect(isUniformColumnSize(matrixEmpty)).toBe(true);
    expect(isUniformColumnSize(matrix1)).toBe(true);
  });
  test('falseを返す。if 配列の長さが2以上で、列の長さが異なる場合', () => {
    const matrix = [
      [1, 2],
      [1, 2, 3],
    ];
    expect(isUniformColumnSize(matrix)).toBe(false);
  });
  test('trueを返す。if 配列の長さが2以上で、列の長さが同じ場合', () => {
    const matrix = [
      [1, 2],
      [1, 2],
    ];
    const matrixIncludeNull = [
      [1, null],
      [undefined, 2],
    ];
    expect(isUniformColumnSize(matrix)).toBe(true);
    expect(isUniformColumnSize(matrixIncludeNull)).toBe(true);
  });
});

describe('uniformMatrix()', () => {
  test('既に均一化されている場合、そのまま返す', () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    expect(uniformMatrix(matrix)).toEqual(matrix);
  });
  test('行の先頭から要素を追加する', () => {
    const matrix = [[1, 2], [3], []];
    expect(uniformMatrix(matrix)).toEqual([
      [1, 2],
      [undefined, 3],
      [undefined, undefined],
    ]);
  });
  test('行の末尾から要素を追加する', () => {
    const matrix = [
      ['a', 'b'],
      ['c', 'd', 'e', 'f'],
      ['g', 'h'],
    ];
    expect(uniformMatrix(matrix, true)).toEqual([
      ['a', 'b', undefined, undefined],
      ['c', 'd', 'e', 'f'],
      ['g', 'h', undefined, undefined],
    ]);
  });
});
