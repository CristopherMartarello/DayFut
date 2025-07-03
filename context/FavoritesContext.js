import React, { createContext, useContext, useReducer } from "react";

const FavoritesContext = createContext();

const initialState = {
    teams: [],
    players: [],
    leagues: [],
};

function favoritesReducer(state, action) {
    const { type, payload } = action;
    switch (type) {
        case "ADD_FAVORITE":
            return {
                ...state,
                [payload.category]: [...state[payload.category], payload.item],
            };
        case "REMOVE_FAVORITE":
            return {
                ...state,
                [payload.category]: state[payload.category].filter(
                    (item) => item !== payload.item
                ),
            };
        case "SET_FAVORITES":
            return {
                ...state,
                [payload.category]: payload.items,
            };
        default:
            return state;
    }
}

export const FavoritesProvider = ({ children }) => {
    const [state, dispatch] = useReducer(favoritesReducer, initialState);

    return (
        <FavoritesContext.Provider value={{ state, dispatch }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
