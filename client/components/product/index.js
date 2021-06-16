import _ from "lodash";
import queryString from "query-string";
import { store } from "../../store";
import { fetchMasterProduct, fetchVariation } from "../../store/productsThunks";
import { selectProductPageInfo } from "../../store/productSelectors";
import { setButtonHandlers } from "../list";

import productPageTemplate from "./product.handlebars";
import errorAddModalTemplate from "../list/modals/errorAdd.handlebars";
import successAddModalTemplate from "../list/modals/successAdd.handlebars";

import "./product.css";

const handleVariationSelect = (e) => {
    const variationId = e.target.dataset.pid;
    const masterId = e.target.dataset.master;

    store.dispatch(fetchVariation({ masterId, variationId }));
}

const initPage = () => {
    const pageNode = document.getElementById("product-page");

    const initState = store.getState();

    const build = (state) => {
        pageNode.innerHTML = productPageTemplate(state);

        if (state.product && state.product.longDescription) {
            const descNode = document.getElementById("description-text");
            descNode.innerHTML = state.product.longDescription;
        }

        setButtonHandlers(handleVariationSelect);
    };

    let prevState = selectProductPageInfo(initState);

    build(prevState);

    store.subscribe(() => {
        const currState = selectProductPageInfo(store.getState());
        setButtonHandlers();
        if (!_.isEqual(prevState, currState)) {
            build(currState);

            prevState = currState;
        }
    });
};

window.location.pathname.includes("/product/") &&
    window.addEventListener("load", () => {
        const masterId = window.location.pathname.split("/")[2];
        const variationId = queryString.parseUrl(window.location.href).query.pid;

        initPage(masterId, variationId);

        const successElement = document.createElement("div");
        successElement.innerHTML = successAddModalTemplate();
        const errorElement = document.createElement("div");
        errorElement.innerHTML = errorAddModalTemplate();

        document.body.appendChild(successElement);
        document.body.appendChild(errorElement);

        store.dispatch(fetchMasterProduct({ masterId, variationId }));
    });
