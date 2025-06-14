// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { useAppDispatch } from '@/redux-store';
import { useSelector } from 'react-redux';
import { createUser, updateUser } from '@/redux-store/slices/user';

// Types Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid2 as Grid } from '@mui/material'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

type Props = {
  open: boolean
  handleClose: () => void
  editMode?: boolean
  userData?: Partial<UsersType> | null
}

type FormValidateType = {
  firstName: string
  lastName: string
  email: string
  role: 'admin' | 'manager' | 'employee' | 'sales' | 'printing operator'
  password: string
  isActive: boolean
}

type FormNonValidateType = {
  company: string
  country: string
  contact: string
}

// Vars
const initialData = {
  company: '',
  country: '',
  contact: ''
}

const AddUserDrawer = (props: Props) => {
  // Props
  const { open, handleClose, editMode = false, userData = null } = props;

  // States
  const [formData, setFormData] = useState<FormNonValidateType>(initialData);
  const dispatch = useAppDispatch();
  const loading = useSelector((state: any) => state.user.loading);

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormValidateType>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'employee',
      password: '',
      isActive: true
    }
  });

  // Prefill form on edit
  useEffect(() => {
    if (editMode && userData) {
      resetForm({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        role: userData.role || 'employee',
        password: '', // Do not prefill password for security
        isActive: userData.isActive ?? true
      });
    } else {
      resetForm({ firstName: '', lastName: '', email: '', role: 'employee', password: '', isActive: true });
    }
  }, [editMode, userData, resetForm, open]);

  const onSubmit = async (data: FormValidateType) => {
    if (editMode && userData && userData._id) {
      await dispatch(
        updateUser({
          id: userData._id,
          userData: {
            ...data,
            // Don't send password if blank in edit mode
            ...(data.password ? { password: data.password } : {})
          }
        })
      ).then((res: any) => {
        if (res.meta.requestStatus === 'fulfilled') {
          handleClose();
          setFormData(initialData);
          resetForm({ firstName: '', lastName: '', email: '', role: 'employee', password: '', isActive: true });
        }
      });
    } else {
      await dispatch(createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        password: data.password,
        isActive: data.isActive,
      })).then((res: any) => {
        if (res.meta.requestStatus === 'fulfilled') {
          handleClose();
          setFormData(initialData);
          resetForm({ firstName: '', lastName: '', email: '', role: 'employee', password: '', isActive: true });
        }
      });
    }
  };


  const handleReset = () => {
    handleClose()
    setFormData(initialData)
  }

  return (
    <Dialog
      open={open}
      onClose={handleReset}
      closeAfterTransition={false}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogTitle variant='h4' className='flex flex-col gap-2 text-center p-6 sm:pbs-16 sm:pbe-6 sm:pli-16'>
        {editMode ? 'Edit User' : 'Add New User'}
      </DialogTitle>
      <DialogCloseButton onClick={() => handleReset()} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <form onSubmit={handleSubmit(data => onSubmit(data))} className='flex flex-col gap-6 p-6'>
        <DialogContent className='overflow-visible pbs-0 p-6 sm:pli-16'>
          <Grid container spacing={6}>
            <Grid size={{ xs: 6 }}>
              <Controller
                name='firstName'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='First Name'
                    placeholder='John'
                    {...(errors.firstName && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name='lastName'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Last Name'
                    placeholder='Doe'
                    {...(errors.lastName && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='email'
                    label='Email'
                    placeholder='johndoe@gmail.com'
                    {...(errors.email && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name='role'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    id='select-role'
                    label='Select Role'
                    {...field}
                    {...(errors.role && { error: true, helperText: 'This field is required.' })}
                  >
                    <MenuItem value='admin'>Admin</MenuItem>
                    <MenuItem value='manager'>Manager</MenuItem>
                    <MenuItem value='employee'>Employee</MenuItem>
                    <MenuItem value='sales'>Sales</MenuItem>
                    <MenuItem value='printing operator'>Printing Operator</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Password'
                    type='password'
                    {...field}
                    {...(errors.password && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name='isActive'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    id='select-status'
                    label='Select Status'
                    {...field}
                    {...(errors.isActive && { error: true, helperText: 'This field is required.' })}
                  >
                    <MenuItem value='true'>Active</MenuItem>
                    <MenuItem value='false'>Inactive</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 p-6 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' type='submit'>
            {editMode ? 'Update' : 'Submit'}
          </Button>
          <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddUserDrawer
