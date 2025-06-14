import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Customer } from '@/types/apps/ecommerceTypes';
import axios from '@/libs/axios';
import { toast } from 'react-toastify';

interface CustomerState {
    customers: Customer[];
    customer: Customer | null;
    loading: boolean;
    error: string | null;
    total: number;
    page: number;
    pageSize: number;
    pages: number;
    filters: Record<string, any>;
    search: string;
    updatedCustomerData: Customer | null;
    deletedCustomerData: string | null;
    createdCustomerData: Customer | null;
}

const initialState: CustomerState = {
    customers: [],
    customer: null,
    loading: false,
    error: null,
    total: 0,
    page: 1,
    pageSize: 10,
    pages: 1,
    filters: {},
    search: '',
    updatedCustomerData: null,
    deletedCustomerData: null,
    createdCustomerData: null,
};

export const fetchCustomers = createAsyncThunk(
    'customer/fetchCustomers',
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
            const response = await axios.get(`/customers?${query}`);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch customers');
        }
    }
);

export const fetchCustomer = createAsyncThunk(
    'customer/fetchCustomer',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/customers/${id}`);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch customer');
        }
    }
);

export const createCustomer = createAsyncThunk(
    'customer/createCustomer',
    async (customerData: Partial<Customer>, { rejectWithValue }) => {
        try {
            const response = await axios.post('/customers', customerData);
            toast.success('Customer created successfully');
            return response.data;
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to create customer');
            return rejectWithValue(err.response?.data?.message || 'Failed to create customer');
        }
    }
);

export const updateCustomer = createAsyncThunk(
    'customer/updateCustomer',
    async ({ id, customerData }: { id: string; customerData: Partial<Customer> }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/customers/${id}`, customerData);
            toast.success('Customer updated successfully');
            return response.data;
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to update customer');
            return rejectWithValue(err.response?.data?.message || 'Failed to update customer');
        }
    }
);

export const deleteCustomer = createAsyncThunk(
    'customer/deleteCustomer',
    async (_id: string, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/customers/${_id}`);
            toast.success('Customer deleted successfully');
            return response.data;
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to delete customer');
            return rejectWithValue(err.response?.data?.message || 'Failed to delete customer');
        }
    }
);

const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        clearCustomerError(state) {
            state.error = null;
        },
        clearCustomer(state) {
            state.customer = null;
        }
    },
    extraReducers: builder => {
        builder
            // Fetch all customers
            .addCase(fetchCustomers.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.customers = action?.payload?.data?.customers;
                state.total = action?.payload?.data?.pagination?.total;
                state.page = action?.payload?.data?.pagination?.page;
                state.pageSize = action?.payload?.data?.pagination?.limit;
                state.pages = action?.payload?.data?.pagination?.pages;
                state.filters = action.meta.arg?.filters || {};
                state.search = action.meta.arg?.search || '';
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch single customer
            .addCase(fetchCustomer.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomer.fulfilled, (state, action) => {
                state.loading = false;
                state.customer = action.payload;
            })
            .addCase(fetchCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create customer
            .addCase(createCustomer.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCustomer.fulfilled, (state, action) => {
                state.loading = false;
                state.createdCustomerData = action.payload;
            })
            .addCase(createCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update customer
            .addCase(updateCustomer.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                state.loading = false;
                state.updatedCustomerData = action.payload;
            })
            .addCase(updateCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete customer
            .addCase(deleteCustomer.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                state.loading = false;
                state.deletedCustomerData = action.payload;
            })
            .addCase(deleteCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearCustomerError, clearCustomer } = customerSlice.actions;
export default customerSlice.reducer;
