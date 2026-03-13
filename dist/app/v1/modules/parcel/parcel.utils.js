"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateParcelId = void 0;
const generateParcelId = () => {
    const randomPart = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');
    return `PC-${randomPart}`;
};
exports.generateParcelId = generateParcelId;
//# sourceMappingURL=parcel.utils.js.map