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
      page: 1,
      pageSize,
      search,
      filters: { ...filters, role: e.target.value }
    }) as any);
  };
  const handlePlanChange = (e: any) => {
    dispatch(fetchUsers({
      page: 1,
      pageSize,
      search,
      filters: { ...filters, plan: e.target.value }
    }) as any);
  };
  const handleStatusChange = (e: any) => {
    dispatch(fetchUsers({
      page: 1,
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
            <MenuItem value='author'>Author</MenuItem>
            <MenuItem value='editor'>Editor</MenuItem>
            <MenuItem value='maintainer'>Maintainer</MenuItem>
            <MenuItem value='subscriber'>Subscriber</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            select
            fullWidth
            id='select-plan'
            value={filters.plan || ''}
            onChange={handlePlanChange}
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            <MenuItem value=''>Select Plan</MenuItem>
            <MenuItem value='basic'>Basic</MenuItem>
            <MenuItem value='company'>Company</MenuItem>
            <MenuItem value='enterprise'>Enterprise</MenuItem>
            <MenuItem value='team'>Team</MenuItem>
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
            <MenuItem value='pending'>Pending</MenuItem>
            <MenuItem value='active'>Active</MenuItem>
            <MenuItem value='inactive'>Inactive</MenuItem>
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  );
}

export default TableFilters
