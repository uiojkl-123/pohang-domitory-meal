import { format } from "date-fns";

/**
 * 맨 앞에 몇주째인지 나타내는 숫자를 제거하고 2차원 배열로 반환
 *
 * @param {string[][]} rows
 * @return {*}  {string[][]}
 */
export const sliceFirstColumn = (rows: string[][]): string[][] => {
    const slicedRows = rows.map((row) => row.slice(1));
    return slicedRows;
};

/**
 * 2차원 배열을 숫자에 맞춰 3차원 배열로 변환
 *
 * @param {string[][]} rows
 * @param {number} by
 * @return {*}  {string[][][]}
 */
export const splitRowsByNumberAndMergeTo3DArray = (rows: string[][], by: number): string[][][] => {
    const result: string[][][] = [];
    let temp: string[][] = [];
    rows.forEach((row, index) => {
        if (index % by === 0) {
            temp = [];
        }
        temp.push(row);
        if (index % by === by - 1) {
            result.push(temp);
        }
    });
    return extractAllEmpth2DArray(result);
};

/**
 * 3차원 배열에서 빈 2차원 배열을 제거
 *
 * @param {string[][][]} rows
 * @return {*}  {string[][][]}
 */
const extractAllEmpth2DArray = (rows: string[][][]): string[][][] => {
    const result: string[][][] = [];
    rows.forEach((row) => {
        if (row[0][0] !== '') {
            result.push(row);
        }
    });
    return result;
};


/**
 * 3차원 배열 내부에 2차원의 행들을 모두 합치고 2차원 배열로 변환
 *
 * @param {string[][][]} arr
 * @return {*}  {string[][]}
 */
export const mergeRowsOf1DArraysin2DArrayin3D = (arr: string[][][]): string[][] => {
    const result: string[][] = [];
    arr[0].forEach((row, index) => {
        let temp: string[] = [];
        arr.forEach((rows) => {
            temp = [...temp, ...rows[index]];
        });
        result.push(temp);
    });
    return result;
}

/**
 * 행 열 순서를 바꾸는 함수
 *
 * @param {string[][]} rows
 * @return {*}  {string[][]}
 */
export const rowsToColumns = (rows: string[][]): string[][] => {
    const result: string[][] = [];
    rows[0].forEach((_, index) => {
        const temp: string[] = [];
        rows.forEach((row) => {
            temp.push(row[index]);
        });
        result.push(temp);
    });
    return result;
}

/**
 * 10월 10일 -> 20221010
 *
 * @param {string} dateString
 * @return {*}  {(string | undefined)}
 */
export const handleDate = (dateString: string): string | undefined => {
    try {
        if (dateString === '' || dateString === ' ') { return undefined; }
        const now = new Date()
        const month = Number(dateString.split('월')[0])
        const date = Number(dateString.split('월')[1].split('일')[0])
        const year = now.getFullYear()
        const dateObj = new Date(year, month - 1, date)
        const result = format(dateObj, 'yyyyMMdd')
        return result
    } catch (e) {
        console.error(e);
        throw new Error('날짜 형식이 잘못되었습니다.')
    }
}