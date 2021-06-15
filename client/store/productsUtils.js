export const discount = (value, percent) => {
    return value - value * (percent / 100);
};

export const calcToalWithoutDiscount = (basket) => {
    return basket.items.reduce((acc, curr) => acc + curr.pricePerOne * curr.quantity, 0);
};

export const calcTotalWithItemDiscount = (basket) => {
    return basket.items.reduce((acc, curr) => acc + (curr.quantity > 1 ? discount(curr.pricePerOne, 10) : curr.pricePerOne) * curr.quantity, 0);
};

export const calcTotalWithoutTax = (basket, useTotalDiscount = true) => {
    const { shipping, totalDiscount} = basket;
    const productsTotal = calcTotalWithItemDiscount(basket);

    const result = useTotalDiscount ?
        discount(productsTotal + shipping, totalDiscount) :
        productsTotal + shipping;

    return result;
}

export const calcFinalTotal = (basket) => {
    return +calcTotalWithoutTax(basket, true) + +basket.tax;
}

export const calcAndSetBasketTotalValues = (state) => {
    const totalWithoutDiscount = calcToalWithoutDiscount(state.basket);

    state.basket.totalDiscount = totalWithoutDiscount > 300 ? 20 : 0;
    state.basket.shipping = totalWithoutDiscount > 350 ? 0 : 15;
    state.basket.tax = 0;
};