import { calcFinalTotal } from "../../../store/productsUtils";

export default (basket) => calcFinalTotal(basket).toFixed(2);
