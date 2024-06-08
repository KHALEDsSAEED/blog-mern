import { createSlice } from '@reduxjs/toolkit';

const getDefaultTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) { // if user's system theme is dark
        return 'dark'; // return dark theme
    }
    return 'light'; // otherwise return light theme
};

const initialState = {
    theme: getDefaultTheme(), // get the default theme
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light'; // toggle the theme
        },
    },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;