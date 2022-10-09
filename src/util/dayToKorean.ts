export const dayToKorean = (day: string) => {
    const year = day.slice(0, 4);
    const month = day.slice(4, 6);
    const date = day.slice(6, 8);
    return `${year}년 ${Number(month)}월 ${Number(date)}일`;
};