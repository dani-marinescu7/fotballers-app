import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Toast = ({ message, severity }) => {
    const [open, setOpen] = useState(true);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={5000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <MuiAlert
                elevation={6}
                variant="filled"
                onClose={handleClose}
                severity={severity}
            >
                {message}
            </MuiAlert>
        </Snackbar>
    );
};

export default Toast;
