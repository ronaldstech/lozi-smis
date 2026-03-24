import React, { useState, useEffect, useContext } from 'react';
import {
    Button,
    Dialog,
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Drawer,
    Switch,
    Paper,
    TableContainer,
    IconButton,
    Chip,
    Stack,
    LinearProgress,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Close as CloseIcon,
    Save as SaveIcon
} from '@mui/icons-material';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import { AppContext } from '../../context/AppContext';

import { API_URL } from '../../config';

function Grading() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = useState({
        add: false,
        edit: false
    });
    const { academic } = useContext(AppContext);
    const [grades, setGrades] = useState([]);
    const [seletype, setSeletype] = useState('senior');
    const [edit, setEdit] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch grades
    const getRowGrades = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}?getRowGrades=true`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setGrades(data);
            } else {
                console.error("Invalid response format", data);
            }
        } catch (error) {
            console.error("Error fetching grades:", error);
            Toastify({ text: "Failed to load grades", backgroundColor: "#ef4444" }).showToast();
        } finally {
            setLoading(false);
        }
    };

    // Save/Update logic
    const handleSave = async (event, action) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: new URLSearchParams(formData),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            const text = await response.text();

            try {
                const res = JSON.parse(text);
                if (res.status) {
                    Toastify({
                        text: action === 'add' ? "Grade Added!" : "Grade Updated!",
                        backgroundColor: "#10b981"
                    }).showToast();
                    setOpen(prev => ({ ...prev, [action]: false }));
                    getRowGrades();
                } else {
                    Toastify({ text: res.message || "Error", backgroundColor: "#ef4444" }).showToast();
                }
            } catch (e) {
                console.error(text);
            }
        } catch (error) {
            Toastify({ text: "Connection Failed", backgroundColor: "#ef4444" }).showToast();
        }
    }

    const activate_grade = async (id, status) => {
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                body: new URLSearchParams({ grade_id: id, status: status }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            const data = await res.json();
            if (data.status) {
                Toastify({
                    text: status === 'active' ? "Activated!" : "Deactivated!",
                    backgroundColor: "#10b981"
                }).showToast();
                getRowGrades();
            } else {
                Toastify({ text: data.message, backgroundColor: "#ef4444" }).showToast();
            }
        } catch (e) {
            Toastify({ text: "Error updating status", backgroundColor: "#ef4444" }).showToast();
        }
    }

    useEffect(() => {
        getRowGrades();
    }, []);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }} padding={2}>
                <Typography variant="h6" fontWeight={700}>Grading Scheme</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen({ ...open, add: true })}
                    sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}
                >
                    Add Grade Range
                </Button>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                <TableCell>#</TableCell>
                                <TableCell>Level</TableCell>
                                <TableCell>Range</TableCell>
                                <TableCell>Grade</TableCell>
                                {!isMobile && <TableCell>Remark</TableCell>}
                                {!isMobile && <TableCell>Status</TableCell>}
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} sx={{ p: 0 }}>
                                        <LinearProgress sx={{ bgcolor: '#e0e7ff', '& .MuiLinearProgress-bar': { bgcolor: '#6366f1' } }} />
                                    </TableCell>
                                </TableRow>
                            ) : grades.map((row, index) => (
                                <TableRow key={index} hover>
                                    <TableCell sx={{ color: '#64748b' }}>{index + 1}</TableCell>
                                    <TableCell sx={{ textTransform: 'capitalize' }}>{row.level}</TableCell>
                                    <TableCell>{row.min_mark} - {row.max_mark}</TableCell>
                                    <TableCell>
                                        <Chip label={row.grade} size="small" sx={{ fontWeight: 700, bgcolor: '#f137c3ff' }} color="primary" />
                                    </TableCell>
                                    {!isMobile && (<TableCell>{row.remark}</TableCell>)}
                                    {!isMobile && (
                                        <TableCell>
                                            <Chip
                                                label={row.status}
                                                size="small"
                                                sx={{
                                                    textTransform: 'capitalize',
                                                    bgcolor: row.status === 'active' ? '#dcfce7' : '#fee2e2',
                                                    color: row.status === 'active' ? '#166534' : '#991b1b'
                                                }}
                                            />
                                        </TableCell>
                                    )}
                                    <TableCell align="right">
                                        <Button
                                            size="small"
                                            onClick={() => {
                                                setEdit(row);
                                                setOpen({ ...open, edit: true });
                                            }}
                                            sx={{
                                                color: '#4f46e5',
                                                fontWeight: 700,
                                                textTransform: 'none',
                                                borderRadius: '10px',
                                                px: 2,
                                                py: 0.5,
                                                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                                                border: '1px solid rgba(99, 102, 241, 0.1)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                                                    transform: 'translateY(-1px)',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                                                },
                                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* ADD DIALOG */}
            <Dialog
                open={open.add}
                onClose={() => setOpen({ ...open, add: false })}
                PaperProps={{ sx: { borderRadius: 3, width: 450 } }}
            >
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                    <Typography variant="h6" fontWeight={700}>Add Grade Range</Typography>
                    <IconButton size="small" onClick={() => setOpen({ ...open, add: false })}><CloseIcon /></IconButton>
                </Box>
                <form onSubmit={(e) => handleSave(e, 'add')} style={{ padding: 24 }}>
                    <Typography variant="caption" sx={{ color: '#ef4444', mb: 2, display: 'block' }}>Academic Name: {academic.name}</Typography>
                    <input type="hidden" name="academic_id" value={academic.id} />

                    <FormControl fullWidth sx={{ mb: 2 }} size="small">
                        <InputLabel>Level</InputLabel>
                        <Select
                            value={seletype}
                            label="Level"
                            onChange={(e) => setSeletype(e.target.value)}
                            name="level"
                        >
                            <MenuItem value="senior">Senior</MenuItem>
                            <MenuItem value="junior">Junior</MenuItem>
                        </Select>
                    </FormControl>

                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        <TextField label="Min-Mark" name="min_mark" size="small" fullWidth required />
                        <TextField label="Max-Mark" name="max_mark" size="small" fullWidth required />
                    </Stack>

                    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                        <TextField label="Grade" name="grade" size="small" fullWidth required />
                        <TextField label="Remark" name="remark" size="small" fullWidth required />
                    </Stack>

                    <Button type="submit" variant="contained" fullWidth sx={{ borderRadius: 2 }}>Save Grade</Button>
                </form>
            </Dialog>

            {/* EDIT DRAWER */}
            <Drawer
                anchor="right"
                open={open.edit}
                onClose={() => setOpen({ ...open, edit: false })}
                PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}
            >
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                    <Typography variant="h6" fontWeight={700}>Edit Grade</Typography>
                    <IconButton size="small" onClick={() => setOpen({ ...open, edit: false })}><CloseIcon /></IconButton>
                </Box>

                <form onSubmit={(e) => handleSave(e, 'edit')} style={{ padding: 24 }}>
                    <input type="hidden" name="academic_id" value={academic.id} />
                    <input type="hidden" name="grade_id" value={edit.id || ''} />

                    <FormControl fullWidth sx={{ mb: 3 }} size="small">
                        <InputLabel>Level</InputLabel>
                        <Select
                            value={edit.level || 'senior'}
                            label="Level"
                            onChange={(e) => setEdit({ ...edit, level: e.target.value })}
                            name="level_edit"
                        >
                            <MenuItem value="senior">Senior</MenuItem>
                            <MenuItem value="junior">Junior</MenuItem>
                        </Select>
                    </FormControl>

                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        <TextField label="Min-Mark" name="min_mark_edit" value={edit.min_mark || ''} onChange={e => setEdit({ ...edit, min_mark: e.target.value })} size="small" fullWidth required />
                        <TextField label="Max-Mark" name="max_mark" value={edit.max_mark || ''} onChange={e => setEdit({ ...edit, max_mark: e.target.value })} size="small" fullWidth required />
                    </Stack>

                    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                        <TextField label="Grade" name="grade" value={edit.grade || ''} onChange={e => setEdit({ ...edit, grade: e.target.value })} size="small" fullWidth required />
                        <TextField label="Remark" name="remark" value={edit.remark || ''} onChange={e => setEdit({ ...edit, remark: e.target.value })} size="small" fullWidth required />
                    </Stack>

                    <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight={600}>{edit.status === "active" ? "Active" : "Inactive"}</Typography>
                        <Switch
                            checked={edit.status === "active"}
                            onChange={e => {
                                const newStatus = e.target.checked ? "active" : "inactive";
                                setEdit({ ...edit, status: newStatus });
                                activate_grade(edit.id, newStatus);
                            }}
                            color="success"
                        />
                    </Box>

                    <Button type="submit" variant="contained" fullWidth sx={{ borderRadius: 2 }}>Update Grade</Button>
                </form>
            </Drawer>
        </Box>
    )
}

export default Grading;
