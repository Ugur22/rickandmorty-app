import { configureStore } from '@reduxjs/toolkit'
import themeReducer, { getInitialTheme } from '../features/theme/themeSlice'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
  preloadedState: {
    theme: { mode: getInitialTheme() },
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
