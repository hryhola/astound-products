
import { createAsyncThunk } from "@reduxjs/toolkit";
import queryString from "query-string";

import { setCurrentPage, setPerPage } from "./productsSlice";

const url = `http://${process.env.APP_HOST}:${process.env.APP_PORT}`;

export const changePerPage = createAsyncThunk("products/changePerPage", async (perPage, { dispatch, getState }) => {
    dispatch(setPerPage(perPage));
    dispatch(setCurrentPage(1));
    dispatch(fetchProducts());
});

export const changePage = createAsyncThunk("products/changePage", async (page, { dispatch, getState }) => {
    const { pagination } = getState().products;
    const { currentPage, totalPages } = pagination;
    
    const isValidRequest =
        (typeof page === "number" && (page >= 1 || page <= totalPages)) ||
        (page === "next" && currentPage < totalPages) ||
        (page === "prev" && currentPage > 1) ||
        (page === "last") ||
        (page === "first");

    if (isValidRequest) {
        dispatch(setCurrentPage(page));
        dispatch(fetchProducts());
    }
});

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, { rejectWithValue, getState }) => {
    const { products } = getState();
    const { currentPage, perPage } = products.pagination;
    const { refinement } = products;

    let apiUrl = `${url}/api/list`;

    let getParams = {
        page: currentPage,
        perPage,
    };

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

export const fetchTax = createAsyncThunk("products/fetchTax", async ({ amount }, { rejectWithValue }) => { 
    const apiUrl = `${url}/api/tax`;
    const urlWithParams = queryString.stringifyUrl({ url: apiUrl, query: { amount } });
    
    try {
        const data = await fetch(urlWithParams).then((r) => r.json());
        if (data.error) rejectWithValue(data.error);
        else return data;
    } catch (e) {
        return rejectWithValue(e.message);
    }
});

export const fetchMasterProduct = createAsyncThunk("products/fetchMasterProduct", async ({ masterId, variationId }, { rejectWithValue }) => { 
    const apiUrl = `${url}/api/product/${masterId}`;
    const urlWithParams = queryString.stringifyUrl({ url: apiUrl, query: { pid: variationId } });
    
    try {
        const data = await fetch(urlWithParams).then((r) => r.json());
        if (data.error) rejectWithValue(data.error);
        else return data.data;
    } catch (e) {
        return rejectWithValue(e.message);
    }
});

export const fetchVariation = createAsyncThunk("products/fetchVariation", async ({ masterId, variationId }, { rejectWithValue }) => { 
    const apiUrl = `${url}/api/variation/${masterId}/${variationId}`;
    try {
        const data = await fetch(apiUrl).then((r) => r.json());
        if (data.error) rejectWithValue(data.error);
        else return data.data;
    } catch (e) {
        return rejectWithValue(e.message);
    }
});