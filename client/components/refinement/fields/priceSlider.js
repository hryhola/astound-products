import "ion-rangeslider/css/ion.rangeSlider.min.css";
import "ion-rangeslider/js/ion.rangeSlider";
import { store } from "../../../store";
import { setRefinement } from "../../../store/productsSlice";

export const initPriceSlider = (min, max, from, to) => {
    window.$("#price-range").ionRangeSlider({
        min,
        max,
        from, 
        to,
        type: "double",
        prefix: "$",
        onFinish: (e) => store.dispatch(setRefinement({ field: "priceFromTo", value: [e.from, e.to] })),
    });
};
