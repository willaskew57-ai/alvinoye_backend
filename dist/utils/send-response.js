const sendResponse = (res, data) => {
    res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        average_rating: data.average_rating,
        meta: data.meta,
        data: data.data,
    });
};
export default sendResponse;
//# sourceMappingURL=send-response.js.map