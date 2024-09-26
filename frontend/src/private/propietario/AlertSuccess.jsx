import React from 'react'
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
const AlertSuccess = ({status}) => {
    {
        status == "success" && 
        <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity="success">
              <AlertTitle>Success</AlertTitle>
              Producto registrado con éxito.
            </Alert>
        </Stack>
    }
}

export default AlertSuccess