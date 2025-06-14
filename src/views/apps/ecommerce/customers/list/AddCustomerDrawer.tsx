// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid2 as Grid } from '@mui/material'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Type Imports
import type { Customer } from '@/types/apps/ecommerceTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { updateUser } from '@/redux-store/slices/user'
import { createCustomer, updateCustomer } from '@/redux-store/slices/customer'
import { useAppDispatch } from '@/redux-store'


type Props = {
  open: boolean
  handleClose: () => void
  setData: (data: Customer[]) => void
  customerData?: Customer | null
  editMode?: boolean
  initialCustomer?: Partial<Customer> | null
}

type FormValidateType = {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  address: string
  city: string
  gst_no: string
}

type countryType = {
  country: string
}

export const country: { [key: string]: countryType } = {
  india: { country: 'India' },
  australia: { country: 'Australia' },
  france: { country: 'France' },
  brazil: { country: 'Brazil' },
  us: { country: 'United States' },
  china: { country: 'China' }
}

// Vars
const initialData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  address: '',
  city: '',
  gst_no: '',
}

const AddCustomerDrawer = (props: Props) => {
  const { open, handleClose, setData, customerData = null, editMode = false, initialCustomer = null } = props;

  const {
    control,
    reset: resetForm,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormValidateType>({
    defaultValues: initialCustomer || initialData
  });

  // Prefill form on edit
  useEffect(() => {
    if (editMode && customerData) {
      resetForm(customerData as unknown as FormValidateType);
    } else {
      resetForm(initialData);
    }
  }, [editMode, customerData, resetForm, open]);

  const dispatch = useAppDispatch();

  const onSubmit = async (data: FormValidateType) => {
    if (editMode && customerData && customerData._id) {
      await dispatch(
        updateCustomer({
          id: customerData._id,
          customerData: {
            ...data
          }
        })
      ).then((res: any) => {
        if (res.meta.requestStatus === 'fulfilled') {
          handleClose();
          resetForm(initialData);
        }
      });
    } else {
      await dispatch(createCustomer({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        company: data.company,
        address: data.address,
        city: data.city,
        gst_no: data.gst_no,
      })).then((res: any) => {
        if (res.meta.requestStatus === 'fulfilled') {
          handleClose();
          resetForm(initialData);
        }
      });
    }
  };

  const handleReset = () => {
    handleClose();
    resetForm(initialData);
  };

  return (
    <Dialog
      open={open}
      onClose={handleReset}
      closeAfterTransition={false}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogTitle variant='h4' className='flex flex-col gap-2 text-center p-6 sm:pbs-16 sm:pbe-6 sm:pli-16'>
        {editMode ? 'Edit Customer' : 'Add New Customer'}
      </DialogTitle>
      <IconButton onClick={handleReset} size='small' style={{ position: 'absolute', right: 16, top: 16 }}>
        <i className='tabler-x' />
      </IconButton>
      <form onSubmit={handleSubmit(data => onSubmit(data))} className='flex flex-col gap-6 p-6'>
        <DialogContent className='overflow-visible pbs-0 p-6 sm:pli-16'>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, sm: 6 }}>
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
            <Grid size={{ xs: 12, sm: 6 }}>
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
            <Grid size={{ xs: 12, sm: 6 }}>
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='phone'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Phone'
                    type='number'
                    placeholder='+(123) 456-7890'
                    {...(errors.phone && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='address'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Address'
                    placeholder='45 Roker Terrace'
                    {...(errors.address && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='city'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='City'
                    placeholder='City'
                    {...(errors.city && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='company'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Company'
                    placeholder='Company'
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='gst_no'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Company GST No'
                    placeholder='Company GST No'
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 p-6 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' type='submit'>
            {editMode ? 'Update' : 'Add'}
          </Button>
          <Button variant='tonal' color='error' type='reset' onClick={handleReset}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddCustomerDrawer;
