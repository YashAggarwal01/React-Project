import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: [],
    productsNumber: 0
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {

        addToCart: (state, action) => {
            const qty = Number(action.payload?.quantity ?? 1);

            const addProductExists = state.products.find(
                (product) => product.id === action.payload.id
            );

            if (addProductExists) {
                addProductExists.quantity += qty;
            } else {
                state.products.push({
                    ...action.payload,
                    quantity: qty
                });
            }

            state.productsNumber += qty;
        },

        removeFromCart: (state, action) => {
            const removeItem = state.products.find(
                item => item.id === action.payload.id
            );
            state.productsNumber -= state.productsNumber-productToRemove.quantity;
            const idx = state.products.findIndex((product)=>product.id === action.payload)
            state.products.splice(idx,1);
        }
    }
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;