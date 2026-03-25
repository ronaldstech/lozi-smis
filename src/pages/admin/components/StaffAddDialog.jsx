import React, { useState } from 'react';
import {
    Button,
    Dialog,
    Box,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    InputAdornment,
    DialogContent,
    DialogTitle
} from '@mui/material';
import {
    CloseCircle,
    User,
    Call,
    AddCircle,
    TickCircle
} from 'iconsax-react';

import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import { API_URL } from '../../../config';

const StaffAddDialog = ({ open, onClose, onSave }) => {
    const [acc_type, setAcc_type] = useState("");

    const handleChange = (event) => {
        setAcc_type(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                body: formData
            });
            const data = await res.json();

            if (data.status) {
                Toastify({
                    text: data.message || "Success",
                    backgroundColor: "#10b981",
                    duration: 3000
                }).showToast();
                onSave();
                onClose();
                setAcc_type("");
            } else {
                Toastify({
                    text: data.message || "Failed to add staff",
                    backgroundColor: "#ef4444",
                    duration: 3000
                }).showToast();
            }
        } catch (err) {
            Toastify({
                text: "An error occurred. Please try again.",
                backgroundColor: "#ef4444",
                duration: 3000
            }).showToast();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '20px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }
            }}
        >
            {/* Header */}
            <DialogTitle sx={{
                m: 0,
                p: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Add New Staff
                </Typography>
                <IconButton onClick={onClose} sx={{ color: '#94a3b8' }}>
                    <CloseCircle size={24} />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ p: 4, pt: 1 }}>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                        Please fill in the details below to create a new staff account.
                    </Typography>

                    <TextField
                        label="Username"
                        name="username_add"
                        variant="outlined"
                        fullWidth
                        required
                        sx={{ mb: 3 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start" sx={{ ml: -0.5, mr: 1 }}><User size={18} color="#94a3b8" /></InputAdornment>
                        }}
                    />

                    <TextField
                        label="Phone Number"
                        name="phone_add"
                        variant="outlined"
                        fullWidth
                        required
                        sx={{ mb: 3 }}
                        placeholder="088-XXX-XXXX"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Call color="#94a3b8" size={18} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <InputLabel id="acc_type_label">Account Type</InputLabel>
                        <Select
                            labelId="acc_type_label"
                            name="acc_type_add"
                            value={acc_type}
                            label="Account Type"
                            onChange={handleChange}
                            required
                            startAdornment={
                                <InputAdornment position="start" sx={{ ml: -0.5, mr: 1 }}>
                                    <AddCircle size={18} color="#94a3b8" />
                                </InputAdornment>
                            }
                        >
                            <MenuItem value="teacher" sx={{ py: 1.5 }}>Teacher</MenuItem>
                            <MenuItem value="admin" sx={{ py: 1.5 }}>Admin</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Action Buttons */}
                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        mt: 2,
                        '& > button': { borderRadius: '12px', py: 1.5, textTransform: 'none', fontWeight: 600 }
                    }}>
                        <Button
                            onClick={onClose}
                            fullWidth
                            sx={{ color: '#64748b', bgcolor: '#f1f5f9', '&:hover': { bgcolor: '#e2e8f0' } }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            startIcon={<TickCircle size={20} variant="Bold" />}
                            sx={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                                }
                            }}
                        >
                            Save Member
                        </Button>
                    </Box>
                </DialogContent>
            </form>
        </Dialog>
    );
};

export default StaffAddDialog;