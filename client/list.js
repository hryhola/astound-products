import { store } from "./store/store";
import { fetchProducts, selectVariation } from "./store/productsSlice";
import { buildList } from "./list.utils";

require("./components/masterProduct.css");

const handleSelectSize = (e) => {
    const variationId = e.target.dataset.pid;
    const masterId = e.target.dataset.master;
    store.dispatch(selectVariation({ masterId, variationId }));
}

const handleProductsLoad = () => {
    let prevIsLoading = true;
    store.subscribe(() => {
        const { products } = store.getState();
        
        if(prevIsLoading === products.isLoading) return;
        prevIsLoading === !products.isLoading;

        const list = document.getElementById("list");
        const spinner = document.getElementById("list-spinner");

        if (products.isLoading) {
            list.classList.add("d-none");
            spinner.classList.remove("d-none");
        } else {
            spinner.classList.add("d-none");
            list.classList.remove("d-none");

            const listData = document.getElementById("list-data");

            listData.innerHTML = buildList(products.list);

            const masterProducts = document.getElementsByClassName("master-product");

            [...masterProducts].forEach(master => {
                const addBtn = master.getElementsByClassName("master-product__add-button")[0];
                const variantBtn = master.getElementsByClassName("master-product__select-variant");

                [...variantBtn].forEach(v => v.addEventListener("click", handleSelectSize))

            })
        }
    });
};

window.location.pathname === "/list" &&
    window.addEventListener("load", function () {
        handleProductsLoad();
        store.dispatch(fetchProducts());
    });
