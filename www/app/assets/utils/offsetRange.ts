export const offsetRange = (start: number, end: number) => {
    const arrayCount = Math.abs(end - start);

    return [...Array(arrayCount)].map((_, i) => i + start);
};
