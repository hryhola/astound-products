import _ from "lodash";
import { store } from "../../store";
import { selectVariation, addToBasket, fetchRefinements, maxBasketItemsErrorMessage, changePage, changePerPage } from "../../store/productsSlice";
import { getAfterAddModal, getErrorAddModal } from "./modals";
import { buildList } from "./list.utils";

import successAddModalTemplate from "./modals/successAdd.handlebars";
import errorAddModalTemplate from "./modals/errorAdd.handlebars";
import noItemsTemplate from "./noItems.handlebars";

import "./masterProduct.css";
import "./filters.css";

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
        if(e.message === maxBasketItemsErrorMessage) {
            const errorAddModal = getErrorAddModal();
            errorAddModal.show();
            setTimeout(() => {
                errorAddModal.hide();
            }, 3000);
        } else throw e;
    }
};

const handleNextPage = () => store.dispatch(changePage("next"));
const handlePrevPage = () => store.dispatch(changePage("prev"));
const handleLastPage = () => store.dispatch(changePage("last"));
const handleFirstPage = () => store.dispatch(changePage("first"));
const handlePerPage = ({ target }) => store.dispatch(changePerPage(+target.value));

export const setButtonHandlers = (handleVariationSelect) => {
    const masterProducts = document.getElementsByClassName("master-product");
    const nextBts = document.querySelectorAll("[data-role='pagination-next']");
    const prevBtns = document.querySelectorAll("[data-role='pagination-prev']");
    const lastBtn = document.querySelector("[data-role='pagination-last']");
    const firstBtn = document.querySelector("[data-role='pagination-first']");
    const perPageBtn = document.getElementById("per-page-select");

    [...masterProducts].forEach((master) => {
        const variantBtn = master.getElementsByClassName("master-product__select-variant");
        const addBtn = master.getElementsByClassName("master-product__add-button");

        addBtn[0] && addBtn[0].addEventListener("click", handleAdd);

        [...variantBtn].forEach((v) => v.addEventListener("click", (e) => {
            handleVariationSelect && handleVariationSelect(e);
            handleSelectSize(e);
        }));
    });

    nextBts && [...nextBts].forEach(next => {
        next.addEventListener("click", handleNextPage);
    })
    
    prevBtns && [...prevBtns].forEach(prev => {
        prev.addEventListener("click", handlePrevPage);
    })

    lastBtn && lastBtn.addEventListener("click", handleLastPage);
    firstBtn && firstBtn.addEventListener("click", handleFirstPage);
    perPageBtn && perPageBtn.addEventListener("change", handlePerPage);
};

const handleProductsLoad = () => {
    let prevState = [];

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

            const currState = [products.list, products.pagination];

            if (!_.isEqual(prevState, currState)) {
                prevState = currState;

                const listData = document.getElementById("list-data");

                if (products.list && products.list.length > 0) {
                    listData.innerHTML = buildList(products.list, products.pagination);
                } else {
                    listData.innerHTML = noItemsTemplate();
                }
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
