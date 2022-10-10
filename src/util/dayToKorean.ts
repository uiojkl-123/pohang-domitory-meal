export const dayToKorean = (day: string) => {
    const year = Number(day.slice(0, 4));
    const month = Number(day.slice(4, 6));
    const date = Number(day.slice(6, 8));
    const dateObj = new Date(year, month - 1, date);
    const dayKorean = dateObj.toLocaleDateString('ko-KR', { weekday: 'short' });
    return `${year}년 ${month}월 ${date}일 (${dayKorean})`;
};