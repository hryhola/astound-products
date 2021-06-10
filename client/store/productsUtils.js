export const calcToalWithoutDiscount = (basket) => {
    return basket.items.reduce((acc, curr) => acc + curr.pricePerOne * curr.quantity, 0);
};
