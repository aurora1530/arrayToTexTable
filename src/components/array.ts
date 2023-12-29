/**
 * 二次元配列の各列のサイズが均一かどうかを判定します。
 * @param matrix 判定する二次元配列
 * @returns 各列のサイズが均一であればtrue、そうでなければfalse
 */
export function isUniformColumnSize(matrix: any[][]): boolean {
  const colSize = matrix[0].length;
  //配列の長さが1以下の場合は、matrix.slice(1)が空の配列になるので、trueを返す。
  return matrix.slice(1).every((row) => row.length === colSize);
}

/**
 * 2次元配列の各行の要素数、最も長い行の要素数へ均一化します。
 * 均一化は、各行の先頭/末尾に`undefined`を追加することで行います。
 * @param matrix - 均一化する2次元配列
 * @param isAddingFromEnd - 行の末尾から要素を追加するかどうかを指定します。デフォルトは false（行の先頭から追加）。
 * @returns 均一化された2次元配列
 */
export function uniformMatrix<T>(matrix: T[][], isAddingFromEnd: boolean = false): T[][] {
  if (isUniformColumnSize(matrix)) return matrix;

  const maxColSize = Math.max(...matrix.map((row) => row.length));
  return matrix.map((row, i) => {
    if (row.length === maxColSize) return row;
    const addElements = Array(maxColSize - row.length).fill(undefined);
    if (isAddingFromEnd) row.push(...addElements);
    else row.unshift(...addElements);
    return row;
  });
}
