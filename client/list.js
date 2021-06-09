import { store } from "./store/store";
import { fetchProducts } from "./store/productsSlice";

window.addEventListener("load", function () {
    const currentPage = this.window.location.pathname;

    if (currentPage !== "/list") return;

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

            list.children[1].innerHTML = products.list.reduce((p, c) => p.concat("<p>" + c.name + "</p>"), ""); // TODO: replace with hbs
        }
    });

    store.dispatch(fetchProducts());
});
