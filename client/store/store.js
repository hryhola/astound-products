import { configureStore, combineReducers } from "@reduxjs/toolkit";

import products from "./productsSlice";

const root = combineReducers({ products });

export const store = configureStore({
    reducer: root,
    devTools: true,
});
