// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '@/redux-store/slices/user';

const TableFilters = () => {
  const dispatch = useDispatch();
  const { filters, page, pageSize, search } = useSelector((state: any) => state.user);

  const handleRoleChange = (e: any) => {
    dispatch(fetchUsers({
      page: page,
      pageSize,
      search,
      filters: { ...filters, role: e.target.value }
    }) as any);
  };

  // Local state for search input
  const [searchInput, setSearchInput] = useState(search);
  const debounceRef = useState<{ timeout: NodeJS.Timeout | null }>({ timeout: null })[0];

  // Sync local state if Redux search changes externally
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value); // update input immediately
    if (debounceRef.timeout) clearTimeout(debounceRef.timeout);
    debounceRef.timeout = setTimeout(() => {
      dispatch(fetchUsers({
        page: page,
        pageSize,
        search: value,
        filters
      }) as any);
    }, 1000);
  };

  const handleStatusChange = (e: any) => {
    dispatch(fetchUsers({
      page: page,
      pageSize,
      search,
      filters: { ...filters, status: e.target.value }
    }) as any);
  };

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            fullWidth
            id='search-users'
            placeholder='Search users...'
            value={searchInput}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <i className='tabler-search text-xl text-textSecondary' style={{ marginRight: 8 }} />
              )
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            select
            fullWidth
            id='select-role'
            value={filters.role || ''}
            onChange={handleRoleChange}
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            <MenuItem value=''>Select Role</MenuItem>
            <MenuItem value='admin'>Admin</MenuItem>
            <MenuItem value='manager'>Manager</MenuItem>
            <MenuItem value='employee'>Employee</MenuItem>
            <MenuItem value='sales'>Sales</MenuItem>
            <MenuItem value='printing operator'>Printing Operator</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            select
            fullWidth
            id='select-status'
            value={filters.status || ''}
            onChange={handleStatusChange}
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            <MenuItem value=''>Select Status</MenuItem>
            <MenuItem value='active'>Active</MenuItem>
            <MenuItem value='inactive'>Inactive</MenuItem>
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  );
}

export default TableFilters
