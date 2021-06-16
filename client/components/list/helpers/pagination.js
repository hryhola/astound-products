export default (type, { currentPage, totalPages }) => {
    switch (type) {
        case "prev": return currentPage > 1 ? currentPage - 1 : undefined;
        case "next": return currentPage === totalPages ? undefined : currentPage + 1;
    }
}