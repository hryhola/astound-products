import { store } from "./store/store";
import { fetchProducts } from "./store/productsSlice";
const masterProduct = require("./components/masterProduct.handlebars");
require("./components/masterProduct.css");


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

            listData.innerHTML = products.list.map((l) => masterProduct(l)).join("");
        }
    });
};

window.location.pathname === "/list" &&
    window.addEventListener("load", function () {
        handleProductsLoad();
        store.dispatch(fetchProducts());
    });
