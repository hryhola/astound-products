import { store } from "../../../store";
import { setRefinement } from "../../../store/productsSlice";

export const initNameField = () => {
    const nameField = document.getElementById("product-name");

    nameField.addEventListener("change", (e) => {
        store.dispatch(setRefinement({ field: "name", value: e.target.value }))
    });
};
