export const dayDiffToKorean = (diff: number) => {
    if (diff === 0) {
        return '오늘'
    } else if (diff === 1) {
        return '어제'
    } else if (diff === -1) {
        return '내일'
    } else if (diff === -2) {
        return '모레'
    } else if (diff === 2) {
        return '그저께'
    } else if (diff > 1) {
        return diff.toString() + '일 전'
    } else {
        return Math.abs(diff).toString() + '일 후'
    }
}