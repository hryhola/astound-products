import { store } from "../../../store";
import { toggleRefinementSizeOrColor } from "../../../store/productsSlice";

const checkboxHandlerGenerator = (field) => {
    return (e) => {
        e.target.checked = true;
        store.dispatch(toggleRefinementSizeOrColor({ field, value: e.target.id }));
    };
};

const handleSize = checkboxHandlerGenerator("size");
const handleColor = checkboxHandlerGenerator("color");

export const handleSizeAndColorClick = () => {
    const sizeGroup = document.getElementById("size-group");
    const colorGroup = document.getElementById("color-group");

    [...sizeGroup.children].forEach((div) => {
        const check = div.getElementsByTagName("input")[0];
        check.addEventListener("click", handleSize);
    });

    [...colorGroup.children].forEach((div) => {
        const check = div.getElementsByTagName("input")[0];
        check.addEventListener("click", handleColor);
    });
};
