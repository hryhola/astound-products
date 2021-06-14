import _ from "lodash";
import { store } from "../../store";
import { selectVariation, addToBasket, fetchRefinements } from "../../store/productsSlice";
import { getAfterAddModal, getErrorAddModal } from "./modals";
import { buildList } from "./list.utils";

import successAddModalTemplate from "./modals/successAdd.handlebars";
import errorAddModalTemplate from "./modals/errorAdd.handlebars";

import "../masterProduct.css";

const handleSelectSize = (e) => {
    const variationId = e.target.dataset.pid;
    const masterId = e.target.dataset.master;
    store.dispatch(selectVariation({ masterId, variationId }));
};

const handleAdd = (e) => {
    e.preventDefault();
    const masterId = e.target.dataset.id;
    try {
        store.dispatch(addToBasket(masterId));
        const afterAddModal = getAfterAddModal();
        afterAddModal.show();
        setTimeout(() => {
            afterAddModal.hide();
        }, 5000);
    } catch (e) {
        const errorAddModal = getErrorAddModal();
        errorAddModal.show();
        setTimeout(() => {
            errorAddModal.hide();
        }, 3000);
    }
};

const setButtonHandlers = () => {
    const masterProducts = document.getElementsByClassName("master-product");

    [...masterProducts].forEach((master) => {
        const variantBtn = master.getElementsByClassName("master-product__select-variant");
        const addBtn = master.getElementsByClassName("master-product__add-button");

        addBtn[0] && addBtn[0].addEventListener("click", handleAdd);

        [...variantBtn].forEach((v) => v.addEventListener("click", handleSelectSize));
    });
};

const handleProductsLoad = () => {
    let prevList = [];

    store.subscribe(() => {
        const { products } = store.getState();

        const list = document.getElementById("list");
        const spinner = document.getElementById("list-spinner");

        if (products.isLoading) {
            list.classList.add("d-none");
            spinner.classList.remove("d-none");
        } else {
            spinner.classList.add("d-none");
            list.classList.remove("d-none");

            if (!_.isEqual(prevList, products.list)) {
                prevList = products.list;

                const listData = document.getElementById("list-data");

                if(products.list) listData.innerHTML = buildList(products.list);

                setButtonHandlers();
            }
        }
    });
};

window.location.pathname === "/list" &&
    window.addEventListener("load", function () {
        handleProductsLoad();

        document.body.innerHTML += successAddModalTemplate();
        document.body.innerHTML += errorAddModalTemplate();

        store.dispatch(fetchRefinements());
    });
