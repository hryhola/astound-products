import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { calcToalWithoutDiscount } from "./productsUtils";

const initialState = {
    list: [],
    isLoading: false,
    error: undefined,
    basket: {
        items: [],
        totalDiscount: 0,
        shipping: 10,
    },
};

const url = "http://localhost:8089";

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (options, { rejectWithValue }) => {
    try {
        const data = await fetch(`${url}/api/list`).then((r) => r.json());
        if (data.error) rejectWithValue(data.error);
        else return data;
    } catch (e) {
        return rejectWithValue(e.message);
    }
});

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
            const master = state.list.find(m => m.ID === masterId);
            const variation = master.variations.find(v => v.isSelected);
            const variationId = variation.pid;

            const item = state.basket.items.find((i) => i.masterId === masterId && i.variationId === variationId);

            if (item) {
                if (item.quantity === 5) throw new Error("5 items max");
                item.quantity++;
                if (item.quantity > 1) {
                    item.discount = 10;
                }
            } else {
                state.basket.items.push({
                    masterId,
                    variationId,
                    pricePerOne: variation.price,
                    quantity: 1,
                    discount: 0,
                });
            }

            const totalWithoutDiscount = calcToalWithoutDiscount(state.basket);
            console.log(totalWithoutDiscount);

            if (totalWithoutDiscount > 300) {
                state.basket.totalDiscount = 20;
            } 
            
            if (totalWithoutDiscount > 350) {
                state.basket.shipping = 0;
            }

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
    },
});

export const { selectVariation, addToBasket } = productsSlice.actions;
export default productsSlice.reducer;
