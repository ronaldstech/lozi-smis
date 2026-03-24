import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import {
    Button,
    Drawer,
    Box,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    InputAdornment,
    Stack,
    Divider
} from '@mui/material';
import {
    Close as CloseIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    Transgender as GenderIcon,
    Save as SaveIcon,
    AddCircleOutline as AddIcon
} from '@mui/icons-material';

const StudentAddDialog = ({ open, onClose, onSave }) => {
    const { schoolType } = useAppContext();
    const [form, setForm] = useState("");
    const [gender, setGender] = useState("");

    const handleFormChange = (event) => {
        setForm(event.target.value);
    };

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    const handleSubmit = (e) => {
        onSave(e);
        setForm("");
        setGender("");
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 450 },
                    borderRadius: { xs: 0, sm: '24px 0 0 24px' },
                    boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
                    border: 'none',
                    bgcolor: '#fff'
                }
            }}
        >
            <Box
                component="form"
                id="student-add-form"
                onSubmit={handleSubmit}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflowY: 'auto'
                }}
            >
                {/* Drawer Header */}
                <Box sx={{
                    p: 4,
                    pb: 3,
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, transparent 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '16px',
                            bgcolor: '#6366f1',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)'
                        }}>
                            <AddIcon />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', lineHeight: 1.2 }}>
                                Add Student
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                                Enroll a new student to {schoolType.toUpperCase()} portal
                            </Typography>
                        </Box>
                    </Stack>
                    <IconButton
                        onClick={onClose}
                        sx={{
                            bgcolor: '#f1f5f9',
                            '&:hover': { bgcolor: '#fee2e2', color: '#ef4444' },
                            transition: 'all 0.2s'
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Divider sx={{ mx: 4, opacity: 0.6 }} />

                {/* Form Body */}
                <Box
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3.5
                    }}
                >
                    <Box>
                        <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 800, letterSpacing: 1 }}>
                            Personal Information
                        </Typography>
                        <Stack spacing={2.5} sx={{ mt: 2 }}>
                            <TextField
                                label="First Name"
                                name="fname_add"
                                fullWidth
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>
                                }}
                            />
                            <TextField
                                label="Middle Name"
                                name="mname_add"
                                fullWidth
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>
                                }}
                            />
                            <TextField
                                label="Last Name"
                                name="lname_add"
                                fullWidth
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>
                                }}
                            />
                        </Stack>
                    </Box>

                    <Box>
                        <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 800, letterSpacing: 1 }}>
                            Registration Details
                        </Typography>
                        <Stack spacing={2.5} sx={{ mt: 2 }}>
                            <TextField
                                label="School Type"
                                name="school"
                                value={schoolType.toUpperCase()}
                                fullWidth
                                disabled
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><SchoolIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>
                                }}
                            />
                            <input type="hidden" name="school" value={schoolType} />

                            <FormControl fullWidth>
                                <InputLabel id="form">Form</InputLabel>
                                <Select
                                    labelId="form_add"
                                    name="form_add"
                                    value={form}
                                    label="Form"
                                    onChange={handleFormChange}
                                    required
                                    sx={{ borderRadius: 3 }}
                                    startAdornment={<InputAdornment position="start" sx={{ ml: -0.5, mr: 1 }}><SchoolIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>}
                                >
                                    <MenuItem value={1}>Form 1</MenuItem>
                                    <MenuItem value={2}>Form 2</MenuItem>
                                    <MenuItem value={3}>Form 3</MenuItem>
                                    <MenuItem value={4}>Form 4</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel id="gender">Gender</InputLabel>
                                <Select
                                    labelId="gender_add"
                                    name="gender_add"
                                    value={gender}
                                    label="Gender"
                                    onChange={handleGenderChange}
                                    required
                                    sx={{ borderRadius: 3 }}
                                    startAdornment={<InputAdornment position="start" sx={{ ml: -0.5, mr: 1 }}><GenderIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>}
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    </Box>
                </Box>

                {/* Footer Actions */}
                <Box sx={{
                    p: 4,
                    mt: 'auto',
                    bgcolor: '#f8fafc',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    gap: 2
                }}>
                    <Button
                        onClick={onClose}
                        fullWidth
                        sx={{
                            color: '#64748b',
                            bgcolor: '#fff',
                            border: '1px solid #e2e8f0',
                            '&:hover': { bgcolor: '#f1f5f9' },
                            textTransform: 'none',
                            borderRadius: 3,
                            py: 1.5,
                            fontWeight: 700
                        }}
                    >
                        Discard
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        startIcon={<SaveIcon />}
                        sx={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)',
                            textTransform: 'none',
                            borderRadius: 3,
                            py: 1.5,
                            fontWeight: 700,
                            '&:hover': {
                                boxShadow: '0 12px 25px rgba(79, 70, 229, 0.4)',
                                transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.2s'
                        }}
                    >
                        Save Student
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
};

export default StudentAddDialog;
