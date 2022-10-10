export const deleteFirstColumn = (arr: [][]) => {
    const newArr = arr.map((row) => {
        row.shift();
        return row;
    });
    return newArr;
}