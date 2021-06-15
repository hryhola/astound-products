import { calcToalWithoutDiscount } from "../../../store/productsUtils"

export default (v) => calcToalWithoutDiscount(v).toFixed(2);