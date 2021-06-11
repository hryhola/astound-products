import { store } from "./store/store";
import { selectProductsQuantity } from "./store/productSelectors";

const handleBasketQuantityDisplay = () => {
    let prevQuantity = 0;
    store.subscribe(() => {
        const state = store.getState();

        const currenQuantity = selectProductsQuantity(state.products);

        
        if (currenQuantity !== prevQuantity) {
            console.log("Basket quantity updated.");

            prevQuantity = currenQuantity;

            const basketLink = document.getElementById("main-header__basket-link");

            if (/\[\d+\]/g.test(basketLink.innerText)) {
                basketLink.innerText = basketLink.innerText.replace(/\[\d+\]/g, "[" + currenQuantity + "]");
            } else {
                basketLink.innerText += ` [${currenQuantity}]`
            }


        }
    });
};

window.addEventListener("load", () => {
    handleBasketQuantityDisplay();
});
