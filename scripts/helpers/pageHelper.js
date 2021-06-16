const _ = require("lodash");
const pageHelper = {};

pageHelper.pagination = (dataArray, perPage, currentPage) => {
    if (perPage && currentPage) {
        const pagesData = _.chunk(dataArray, perPage);

        return {
            page: pagesData[currentPage - 1],
            totalPages: pagesData.length,
        };
    } else {
        return {
            page: dataArray,
            totalPages: 1,
        };
    }
};

module.exports = pageHelper;
