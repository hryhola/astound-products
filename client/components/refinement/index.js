import _ from "lodash";
import { store } from "../../store";
import refinementTemplate from "./refinement.handlebars";
import { initPriceSlider } from "./fields/priceSlider";
import { initNameField } from "./fields/productName";
import { handleSizeAndColorClick } from "./fields/sizeAndColor";
import { fetchProducts, resetRefinement } from "../../store/productsSlice";

import "./reminement.css";

export const setRefinements = (productsSlice) => {
    const [min, max] = productsSlice.refinement.priceMinMax;

    const [from, to] = productsSlice.refinement.priceFromTo ? productsSlice.refinement.priceFromTo : [min, max];

    initPriceSlider(min, max, from, to);

    initNameField();
};

const initResetBtn = () => {
    const resetBtn = document.getElementById("reset-refinement");

    resetBtn.addEventListener("click", () => {
        store.dispatch(resetRefinement());
    });
}

const initRefinemant = () => {
    const initState = store.getState();
    let prevRefinement = initState.products.refinement;

    const refinementNode = document.getElementById("list-refinement");
    refinementNode.innerHTML = refinementTemplate(prevRefinement);

    store.subscribe(() => {
        const state = store.getState();
        const currentRefinement = state.products.refinement;
        if (!_.isEqual(prevRefinement, currentRefinement)) {
            refinementNode.innerHTML = refinementTemplate(currentRefinement);
            initResetBtn();
            prevRefinement = currentRefinement;

            setRefinements(state.products);
            handleSizeAndColorClick();

            store.dispatch(fetchProducts())
        }
    });
};

window.location.pathname === "/list" && window.addEventListener("load", initRefinemant);
