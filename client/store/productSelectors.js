export const selectBasketProductsQuantity = (productsSlice) => {
    return productsSlice.basket.items.reduce((acc, curr) => acc + curr.quantity, 0);
};

export const selectBasketItemQuantity = (productsSlice, { masterId, variantId }) => {
    const item = productsSlice.basket.items.find((i) => i.masterId === masterId && i.variantId === variantId);

    return item ? item.quantity : undefined;
};
