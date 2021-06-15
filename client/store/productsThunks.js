
import { createAsyncThunk } from "@reduxjs/toolkit";
import queryString from "query-string";

const url = `http://${process.env.APP_HOST}:${process.env.APP_PORT}`;

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
