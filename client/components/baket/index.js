import _ from "lodash";
import { store } from "../../store";
import { basketItemDecrement, basketItemIncrement, basketItemRemove, fetchTax, maxBasketItemsErrorMessage } from "../../store/productsSlice";
import { calcTotalWithoutTax } from "../../store/productsUtils";

import productsTableTemplate from "./productsTable.handlebars";
import summaryTemplate from "./summary.handlebars";
import errorAddTemplate from "../list/modals/errorAdd.handlebars";
import { getErrorAddModal } from "../list/modals";

import "./helpers/isEqual";
import "./helpers/isGreater";
import "./basket.css";

const handleItemQuantityIncrement = (e) => {
    const row = e.path.find((u) => u.tagName === "TR");

    const { masterId, variationId } = row.dataset;

    try {
        store.dispatch(basketItemIncrement({ masterId, variationId }));
    } catch (e) {
        if (e.message === maxBasketItemsErrorMessage) {
            const errorModal = getErrorAddModal();
            errorModal.show();
        } else throw e;
    }
};

const handleItemQuantityDecrement = (e) => {
    const row = e.path.find((u) => u.tagName === "TR");

    const { masterId, variationId } = row.dataset;

    store.dispatch(basketItemDecrement({ masterId, variationId }));
};

const handleItemQuantityRemove = (e) => {
    const row = e.path.find((u) => u.tagName === "TR");

    const { masterId, variationId } = row.dataset;

    if (confirm("Are you shure you want to remove this item?")) {
        store.dispatch(basketItemRemove({ masterId, variationId }));
    }
};

const initAddRemoveBtsn = (tableNode) => {
    const inrementBtns = tableNode.getElementsByClassName("quantity-btn--add");
    const decrementBtns = tableNode.getElementsByClassName("quantity-btn--remove");
    const removeBts = tableNode.getElementsByClassName("remove-item-btn");

    [...inrementBtns].forEach((incBtn) => {
        incBtn.addEventListener("click", handleItemQuantityIncrement);
    });

    [...decrementBtns].forEach((decBtn) => {
        decBtn.addEventListener("click", handleItemQuantityDecrement);
    });

    [...removeBts].forEach((remBtn) => {
        remBtn.addEventListener("click", handleItemQuantityRemove);
    });
};

const initCalcBtn = (basketSlice) => {
    const calcTaxBtn = document.getElementById("summary__calc-tax");

    calcTaxBtn.addEventListener("click", (e) => {
        e.preventDefault();
        store.dispatch(fetchTax({ amount: calcTotalWithoutTax(basketSlice) }));
    });
}

const initBasket = () => {
    const tableNode = document.getElementById("baket-table");
    const summaryNode = document.getElementById("baket-summary");

    const initState = store.getState();

    const initBasketState = { ...initState.products.basket, isLoading: initState.products.isLoading };

    const buildPage = (basketSlice) => {
        tableNode.innerHTML = productsTableTemplate(basketSlice);
        summaryNode.innerHTML = summaryTemplate(basketSlice);
        initAddRemoveBtsn(tableNode);
        initCalcBtn(basketSlice);
    };

    buildPage(initBasketState);

    let prevBasket = initBasketState;

    store.subscribe(() => {
        const cuttentState = store.getState();
        const currentBasket = { ...cuttentState.products.basket, isLoading: cuttentState.products.isLoading };

        if (!_.isEqual(currentBasket, prevBasket)) {
            buildPage(currentBasket);

            prevBasket = currentBasket;
        }
    });
};

window.location.pathname === "/basket" && window.addEventListener("load", () => {
    document.body.innerHTML += errorAddTemplate();

    initBasket();
});
