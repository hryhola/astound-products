import { calcTotalWithItemDiscount } from "../../../store/productsUtils"

export default (v) => calcTotalWithItemDiscount(v).toFixed(2);