import React, { useState, useEffect } from 'react';
import {
    Button,
    Box,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Drawer,
    Switch,
    Avatar,
    IconButton,
    Divider,
    Stack,
    Chip,
    InputAdornment
} from '@mui/material';
import {
    Close as CloseIcon,
    Person as PersonIcon,
    Phone as PhoneIcon,
    Security as SecurityIcon,
    Save as SaveIcon,
    CloudUpload as UploadIcon
} from '@mui/icons-material';

const StaffEditDrawer = ({ open, onClose, activeStaff, onUpdate, onActivate }) => {
    const [localActive, setLocalActive] = useState({});

    useEffect(() => {
        setLocalActive(activeStaff || {});
    }, [activeStaff]);

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 450 },
                    borderLeft: 'none',
                    boxShadow: '-10px 0 30px rgba(0,0,0,0.05)'
                }
            }}
        >
            {/* Header */}
            <Box sx={{
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #f1f5f9'
            }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Staff Profile
                </Typography>
                <IconButton onClick={onClose} size="small" sx={{ bgcolor: '#f8fafc' }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Profile Hero Section */}
            <Box sx={{
                p: 2,
                textAlign: 'center',
                background: 'linear-gradient(to bottom, #f8fafc, #ffffff)',
                position: 'relative'
            }}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar
                        src={localActive.profile_pic || "images/profile.jpg"}
                        sx={{
                            width: 120,
                            height: 120,
                            mx: 'auto',
                            mb: 2,
                            border: '4px solid #fff',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                        }}
                    />
                    <IconButton
                        size="small"
                        sx={{
                            position: 'absolute',
                            bottom: 15,
                            right: 0,
                            bgcolor: '#6366f1',
                            color: '#fff',
                            '&:hover': { bgcolor: '#4f46e5' }
                        }}
                    >
                        <UploadIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {localActive.username || 'Loading...'}
                </Typography>
                <Chip
                    label={localActive.acc_type?.toUpperCase()}
                    size="small"
                    sx={{
                        mt: 1,
                        fontWeight: 600,
                        bgcolor: localActive.acc_type === 'admin' ? '#eef2ff' : '#f1f5f9',
                        color: localActive.acc_type === 'admin' ? '#4f46e5' : '#475569'
                    }}
                />
            </Box>

            <Divider />

            <form onSubmit={onUpdate} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 4, flexGrow: 1 }}>
                    <input type="hidden" name="staff_id_edit" value={localActive.id || ''} />

                    {/* Personal Details Section */}
                    <Stack spacing={3}>
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <PersonIcon sx={{ color: '#6366f1', fontSize: 20 }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569' }}>
                                    Basic Information
                                </Typography>
                            </Stack>

                            <TextField
                                label="Username"
                                name="username_edit"
                                fullWidth
                                value={localActive.username || ''}
                                onChange={e => setLocalActive({ ...localActive, username: e.target.value })}
                                sx={{ mb: 2.5 }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">@</InputAdornment>,
                                }}
                            />

                            <TextField
                                label="Phone Number"
                                name="phone_edit"
                                fullWidth
                                value={localActive.phone || ''}
                                onChange={e => setLocalActive({ ...localActive, phone: e.target.value })}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><PhoneIcon fontSize="small" /></InputAdornment>,
                                }}
                            />
                        </Box>

                        <Box>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <SecurityIcon sx={{ color: '#6366f1', fontSize: 20 }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569' }}>
                                    Access Control
                                </Typography>
                            </Stack>

                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Account Type</InputLabel>
                                <Select
                                    name="acc_type_edit"
                                    value={localActive.acc_type || ''}
                                    label="Account Type"
                                    onChange={e => setLocalActive({ ...localActive, acc_type: e.target.value })}
                                >
                                    <MenuItem value="teacher">Teacher</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Status Switcher Card */}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                p: 2,
                                borderRadius: 3,
                                border: '1px solid #f1f5f9',
                                bgcolor: '#f8fafc'
                            }}>
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Account Access</Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        Enable or disable staff login permissions
                                    </Typography>
                                </Box>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Typography variant="caption" sx={{
                                        fontWeight: 700,
                                        color: localActive.status === 'active' ? '#10b981' : '#f43f5e'
                                    }}>
                                        {localActive.status?.toUpperCase()}
                                    </Typography>
                                    <Switch
                                        checked={localActive.status === "active"}
                                        onChange={e => {
                                            const newStatus = e.target.checked ? "active" : "inactive";
                                            setLocalActive({ ...localActive, status: newStatus });
                                            onActivate(localActive.id, newStatus);
                                        }}
                                        color="success"
                                    />
                                </Stack>
                            </Box>
                        </Box>
                    </Stack>
                </Box>

                {/* Footer Actions */}
                <Box sx={{ p: 3, bgcolor: '#fff', borderTop: '1px solid #f1f5f9' }}>
                    <Stack direction="row" spacing={2}>
                        <Button
                            onClick={onClose}
                            fullWidth
                            variant="outlined"
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, color: '#64748b', borderColor: '#e2e8f0' }}
                        >
                            Discard
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            startIcon={<SaveIcon />}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                            }}
                        >
                            Save Changes
                        </Button>
                    </Stack>
                </Box>
            </form>
        </Drawer>
    );
};

export default StaffEditDrawer;