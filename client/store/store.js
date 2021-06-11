import { configureStore, combineReducers, getDefaultMiddleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { createWhitelistFilter } from "redux-persist-transform-filter";
import storage from "redux-persist/es/storage";
import hardSet from "redux-persist/lib/stateReconciler/hardSet";

import products from "./productsSlice";

const rootReducer = combineReducers({ products });

const basketFilter = createWhitelistFilter("products", ["basket"]);

const persistConfig = {
    key: "root",
    storage,
    transforms: [basketFilter],
    stateReconciler: hardSet,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    devTools: true,
    middleware: getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ["persist/PERSIST"],
        },
    }),
});

export const persistor = persistStore(store);
