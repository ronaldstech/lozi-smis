import React, { useState } from 'react';
import {
    Box, Button, Dialog, Typography, TextField, Paper, Avatar, Grid, IconButton,
    Stack, Divider, Container, CircularProgress, Fade, InputAdornment, Card, CardContent,
    Tooltip, useTheme, useMediaQuery
} from '@mui/material';
import {
    Edit2 as Edit,
    CloseCircle as Close,
    User as Person,
    Call as Phone,
    Sms as Email,
    TickCircle as Save,
    Key as VpnKey,
    Verify as VerifiedUser,
    InfoCircle as Info,
    Camera as PhotoCamera,
    Lock as LockIcon
} from 'iconsax-react';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import { useAppContext } from '../context/AppContext';

import { API_URL } from '../config';

export default function Profile() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user, setUser } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState({ user: false, phone: false, email: false, change: false });

    const handleUpdate = async (e, key) => {
        e.preventDefault();
        setLoading(true);
        const formData = new URLSearchParams(new FormData(e.target));

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });
            const data = await res.json();

            if (data.status) {
                Toastify({ text: "Information sync complete", backgroundColor: "#059669" }).showToast();
                const updates = {};
                if (formData.get('username_edit')) updates.username = formData.get('username_edit');
                if (formData.get('phone_edit')) updates.phone = formData.get('phone_edit');
                if (formData.get('email_edit')) updates.email = formData.get('email_edit');

                if (Object.keys(updates).length) {
                    const newUser = { ...user, ...updates };
                    setUser(newUser);
                    localStorage.setItem('user', JSON.stringify(newUser));
                }
                setOpen({ ...open, [key]: false });
            } else {
                Toastify({ text: data.message || "Sync failed", backgroundColor: "#dc2626" }).showToast();
            }
        } catch {
            Toastify({ text: "Connection error", backgroundColor: "#dc2626" }).showToast();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Fade in timeout={800}>
            <Box sx={{
                p: { xs: 0, md: 1 },
                minHeight: '100vh',
                bgcolor: '#f8fafc',
                pb: 10
            }}>
                {/* MODERN TOP BANNER */}
                <Box sx={{
                    height: 240,
                    background: 'linear-gradient(135deg, #385585ff 0%, #91bcf8ff 100%)',
                    position: 'relative',
                    mb: { xs: 15, md: 10 },
                    borderRadius: '14px',
                }}>
                    <Container maxWidth="lg" sx={{ height: '100%', position: 'relative' }}>
                        <Box sx={{
                            position: 'absolute',
                            bottom: { xs: -100, md: -60 },
                            left: { xs: '50%', md: 0 },
                            transform: { xs: 'translateX(-50%)', md: 'none' },
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            gap: 3,
                            width: '100%'
                        }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={`/images/profile.jpg`}
                                    sx={{ width: 150, height: 150 }}
                                />

                                <Tooltip title="Change Photo">
                                    <IconButton size="small" sx={{
                                        position: 'absolute', bottom: 10, right: 10,
                                        bgcolor: '#fff', boxShadow: 2, '&:hover': { bgcolor: '#f1f5f9' }
                                    }}>
                                        <PhotoCamera size={20} color="#6366f1" />
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            <Box sx={{ textAlign: { xs: 'center', md: 'left' }, pt: { md: 5 } }}>
                                <Typography variant="h4" fontWeight={900} color={isMobile ? "#0f172a" : "#fff"}>
                                    {user.username}
                                </Typography>
                                <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }} alignItems="center">
                                    <VerifiedUser size={16} color="#10b981" variant="Bold" />
                                    <Typography variant="body1" sx={{ color: isMobile ? "#64748b" : "#cbd5e1", fontWeight: 500 }}>
                                        {user.role || 'Staff Member'}
                                    </Typography>
                                </Stack>
                            </Box>
                        </Box>
                    </Container>
                </Box>

                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        {/* LEFT COLUMN: ACCOUNT OVERVIEW */}
                        <Grid item xs={12} md={8}>
                            <Typography variant="h6" fontWeight={800} gutterBottom sx={{ color: '#1e293b', mb: 3 }}>
                                Personal Information
                            </Typography>

                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: '14px',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    background: 'rgba(255, 255, 255, 0.6)',
                                    backdropFilter: 'blur(20px)',
                                    overflow: 'hidden'
                                }}
                            >
                                {[
                                    { label: 'Full Name', value: user.username, icon: <Person />, key: 'user' },
                                    { label: 'Mobile Contact', value: user.phone || 'None provided', icon: <Phone />, key: 'phone' },
                                    { label: 'Email Address', value: user.email, icon: <Email />, key: 'email' }
                                ].map((item, i) => (
                                    <Box key={item.key}>
                                        <Box sx={{
                                            p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            '&:hover': { bgcolor: '#f8fafc' }, transition: '0.2s'
                                        }}>
                                            <Stack direction="row" spacing={3} alignItems="center">
                                                <Box sx={{
                                                    p: 1.5, borderRadius: 2, bgcolor: '#eff6ff', color: '#3b82f6'
                                                }}>
                                                    {React.cloneElement(item.icon, { size: 24 })}
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
                                                        {item.label}
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight={700} color="#1e293b">
                                                        {item.value}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                            <Button
                                                onClick={() => setOpen({ ...open, [item.key]: true })}
                                                variant="text"
                                                sx={{ color: '#6366f1', fontWeight: 700, borderRadius: 2 }}
                                            >
                                                Update
                                            </Button>
                                        </Box>
                                        {i < 2 && <Divider sx={{ mx: 3 }} />}
                                    </Box>
                                ))}
                            </Paper>
                        </Grid>

                        {/* RIGHT COLUMN: SECURITY & ACTIONS */}
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" fontWeight={800} gutterBottom sx={{ color: '#1e293b', mb: 3 }}>
                                Security
                            </Typography>

                            <Card
                                elevation={0}
                                sx={{
                                    borderRadius: '14px',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    background: 'rgba(255, 255, 255, 0.6)',
                                    backdropFilter: 'blur(20px)'
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Stack spacing={3}>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                                                Password Management
                                            </Typography>
                                            <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
                                                Last updated: 3 months ago
                                            </Typography>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                disableElevation
                                                onClick={() => setOpen({ ...open, change: true })}
                                                sx={{ bgcolor: '#1e293b', py: 1.2, borderRadius: '14px', '&:hover': { bgcolor: '#000' } }}
                                                startIcon={<VpnKey />}
                                            >
                                                Change Password
                                            </Button>
                                        </Box>

                                        <Divider />

                                        <Box sx={{ p: 2, bgcolor: '#fff7ed', borderRadius: 1, border: '1px solid #fed7aa' }}>
                                            <Stack direction="row" spacing={1.5}>
                                                <Info color="#ea580c" size={20} />
                                                <Typography variant="caption" color="#9a3412" fontWeight={500}>
                                                    Keep your credentials private. We will never ask for your password via email or phone.
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>

                {/* DYNAMIC EDIT DIALOGS */}
                {Object.entries({
                    user: { label: 'Full Name', field: 'username_edit', val: user.username },
                    phone: { label: 'Phone Number', field: 'phone_edit', val: user.phone },
                    email: { label: 'Email Address', field: 'email_edit', val: user.email }
                }).map(([key, d]) => (
                    <Dialog
                        key={key}
                        open={open[key]}
                        onClose={() => !loading && setOpen({ ...open, [key]: false })}
                        PaperProps={{ sx: { borderRadius: 4, width: 400, p: 1 } }}
                    >
                        <Box p={3}>
                            <Typography variant="h6" fontWeight={900} mb={1}>Update {d.label}</Typography>
                            <Typography variant="body2" color="#64748b" mb={3}>Please ensure the information is correct.</Typography>

                            <form onSubmit={(e) => handleUpdate(e, key)}>
                                <input type="hidden" name="user_id" value={user.id} />
                                <TextField
                                    fullWidth label={d.label} name={d.field}
                                    defaultValue={d.val} disabled={loading}
                                    sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                />
                                <Button
                                    type="submit" fullWidth variant="contained"
                                    disabled={loading} sx={{ py: 1.5, borderRadius: 3, bgcolor: '#6366f1' }}
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save variant="Bold" size={20} />}
                                >
                                    Confirm Update
                                </Button>
                            </form>
                        </Box>
                    </Dialog>
                ))}

                {/* PASSWORD CHANGE DIALOG */}
                <Dialog
                    open={open.change}
                    onClose={() => !loading && setOpen({ ...open, change: false })}
                    fullWidth
                    maxWidth="xs"
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            overflow: 'hidden'
                        }
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            px: 3,
                            py: 2.5,
                            bgcolor: '#fef2f2',
                            borderBottom: '1px solid #fee2e2',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5
                        }}
                    >
                        <Box
                            sx={{
                                p: 1,
                                borderRadius: 2,
                                bgcolor: '#fee2e2',
                                color: '#ef4444'
                            }}
                        >
                            <VpnKey size={20} variant="Bold" color="#ef4444" />
                        </Box>

                        <Box>
                            <Typography variant="h6" fontWeight={900} color="#7f1d1d">
                                Security Update
                            </Typography>
                            <Typography variant="caption" color="#991b1b">
                                Change your account password
                            </Typography>
                        </Box>
                    </Box>

                    {/* Body */}
                    <Box p={3}>
                        <Typography
                            variant="body2"
                            color="#64748b"
                            mb={3}
                            sx={{ lineHeight: 1.6 }}
                        >
                            Enter your current password and choose a strong new password to
                            keep your account secure.
                        </Typography>

                        <form onSubmit={(e) => handleUpdate(e, 'change')}>
                            <input type="hidden" name="user_id" value={user.id} />

                            <Stack spacing={2.5}>
                                <TextField
                                    type="password"
                                    label="Current Password"
                                    name="current_password"
                                    required
                                    fullWidth
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon color="#94a3b8" size={20} />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                />

                                <TextField
                                    type="password"
                                    label="New Password"
                                    name="new_password"
                                    required
                                    fullWidth
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon color="#94a3b8" size={20} />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                />

                                <TextField
                                    type="password"
                                    label="Confirm New Password"
                                    name="confirm_password"
                                    required
                                    fullWidth
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon color="#94a3b8" size={20} />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="error"
                                    disabled={loading}
                                    startIcon={
                                        loading
                                            ? <CircularProgress size={20} color="inherit" />
                                            : <VpnKey variant="Bold" size={20} color="#fff" />
                                    }
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 3,
                                        fontWeight: 800,
                                        mt: 1,
                                        boxShadow: '0 10px 20px -5px rgba(239,68,68,0.35)',
                                        '&:hover': {
                                            boxShadow: '0 14px 25px -5px rgba(239,68,68,0.45)'
                                        }
                                    }}
                                >
                                    {loading ? 'Updating Password...' : 'Update Password'}
                                </Button>
                            </Stack>
                        </form>

                        {/* Footer note */}
                        <Box
                            mt={3}
                            sx={{
                                p: 2,
                                bgcolor: '#fff7ed',
                                borderRadius: 3,
                                border: '1px solid #fed7aa'
                            }}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                <Info color="#ea580c" size={16} style={{ marginTop: 2 }} />
                                <Typography variant="caption" color="#9a3412" fontWeight={600}>
                                    For your safety, never reuse passwords from other platforms.
                                </Typography>
                            </Stack>
                        </Box>
                    </Box>
                </Dialog>

            </Box>
        </Fade>
    );
}