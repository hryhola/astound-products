import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import queryString from "query-string";
import { calcToalWithoutDiscount } from "./productsUtils";

const initialState = {
    list: [],
    isLoading: false,
    error: undefined,
    basket: {
        items: [],
        totalDiscount: 0,
        shipping: 15,
        defaultShipping: 15,
    },
    refinement: {
        price: [0, Infinity],
        name: "",
        sizes: [],
        colors: [],
    },
};

const url = "http://localhost:8089";

export const maxBasketItemsErrorMessage = "5 items max";

export const fetchProducts = createAsyncThunk("products/fetchProducts", async ({ refinement }, { rejectWithValue }) => {
    let apiUrl = `${url}/api/list`;

    let getParams = {};

    if (refinement) {
        const { priceFromTo, color, name, size } = refinement;

        getParams = {
            ...getParams,
            priceFrom: priceFromTo && priceFromTo[0],
            priceTo: priceFromTo && priceFromTo[1],
            name,
            color: color.filter((c) => c.checked).map((c) => c.value),
            size: size.filter((s) => s.checked).map((s) => s.value),
        };
    }

    const urlWithQuerry = queryString.stringifyUrl({ url: apiUrl, query: getParams }, { arrayFormat: "comma" });

    try {
        const data = await fetch(urlWithQuerry).then((r) => r.json());
        if (data.error) rejectWithValue(data.error);
        else return data;
    } catch (e) {
        return rejectWithValue(e.message);
    }
});

export const fetchRefinements = createAsyncThunk("products/fetchRefinements", async (options, { rejectWithValue }) => {
    try {
        const data = await fetch(`${url}/api/list/refinements`).then((r) => r.json());
        if (data.error) rejectWithValue(data.error);
        else return data;
    } catch (e) {
        return rejectWithValue(e.message);
    }
});

const calcBasketTotal = (state) => {
    const totalWithoutDiscount = calcToalWithoutDiscount(state.basket);

    state.basket.totalDiscount = totalWithoutDiscount > 300 ? 20 : 0;
    state.basket.shipping = totalWithoutDiscount > 350 ? 0 : 15;
}

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        selectVariation(state, { payload }) {
            const { masterId, variationId } = payload;

            const masterIndex = state.list.findIndex((l) => l.ID === masterId);

            const masterProduct = state.list[masterIndex];

            masterProduct.variations.forEach((l) => {
                l.isSelected = l.pid === variationId;
            });
        },
        addToBasket(state, { payload: masterId }) {
            const master = state.list.find((m) => m.ID === masterId);
            const variation = master.variations.find((v) => v.isSelected);
            const variationId = variation.pid;

            const item = state.basket.items.find((i) => i.masterId === masterId && i.variationId === variationId);

            if (item) {
                if (item.quantity === 5) throw new Error(maxBasketItemsErrorMessage);
                item.quantity++;
                if (item.quantity > 1) {
                    item.discount = 10;
                }
            } else {
                state.basket.items.push({
                    masterId,
                    variationId,
                    pricePerOne: variation.price,
                    detail: variation.displayValue,
                    name: variation.name,
                    quantity: 1,
                    discount: 0,
                });
            }

            calcBasketTotal(state);
        },
        basketItemIncrement(state, { payload }) {
            const { masterId, variationId } = payload;

            const item = state.basket.items.find((i) => i.masterId === masterId && i.variationId === variationId);

            if (item.quantity === 5) throw new Error(maxBasketItemsErrorMessage);

            item.quantity++;

            calcBasketTotal(state);
        },
        basketItemDecrement(state, { payload }) {
            const { masterId, variationId } = payload;

            const item = state.basket.items.find((i) => i.masterId === masterId && i.variationId === variationId);

            if (item.quantity > 1) {
                item.quantity--;
            }
            calcBasketTotal(state);
        },
        basketItemRemove(state, { payload }) {
            const { masterId, variationId } = payload;

            state.basket.items = state.basket.items
                .filter(i => !(i.masterId === masterId && i.variationId === variationId));
            
            calcBasketTotal(state);
        },
        setRefinement(state, { payload }) {
            if (!state.refinement) {
                state.refinement = {};
            }
            state.refinement[payload.field] = payload.value;
        },
        resetRefinement(state) {
            if (state.refinement) {
                state.refinement.name = undefined;
                state.refinement.priceFromTo = undefined;
                state.refinement.size = state.refinement.size.map((s) => ({ ...s, checked: false }));
                state.refinement.color = state.refinement.color.map((s) => ({ ...s, checked: false }));
            }
        },
        toggleRefinementSizeOrColor(state, { payload }) {
            const { field, value } = payload;

            const item = state.refinement[field].find((s) => s.value === value);

            item.checked = !item.checked;
        },
    },
    extraReducers: {
        [fetchProducts.rejected]: (state, { error }) => {
            state.isLoading = false;
            state.error = error.message;
        },
        [fetchProducts.pending]: (state) => {
            state.isLoading = true;
        },
        [fetchProducts.fulfilled]: (state, { payload }) => {
            state.list = payload.data.map((m) => {
                const variations = m.variations;
                if (variations[0]) variations[0].isSelected = true;
                return {
                    ...m,
                    variations,
                };
            });
            state.isLoading = false;
            state.error = undefined;
        },
        [fetchRefinements.rejected]: (state, { error }) => {
            state.isLoading = false;
            state.error = error.message;
        },
        [fetchRefinements.pending]: (state) => {
            state.isLoading = true;
        },
        [fetchRefinements.fulfilled]: (state, { payload }) => {
            if (!state.refinement) state.refinement = {};

            state.refinement = {
                priceMinMax: payload.data.price,
                color: payload.data.color.map((c) => ({
                    value: c,
                    displayValue: c.replace(/_/g, " "),
                    checked: false,
                })),
                size: payload.data.size.map((s) => ({
                    value: s,
                    displayValue: s.replace(/_/g, " "),
                    checked: false,
                })),
            };
            state.isLoading = false;
            state.error = undefined;
        },
    },
});

export const { 
    basketItemIncrement, 
    basketItemDecrement, 
    basketItemRemove,
    selectVariation, 
    addToBasket, 
    setRefinement, 
    toggleRefinementSizeOrColor, 
    resetRefinement 
} = productsSlice.actions;

export default productsSlice.reducer;
