import { configureStore } from '@reduxjs/toolkit'
import boardReducer from '@/lib/slices/board';

export const makeStore = () => {
    return configureStore({
        reducer: {
            board: boardReducer,
        },
        devTools: true,
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']