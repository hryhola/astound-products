import { calcTotalWithoutTax } from "../../../store/productsUtils";

export default (basket, useTotalDiscount = true) => calcTotalWithoutTax(basket, useTotalDiscount).toFixed(2);
