import React, { useState } from 'react';
import {
    Dialog, Box, Typography, MenuItem, FormControlLabel, Checkbox,
    Button, TextField, InputAdornment, IconButton, Fade, Divider
} from '@mui/material';
import {
    Search as SearchIcon,
    Close as CloseIcon,
    MenuBook as BookIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

function AssignSubjectDialog({ open, onClose, form, subjects, onSelect, onSave }) {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter subjects based on search
    const filteredSubjects = (Array.isArray(subjects) ? subjects : []).filter(sub =>
        sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={Fade}
            transitionDuration={400}
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    width: 420,
                    maxHeight: '80vh',
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
                }
            }}
        >
            {/* Header */}
            <Box sx={{ p: 3, pb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', lineHeight: 1.2 }}>
                            Assign Form {form}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                            Choose subjects for this teacher's workload
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose} size="small" sx={{ color: '#94a3b8' }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                {/* Search Bar */}
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search subjects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: 20, color: '#94a3b8' }} />
                            </InputAdornment>
                        ),
                        sx: {
                            borderRadius: 2,
                            bgcolor: '#f8fafc',
                            '& fieldset': { borderColor: '#e2e8f0' },
                        }
                    }}
                />
            </Box>

            <Divider />

            {/* Subject List */}
            <Box sx={{ p: 1, maxHeight: 350, overflowY: 'auto', bgcolor: '#fff' }}>
                {filteredSubjects.length > 0 ? (
                    filteredSubjects.map((row, index) => (
                        <MenuItem
                            key={index}
                            sx={{
                                borderRadius: 2,
                                mx: 1,
                                mb: 0.5,
                                py: 1,
                                transition: 'all 0.2s',
                                '&:hover': { bgcolor: '#f1f5f9' },
                                // Target the checkbox state for a container glow
                                '&:has(input:checked)': {
                                    bgcolor: '#f0f7ff',
                                    border: '1px solid #dbeafe'
                                },
                                border: '1px solid transparent'
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={() => onSelect(row)}
                                        size="small"
                                        checkedIcon={<CheckCircleIcon />}
                                        sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#6366f1' } }}
                                    />
                                }
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <BookIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                                            {row.name}
                                        </Typography>
                                    </Box>
                                }
                                sx={{ width: '100%', m: 0 }}
                            />
                        </MenuItem>
                    ))
                ) : (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                            No subjects found matching "{searchQuery}"
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Footer */}
            <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={onSave}
                    sx={{
                        borderRadius: 2.5,
                        py: 1.4,
                        fontWeight: 700,
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        bgcolor: '#1e293b',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        '&:hover': { bgcolor: '#0f172a', boxShadow: 'none' }
                    }}
                >
                    Confirm Selection
                </Button>
            </Box>
        </Dialog>
    );
}

export default AssignSubjectDialog;