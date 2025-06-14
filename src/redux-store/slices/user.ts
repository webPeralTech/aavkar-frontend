import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/libs/axios';
import { toast } from 'react-toastify';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'admin' | 'manager' | 'employee' | 'sales' | 'printing operator';
    isActive: boolean;
    // password is not included for security reasons
}

interface UserState {
    users: User[];
    user: User | null;
    loading: boolean;
    error: string | null;
    total: number;
    page: number;
    pageSize: number;
    pages: number;
    filters: Record<string, any>;
    search: string;
    deletedUserData: string | null;
}

const initialState: UserState = {
    users: [],
    user: null,
    loading: false,
    error: null,
    total: 0,
    page: 1,
    pageSize: 10,
    pages: 1,
    filters: {},
    search: '',
    deletedUserData: null,
};

export const fetchUsers = createAsyncThunk(
    'user/fetchUsers',
    async (
        params: {
            page?: number;
            pageSize?: number;
            search?: string;
            filters?: Record<string, any>;
        } = {},
        { rejectWithValue }
    ) => {
        try {
            const { page = 1, pageSize = 10, search = '', filters = {} } = params;
            const query = new URLSearchParams({
                page: String(page),
                pageSize: String(pageSize),
                search,
                ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '')),
            }).toString();
            const response = await axios.get(`/users?${query}`);
            console.log("user-response", response.data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
        }
    }
);

export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/users/${id}`);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
        }
    }
);

export const createUser = createAsyncThunk(
    'user/createUser',
    async (userData: Partial<User>, { rejectWithValue }) => {
        try {
            const response = await axios.post('/users', userData);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to create user');
        }
    }
);

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async ({ id, userData }: { id: string; userData: Partial<User> }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/users/${id}`, userData);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update user');
        }
    }
);

export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    async (_id: string, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/users/${_id}`);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete user');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUserError(state) {
            state.error = null;
        },
        clearUser(state) {
            state.user = null;
        }
    },
    extraReducers: builder => {
        builder
            // Fetch all users
            .addCase(fetchUsers.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                console.log("user-action", action.payload);
                state.loading = false;
                state.users = action?.payload?.data?.users;
                state.total = action?.payload?.data?.pagination?.totalCount;
                state.page = action?.payload?.data?.pagination?.currentPage;
                state.pageSize = action?.payload?.data?.pagination?.limit;
                state.pages = action?.payload?.data?.pagination?.totalPages;
                // Optionally store filters/search for UI
                state.filters = action.meta.arg?.filters || {};
                state.search = action.meta.arg?.search || '';
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch single user
            .addCase(fetchUser.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create user
            .addCase(createUser.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                toast.success('User created successfully');
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(createUser.rejected, (state, action) => {
                toast.error(action.payload as string || 'Failed to create user');
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update user
            .addCase(updateUser.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                toast.success('User updated successfully');
                state.loading = false;
                state.users = state.users.map(u => u.id === action.payload.id ? action.payload : u);
                if (state.user && state.user.id === action.payload.id) {
                    state.user = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                toast.error(action.payload as string || 'Failed to update user');
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete user
            .addCase(deleteUser.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                toast.success('User deleted successfully');
                state.loading = false;
                state.deletedUserData = action.payload;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                toast.error(action.payload as string || 'Failed to delete user');
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearUserError, clearUser } = userSlice.actions;
export default userSlice.reducer;
