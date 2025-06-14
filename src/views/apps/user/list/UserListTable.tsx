'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports
import type { ThemeColor } from '@core/types'
import type { UsersType } from '@/types/apps/userTypes'
import type { Locale } from '@configs/i18n'

// Component Imports
import TableFilters from './TableFilters'
import AddUserDrawer from './AddUserDrawer'
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type UsersTypeWithAction = UsersType & {
  action?: string
}

type MuiChipColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'default';

type UserRoleType = {
  [key: string]: { icon: string; color: MuiChipColor }
}

type UserStatusType = {
  [key: string]: MuiChipColor
}

// Styled Components
const Icon = styled('i')({})

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// Vars
const userRoleObj: UserRoleType = {
  admin: { icon: 'tabler-crown', color: 'error' },
  manager: { icon: 'tabler-device-desktop', color: 'warning' },
  employee: { icon: 'tabler-edit', color: 'info' },
  sales: { icon: 'tabler-chart-pie', color: 'success' },
  'printing operator': { icon: 'tabler-user', color: 'primary' }
}

const userStatusObj: UserStatusType = {
  active: 'success',
  pending: 'warning',
  inactive: 'error'
}

// Column Definitions
const columnHelper = createColumnHelper<UsersTypeWithAction>()

import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux-store';
import { fetchUsers, deleteUser } from '@/redux-store/slices/user';
import data from '@/data/searchData'

const UserListTable = () => {
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
  // States
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const dispatch = useAppDispatch();
  const { users, total, page, pageSize, filters, search, loading, deletedUserData } = useSelector((state: any) => state.user);
  const { lang: locale } = useParams();
  console.log("users", users);
  const columns = useMemo<ColumnDef<UsersTypeWithAction, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      columnHelper.accessor('_id', {
        header: 'Avatar',
        cell: ({ row }) => (
          <CustomAvatar
            alt={row.original.firstName + ' ' + row.original.lastName}
            size={34}
          />
        )
      }),
      columnHelper.accessor('firstName', {
        header: 'First Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {/* {getAvatar({ avatar: row.original.avatar, firstName: row.original.firstName + ' ' + row.original.lastName })} */}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.firstName}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('lastName', {
        header: 'Last Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.lastName}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.email}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('role', {
        header: 'Role',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Icon
              className={userRoleObj[row.original.role].icon}
              sx={{ color: `var(--mui-palette-${userRoleObj[row.original.role].color}-main)` }}
            />
            <Typography className='capitalize' color='text.primary'>
              {row.original.role.toUpperCase()}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('isActive', {
        header: 'Status',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Chip
              variant='tonal'
              label={row.original.isActive ? 'Active' : 'Inactive'}
              size='small'
              color={row.original.isActive ? 'success' : 'error'}
              className='capitalize'
            />
          </div>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton onClick={() => dispatch(deleteUser(row.original._id))}>
              <i className='tabler-trash text-textSecondary' />
            </IconButton>
            <IconButton>
              <Link href={getLocalizedUrl('/apps/user/view', locale as Locale)} className='flex'>
                <i className='tabler-eye text-textSecondary' />
              </Link>
            </IconButton>
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={[
                {
                  text: 'Download',
                  icon: 'tabler-download',
                  menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
                },
                {
                  text: 'Edit',
                  icon: 'tabler-edit',
                  menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
                }
              ]}
            />
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [users]
  )

  // Redux-powered table
  const table = useReactTable({
    data: users as UsersType[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: pageSize
      }
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  // Redux-powered fetch on mount and when filters/search/page/pageSize change
  useEffect(() => {
    dispatch(fetchUsers({
      page,
      pageSize,
      search,
      filters
    }) as any);
  }, [dispatch, page, pageSize, search, filters, deletedUserData]);

  const handlePageChange = (_: any, newPage: number) => {
    dispatch(fetchUsers({
      page: newPage + 1,
      pageSize,
      search,
      filters
    }) as any);
  };
  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(fetchUsers({
      page: 1,
      pageSize: parseInt(event.target.value, 10),
      search,
      filters
    }) as any);
  };
  const handleDelete = (id: string) => {
    dispatch(deleteUser(id) as any);
  };

  const getAvatar = (params: Pick<UsersType, '_id' | 'firstName' | 'lastName'>) => {
    const { _id, firstName, lastName } = params

    if (_id) {
      return <CustomAvatar src={_id} size={34} />
    } else {
      return <CustomAvatar size={34}>{getInitials(firstName as string)}</CustomAvatar>
    }
  }

  return (
    <>
      <Card>
        <CardHeader title='Filters' className='pbe-4' />
        <TableFilters />
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          <CustomTextField
            select
            value={pageSize}
            onChange={handleRowsPerPageChange}
            className='max-sm:is-full sm:is-[70px]'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
          <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
            {/* Search input can be connected to Redux or TableFilters */}
            <Button
              color='secondary'
              variant='tonal'
              startIcon={<i className='tabler-upload' />}
              className='max-sm:is-full'
            >
              Export
            </Button>
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => setAddUserOpen(!addUserOpen)}
              className='max-sm:is-full'
            >
              Add New User
            </Button>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='tabler-chevron-up text-xl' />,
                              desc: <i className='tabler-chevron-down text-xl' />
                            }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {users?.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    {loading ? 'Loading...' : 'No data available'}
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {users?.map((user: any) => (
                  <tr key={user?.id || user?._id}>
                    <td>
                      <Checkbox />
                    </td>
                    <td>
                      {user?.avatar ? (
                        <CustomAvatar src={user.avatar} size={34} />
                      ) : (
                        <CustomAvatar size={34}>{getInitials(user?.fullName || user?.firstName || user?.lastName || user?.email)}</CustomAvatar>
                      )}
                    </td>
                    <td>{user?.firstName || `${user?.firstName ?? ''}`}</td>
                    <td>{user?.lastName || `${user?.lastName ?? ''}`}</td>
                    <td>{user?.email}</td>
                    <td>
                      <Chip
                        label={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
                        color={userRoleObj[user?.role]?.color || 'default'}
                        icon={<i className={userRoleObj[user?.role]?.icon || ''} />}
                        variant="tonal"
                        size="small"
                      />
                    </td>
                    <td>
                      <Chip
                        label={((user?.status || (user?.isActive ? 'active' : 'inactive'))?.charAt(0).toUpperCase() + (user?.status || (user?.isActive ? 'active' : 'inactive'))?.slice(1))}
                        color={userStatusObj[user?.status || (user?.isActive ? 'active' : 'inactive')] || 'default'}
                        size="small"
                      />
                    </td>
                    <td>
                      <IconButton>
                        <i className='tabler-edit text-textSecondary' />
                      </IconButton>
                      <IconButton onClick={() => { setDeleteDialogOpen(true); setUserIdToDelete(user._id); }}>
                        <i className='tabler-trash text-textSecondary' />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          count={total}
          rowsPerPage={pageSize}
          page={page - 1}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Card>
      {/* AddUserDrawer can be kept as is if needed */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => { if (userIdToDelete) { handleDelete(userIdToDelete); } setDeleteDialogOpen(false); }} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UserListTable
