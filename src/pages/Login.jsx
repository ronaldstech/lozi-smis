import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    Checkbox,
    FormControlLabel,
    Link,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

import { API_URL } from '../config';

function Login() {
    const navigate = useNavigate();
    const { login, isAuthenticated, user } = useAppContext();

    useEffect(() => {
        if (isAuthenticated) {
            // Check for admin/staff role mapping
            // Note: isAdmin is from the login payload. If persisted user state doesn't have it, we check structure.
            // Adjust this logic to match your strict role requirements.
            const isAdmin = user?.isAdmin || user?.role === 'admin';
            navigate(isAdmin ? "/" : "/portal/staff");
        }
    }, [isAuthenticated, user, navigate]);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("password", password);

            const response = await fetch(API_URL, {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (!data.status) {
                setError(data.message || "Login failed");
                setLoading(false);
                return;
            }

            // Save user in global context
            login({
                id: data.user.id,
                username: data.user.username,
                role: data.user.acc_type,
                isAdmin: data.admin
            });

            // Redirect
            navigate(data.admin ? "/" : "/portal/staff");

        } catch (err) {
            setError("Unable to connect to server");
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
                background:
                    'radial-gradient(circle at 10% 20%, rgba(102,126,234,0.1), transparent 40%), radial-gradient(circle at 90% 80%, rgba(255,117,140,0.1), transparent 40%), #f8f9fa'
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    maxWidth: 420,
                    p: { xs: 3, sm: 5 },
                    borderRadius: '24px',
                    background: 'rgba(255,255,255,0.75)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.3)'
                }}
            >
                <Box textAlign="center" mb={4}>
                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '16px',
                            mx: 'auto',
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background:
                                'linear-gradient(135deg, #667eea, #764ba2)'
                        }}
                    >
                        <LockIcon sx={{ color: '#fff', fontSize: 28 }} />
                    </Box>

                    <Typography variant="h5" fontWeight={800}>
                        Hello, Staff Login
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Access your dashboard
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: '12px' }
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: { borderRadius: '12px' }
                        }}
                    />

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mt: 1,
                            mb: 3
                        }}
                    >
                        <FormControlLabel
                            control={<Checkbox />}
                            label="Remember me"
                        />
                        <Link variant="body2">Forgot password?</Link>
                    </Box>

                    <Button
                        type="submit"
                        fullWidth
                        disabled={loading}
                        sx={{
                            py: 1.5,
                            borderRadius: '12px',
                            fontWeight: 700,
                            color: '#fff',
                            background:
                                'linear-gradient(135deg, #667eea, #764ba2)'
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} sx={{ color: '#fff' }} />
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </form>

                <Box textAlign="center" mt={3}>
                    <Typography variant="body2" color="text.secondary">
                        No account? <Link fontWeight={700}>Contact admin</Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}

export default Login;
