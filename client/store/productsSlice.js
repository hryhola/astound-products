import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = { list: undefined, isLoading: false, error: undefined };

const url = "http://localhost:8089";

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (options, { rejectWithValue }) => {
    const data = await fetch(`${url}/api/list`).then((r) => r.json());

    if (data.error) rejectWithValue(data.error);
    else return data;
});

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setIsLoading(state, { payload }) {
            state.isLoading = payload;
        },
    },
    extraReducers: {
        [fetchProducts.rejected]: (state, { payload }) => {
            state.isLoading = false;
            status.error = payload;
        },
        [fetchProducts.pending]: (state) => {
            state.isLoading = true;
        },
        [fetchProducts.fulfilled]: (state, { payload }) => {
            state.list = payload.data;
            state.isLoading = false;
            state.error = undefined;
        },
    },
});

export const { setIsLoading } = productsSlice.actions;
export default productsSlice.reducer;
