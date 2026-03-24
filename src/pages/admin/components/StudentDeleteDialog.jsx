import React from 'react';
import {
    Button,
    Dialog,
    Box,
    Typography,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton
} from '@mui/material';
import { Close as CloseIcon, Warning as WarningIcon } from '@mui/icons-material';

const StudentDeleteDialog = ({ open, onClose, onConfirm, studentName }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: { borderRadius: '20px', p: 1 }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Typography variant="h6" fontWeight={700}>Confirm Delete</Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: '#fee2e2',
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                }}>
                    <WarningIcon fontSize="large" />
                </Box>
                <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 600, mb: 1 }}>
                    Are you sure you want to delete <br />
                    <span style={{ color: '#ef4444' }}>{studentName}</span>?
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                    This action cannot be undone. All data associated with this student will be removed.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'center', gap: 2 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{ borderRadius: 2, textTransform: 'none', color: '#64748b', borderColor: '#e2e8f0', width: '50%' }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="error"
                    sx={{ borderRadius: 2, textTransform: 'none', width: '50%', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}
                >
                    Delete Student
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StudentDeleteDialog;
