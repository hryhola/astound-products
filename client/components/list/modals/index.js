import  { Modal } from "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle";

export const getAfterAddModal = () => {
    const modalNode = document.getElementById("master-product__add-modal");
    return modalNode ? new Modal(modalNode) : undefined;
};

export const getErrorAddModal = () => {
    const modalNode = document.getElementById("master-product__add-modal--error");
    return modalNode ? new Modal(modalNode) : undefined;
};
