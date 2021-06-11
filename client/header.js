import { store } from "./store/store";
import { selectProductsQuantity } from "./store/productSelectors";

const setBasketQuantity = (quantity) => {
    const basketLink = document.getElementById("main-header__basket-link");

    if (/\[\d+\]/g.test(basketLink.innerText)) {
        basketLink.innerText = basketLink.innerText.replace(/\[\d+\]/g, "[" + quantity + "]");
    } else {
        basketLink.innerText += ` [${quantity}]`
    }
}

const handleBasketQuantityDisplay = () => {
    const initState= store.getState();
    let prevQuantity = selectProductsQuantity(initState.products);
    setBasketQuantity(prevQuantity)

    store.subscribe(() => {
        const state = store.getState();

        const currenQuantity = selectProductsQuantity(state.products);

        
        if (currenQuantity !== prevQuantity) {
            console.log("Basket quantity updated.");

            prevQuantity = currenQuantity;

            setBasketQuantity(currenQuantity);
        }
    });
};

window.addEventListener("load", () => {
    handleBasketQuantityDisplay();
});
