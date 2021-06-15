export const selectBasketProductsQuantity = (productsSlice) => {
    return productsSlice.basket.items.reduce((acc, curr) => acc + curr.quantity, 0);
};

export const selectBasketItemQuantity = (productsSlice, { masterId, variantId }) => {
    const item = productsSlice.basket.items.find((i) => i.masterId === masterId && i.variantId === variantId);

    return item ? item.quantity : undefined;
};

export const selectProductPageInfo = (state) => {
    let product = state.products.list[0];
    if(product) {
        const variation = product.variations.find(v => v.isSelected);
        product = { ...product, ...variation };
        product.variations = product.variations.map(v => ({...v, master: product.ID}))
    }
    return {
        isLoading: state.products.isLoading,
        product,
    };
};
