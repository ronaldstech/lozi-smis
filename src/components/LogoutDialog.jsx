import React, { useState } from 'react';
import {
    Dialog,
    Box,
    Typography,
    Button
} from '@mui/material';

function LogoutDialog({ onClose }) {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
        if (onClose) onClose();
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <Box sx={{ width: "400px" }}>
                    <div className="w3-padding w3-border-bottom">
                        <Typography>Log Out</Typography>
                    </div>
                    <div className="w3-padding">
                        <center><Typography>Are you sure you want to log out?</Typography></center>
                    </div>
                    <div className="w3-padding">
                        <center>
                            <Button variant="contained" color="error" onClick={() => window.location.href = "logout.php"}>Yes</Button>
                            <Button variant="contained" sx={{ ml: 1 }} color="primary" onClick={handleClose}>No</Button>
                        </center>
                    </div>
                </Box>
            </Dialog>
        </div>
    );
}

export default LogoutDialog;
