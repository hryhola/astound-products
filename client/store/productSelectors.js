export const selectProductsQuantity = (productsSlice) => {
    return productsSlice.basket.items.reduce((acc, curr) => acc + curr.quantity, 0);
};
