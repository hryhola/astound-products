import { createSlice } from "@reduxjs/toolkit";
import { calcAndSetBasketTotalValues } from "./productsUtils";
import { fetchProducts, fetchRefinements, fetchTax, fetchMasterProduct, fetchVariation } from "./productsThunks";

export const maxBasketItemsErrorMessage = "5 items max";

const initialState = {
    list: [],
    isLoading: false,
    error: undefined,
    tax: undefined,
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

            calcAndSetBasketTotalValues(state);
        },
        basketItemIncrement(state, { payload }) {
            const { masterId, variationId } = payload;

            const item = state.basket.items.find((i) => i.masterId === masterId && i.variationId === variationId);

            if (item.quantity === 5) throw new Error(maxBasketItemsErrorMessage);

            item.quantity++;

            calcAndSetBasketTotalValues(state);
        },
        basketItemDecrement(state, { payload }) {
            const { masterId, variationId } = payload;

            const item = state.basket.items.find((i) => i.masterId === masterId && i.variationId === variationId);

            if (item.quantity > 1) {
                item.quantity--;
            }
            calcAndSetBasketTotalValues(state);
        },
        basketItemRemove(state, { payload }) {
            const { masterId, variationId } = payload;

            state.basket.items = state.basket.items.filter((i) => !(i.masterId === masterId && i.variationId === variationId));

            calcAndSetBasketTotalValues(state);
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
        setTax(state, { payload }) {
            state.tax = payload;
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
        [fetchTax.rejected]: (state, { error }) => {
            state.isLoading = false;
            state.error = error.message;
        },
        [fetchTax.pending]: (state) => {
            state.isLoading = true;
        },
        [fetchTax.fulfilled]: (state, { payload }) => {
            state.basket.tax = payload.data;
            state.isLoading = false;
            state.error = undefined;
        },
        [fetchMasterProduct.rejected]: (state, { error }) => {
            state.isLoading = false;
            state.error = error.message;
        },
        [fetchMasterProduct.pending]: (state) => {
            state.isLoading = true;
        },
        [fetchMasterProduct.fulfilled]: (state, { payload, meta }) => {
            const { variationId } = meta.arg;
            const selected = payload.variations.find((v) => v.pid === variationId);
            selected.isSelected = true;
            state.list.push(payload);
            state.isLoading = false;
            state.error = undefined;
        },
        [fetchVariation.rejected]: (state, { error }) => {
            state.isLoading = false;
            state.error = error.message;
        },
        [fetchVariation.pending]: (state) => {
            state.isLoading = true;
        },
        [fetchVariation.fulfilled]: (state, { payload, meta }) => {
            const { variationId, masterId } = meta.arg;

            const master = state.list.find((i) => i.ID === masterId);

            if (master) {
                const variationIndex = master.variations.findIndex((v) => v.pid === variationId);

                if (variationId === -1) {
                    master.variations.push(payload);
                } else {
                    master.variations[variationIndex] = { ...master.variations[variationIndex], ...payload };
                }
            }

            state.isLoading = false;
            state.error = undefined;
        },
    },
});

export * from "./productsThunks";

export const { basketItemIncrement, basketItemDecrement, basketItemRemove, selectVariation, addToBasket, setRefinement, toggleRefinementSizeOrColor, resetRefinement, setTax } = productsSlice.actions;

export default productsSlice.reducer;
