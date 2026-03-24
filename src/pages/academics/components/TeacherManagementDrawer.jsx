import React, { useState } from 'react';
import {
    Drawer, Box, Stack, Typography, IconButton, Paper, Button, Menu, MenuItem, Chip, LinearProgress
} from '@mui/material';
import {
    Close as CloseIcon, AddCircle as AddIcon, ArrowDropDown as ArrowDropDownIcon, Delete as DeleteIcon
} from '@mui/icons-material';

// Helper for Form Colors
const getFormColor = (form) => {
    const colors = { 1: '#6366f1', 2: '#10b981', 3: '#f59e0b', 4: '#ef4444' };
    return colors[form] || '#64748b';
};

function TeacherManagementDrawer({ open, onClose, teacher, subjects, loading, onDelete, onAssignNew }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const formMenuOpen = Boolean(anchorEl);

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { width: { xs: '100%', sm: 500 }, borderLeft: 'none' } }}
        >
            <Box sx={{ h: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 3, bgcolor: '#6284bdff', color: '#fff' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="h6" fontWeight={800}>Teacher Dashboard</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>Assigning to {teacher.username}</Typography>
                        </Box>
                        <IconButton onClick={onClose} sx={{ color: '#fff' }}><CloseIcon /></IconButton>
                    </Stack>
                </Box>

                <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto', bgcolor: '#f8fafc' }}>
                    <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 1, border: '1px solid #e2e8f0' }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AddIcon sx={{ fontSize: 18 }} /> Quick Assignment
                        </Typography>
                        <Button
                            fullWidth
                            variant="contained"
                            endIcon={<ArrowDropDownIcon />}
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            sx={{
                                py: 1.5, borderRadius: 1, textTransform: 'none', fontWeight: 700,
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                            }}
                        >
                            Select Form Level
                        </Button>
                    </Paper>

                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: '#475569' }}>
                        Current Load ({Array.isArray(subjects) ? subjects.length : 0})
                    </Typography>

                    {loading ? (
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress sx={{ borderRadius: 1 }} />
                        </Box>
                    ) : (
                        <Stack spacing={1}>
                            {Array.isArray(subjects) && subjects.map((row, index) => (
                                <Paper key={index} sx={{ p: 1.5, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e2e8f0' }}>
                                    <Box>
                                        <Typography variant="body2" fontWeight={700}>{row.subject_data?.name}</Typography>
                                        <Chip
                                            label={`Form ${row.form}`}
                                            size="small"
                                            sx={{ height: 18, fontSize: '0.6rem', mt: 0.5, bgcolor: getFormColor(row.form), color: '#fff' }}
                                        />
                                    </Box>
                                    <IconButton size="small" color="error" onClick={() => onDelete(row.id)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Paper>
                            ))}
                            {(!Array.isArray(subjects) || subjects.length === 0) && (
                                <Box sx={{ textAlign: 'center', py: 5 }}>
                                    <Typography variant="body2" color="textSecondary">No subjects assigned.</Typography>
                                </Box>
                            )}
                        </Stack>
                    )}
                </Box>
            </Box>

            <Menu anchorEl={anchorEl} open={formMenuOpen} onClose={() => setAnchorEl(null)}>
                {[1, 2, 3, 4].map((f) => (
                    <MenuItem key={f} onClick={() => {
                        setAnchorEl(null);
                        onAssignNew(f);
                    }}>
                        Form {f}
                    </MenuItem>
                ))}
            </Menu>
        </Drawer>
    );
}

export default TeacherManagementDrawer;
