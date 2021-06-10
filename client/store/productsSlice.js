import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = { list: [], isLoading: false, error: undefined, basket: [] };

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

export const { selectVariation } = productsSlice.actions;
export default productsSlice.reducer;
