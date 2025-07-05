import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    teams: [],
    players: [],
    leagues: [],
};

const favoritesSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {
        setFavorites: (state, action) => {
            const { category, items } = action.payload;
            state[category] = items;
        },
        addFavorite: (state, action) => {
            const { category, item } = action.payload;
            if (!state[category].includes(item)) {
                state[category].push(item);
            }
        },
        removeFavorite: (state, action) => {
            const { category, item } = action.payload;
            state[category] = state[category].filter((i) => i !== item);
        },
    },
});

export const { setFavorites, addFavorite, removeFavorite } = favoritesSlice.actions;

export default favoritesSlice.reducer;
