import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    experience: 0,
    level: 1,
    health: 100,
    maxHealth: 100,
};

const statsSlice = createSlice({
    name: "stats",
    initialState,
    reducers: {
        gainExperience: (state, action) => {
            state.experience += action.payload;
            while (state.experience >= state.level * 100) {
                state.experience -= state.level * 100;
                state.level += 1;
                state.health = state.maxHealth;
            }
        },
        takeDamage: (state, action) => {
            state.health = Math.max(0, state.health - action.payload);
        },
        heal: (state, action) => {
            state.health = Math.min(
                state.maxHealth,
                state.health + action.payload
            );
        },
        resetStats: () => initialState,
    },
});

export const { gainExperience, takeDamage, heal, resetStats } =
    statsSlice.actions;

export default statsSlice.reducer;
