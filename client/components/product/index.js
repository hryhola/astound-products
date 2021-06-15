import _ from "lodash";
import queryString from "query-string";
import { store } from "../../store";
import { fetchMasterProduct } from "../../store/productsThunks";
import { selectProductPageInfo } from "../../store/productSelectors";

import productPageTemplae from "./product.handlebars";

import "./product.css";

const initPage = () => {
    const pageNode = document.getElementById("product-page");

    const initState = store.getState();

    const build = (state) => {
        pageNode.innerHTML = productPageTemplae(state);

        if(state.product && state.product.longDescription) {
            const descNode = document.getElementById("description-text");
            descNode.innerHTML = state.product.longDescription
        }
    }

    let prevState = selectProductPageInfo(initState);

    build(prevState);

    store.subscribe(() => {
        const currState = selectProductPageInfo(store.getState());
        console.log(currState)
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

        store.dispatch(fetchMasterProduct({ masterId, variationId }));
    });
