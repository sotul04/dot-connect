import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
    isAuthenticated: false,
    username: '',
    id: 0,
}

export interface SignInProps {
    username: string;
    id: number;
}

const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signIn: (state, action: PayloadAction<SignInProps>) => {
            state.isAuthenticated = true,
            state.username = action.payload.username;
            state.id = action.payload.id;
        },
        signOut: () => {
            return {
                isAuthenticated: false,
                username: '',
                id: 0,
            }
        }
    }
});

export const {signIn, signOut} = AuthSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default AuthSlice.reducer;