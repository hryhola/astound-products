import { store } from "./store/store";
import { fetchProducts, selectVariation, addToBasket } from "./store/productsSlice";
import { getAfterAddModal, getErrorAddModal } from "./afterAddModal";
import { buildList } from "./list.utils";

import afterSuccessAddModal from "./components/successAdd.handlebars";
import afterErrorAddModal from "./components/errorAddModal.handlebars";

require("./components/masterProduct.css");

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

const handleProductsLoad = () => {
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

            const listData = document.getElementById("list-data");

            console.log("Products list is builded.");
            listData.innerHTML = buildList(products.list);

            const masterProducts = document.getElementsByClassName("master-product");

            [...masterProducts].forEach((master) => {
                const variantBtn = master.getElementsByClassName("master-product__select-variant");
                const addBtn = master.getElementsByClassName("master-product__add-button");

                addBtn[0] && addBtn[0].addEventListener("click", handleAdd);

                [...variantBtn].forEach((v) => v.addEventListener("click", handleSelectSize));
            });
        }
    });
};

window.location.pathname === "/list" &&
    window.addEventListener("load", function () {
        handleProductsLoad();

        document.body.innerHTML += afterSuccessAddModal();
        document.body.innerHTML += afterErrorAddModal();

        store.dispatch(fetchProducts());
    });
