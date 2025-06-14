// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'

// Slice Imports
import chatReducer from '@/redux-store/slices/chat'
import calendarReducer from '@/redux-store/slices/calendar'
import kanbanReducer from '@/redux-store/slices/kanban'
import emailReducer from '@/redux-store/slices/email'
import authReducer from '@/redux-store/slices/auth'
import userReducer from '@/redux-store/slices/user'
import customerReducer from '@/redux-store/slices/customer'

export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
    chat: chatReducer,
    email: emailReducer,
    kanban: kanbanReducer,
    auth: authReducer,
    user: userReducer,
    customer: customerReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
import { useDispatch } from 'react-redux';
export const useAppDispatch: () => AppDispatch = useDispatch;
