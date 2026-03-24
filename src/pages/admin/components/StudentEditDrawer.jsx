import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
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
    InputAdornment,
    Chip
} from '@mui/material';
import {
    Close as CloseIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    Transgender as GenderIcon,
    Save as SaveIcon,
    CloudUpload as UploadIcon,
    Badge as BadgeIcon
} from '@mui/icons-material';

const StudentEditDrawer = ({ open, onClose, activeStudent, onUpdate, onActivate }) => {
    const { schoolType } = useAppContext();
    const [localActive, setLocalActive] = useState({});

    useEffect(() => {
        setLocalActive(activeStudent || {});
    }, [activeStudent]);

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
                    Student Profile
                </Typography>
                <IconButton onClick={onClose} size="small" sx={{ bgcolor: '#f8fafc' }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Profile Hero Section */}
            <Box sx={{
                p: 4,
                textAlign: 'center',
                background: 'linear-gradient(to bottom, #f8fafc, #ffffff)',
                position: 'relative'
            }}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar
                        src={"images/pro_file.jpg"}
                        sx={{
                            width: 100,
                            height: 100,
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
                    {localActive.first} {localActive.last}
                </Typography>
                <Chip
                    label={localActive.student_reg || 'NO REG'}
                    size="small"
                    sx={{
                        mt: 1,
                        fontWeight: 600,
                        bgcolor: '#f1f5f9',
                        color: '#64748b'
                    }}
                />
            </Box>

            <Divider />

            <form onSubmit={onUpdate} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 4, flexGrow: 1 }}>
                    <input type="hidden" name="student_id" value={localActive.id || ''} />
                    <input type="hidden" name="editStudent" value="true" />

                    <Stack spacing={3}>
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <PersonIcon sx={{ color: '#6366f1', fontSize: 20 }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569' }}>
                                    Personal Details
                                </Typography>
                            </Stack>

                            <TextField
                                label="First Name"
                                name="first"
                                value={localActive.first || ''}
                                onChange={e => { setLocalActive({ ...localActive, first: e.target.value }) }}
                                variant="outlined"
                                size="small"
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Middle Name"
                                name="middle"
                                value={localActive.middle || ''}
                                onChange={e => { setLocalActive({ ...localActive, middle: e.target.value }) }}
                                variant="outlined"
                                size="small"
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Last Name"
                                name="last"
                                value={localActive.last || ''}
                                onChange={e => { setLocalActive({ ...localActive, last: e.target.value }) }}
                                variant="outlined"
                                size="small"
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                        </Box>

                        <Box>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <SchoolIcon sx={{ color: '#6366f1', fontSize: 20 }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569' }}>
                                    Academic Info
                                </Typography>
                            </Stack>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="form_edit">Form</InputLabel>
                                <Select
                                    labelId="form_edit"
                                    name="form"
                                    value={localActive.form || ''}
                                    label="Form"
                                    onChange={e => { setLocalActive({ ...localActive, form: e.target.value }) }}
                                    size="small"
                                >
                                    <MenuItem value={1}>Form 1</MenuItem>
                                    <MenuItem value={2}>Form 2</MenuItem>
                                    <MenuItem value={3}>Form 3</MenuItem>
                                    <MenuItem value={4}>Form 4</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                label="School Type"
                                name="school"
                                value={(localActive.school || schoolType).toUpperCase()}
                                variant="outlined"
                                size="small"
                                fullWidth
                                disabled
                                sx={{ mb: 2 }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><SchoolIcon fontSize="small" /></InputAdornment>,
                                }}
                            />
                            <input type="hidden" name="school" value={localActive.school || schoolType} />

                            <TextField
                                label="Registration No."
                                name="student_reg"
                                value={localActive.student_reg || ''}
                                onChange={e => { setLocalActive({ ...localActive, student_reg: e.target.value }) }}
                                variant="outlined"
                                size="small"
                                fullWidth
                                sx={{ mb: 2 }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><BadgeIcon fontSize="small" /></InputAdornment>,
                                }}
                            />
                        </Box>

                        <Box>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <GenderIcon sx={{ color: '#6366f1', fontSize: 20 }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569' }}>
                                    Other
                                </Typography>
                            </Stack>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="gender_edit">Gender</InputLabel>
                                <Select
                                    labelId="gender_edit"
                                    name="gender"
                                    value={localActive.gender || ''}
                                    label="Gender"
                                    onChange={e => { setLocalActive({ ...localActive, gender: e.target.value }) }}
                                    size="small"
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
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
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Student Status</Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        Mark as active or inactive
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

export default StudentEditDrawer;
