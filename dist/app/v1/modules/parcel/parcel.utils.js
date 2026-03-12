export const generateParcelId = () => {
    const randomPart = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');
    return `PC-${randomPart}`;
};
//# sourceMappingURL=parcel.utils.js.map