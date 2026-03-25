import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
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
    InputAdornment,
    Stack,
    Divider,
    LinearProgress,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    AddCircle,
    Edit2,
    CloseCircle,
    TickCircle,
    Book1,
    Category
} from 'iconsax-react';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

import { API_URL } from '../../config';

function Subjects({ readOnly = false }) {
    const { schoolType } = useContext(AppContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [root, setRoot] = useState("");
    const [open, setOpen] = useState({
        add: false,
        edit: false
    });
    const [rows, setRows] = useState([]);
    const [edit, setEdit] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch subjects using native API
    const getSubjects = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}?getSubjects=true&school_type=${schoolType}`);
            const data = await res.json();
            setRows(data);
        } catch (error) {
            console.error("Error fetching subjects:", error);
            Toastify({ text: "Failed to load subjects", backgroundColor: "#ef4444" }).showToast();
        } finally {
            setLoading(false);
        }
    };

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
                        text: action === 'add' ? "Subject Added!" : "Subject Updated!",
                        backgroundColor: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    }).showToast();
                    setOpen(prev => ({ ...prev, [action]: false }));
                    getSubjects();
                    if (action === 'add') {
                        setRoot("");
                        event.target.reset();
                    }
                } else {
                    Toastify({ text: res.message || "Error", backgroundColor: "#ef4444" }).showToast();
                }
            } catch (e) {
                console.error("JSON Error:", text);
                Toastify({ text: "Server Error", backgroundColor: "#ef4444" }).showToast();
            }
        } catch (error) {
            Toastify({ text: "Connection Failed", backgroundColor: "#ef4444" }).showToast();
        }
    }

    const activate = async (id, status) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: new URLSearchParams({ subject_id: id, status_edit: status }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            const res = await response.json();

            if (res.status) {
                Toastify({
                    text: status === "active" ? "Activated!" : "Deactivated!",
                    backgroundColor: status === "active" ? "#10b981" : "#f43f5e"
                }).showToast();
                getSubjects();
            } else {
                Toastify({ text: res.message, backgroundColor: "#ef4444" }).showToast();
            }
        } catch (error) {
            Toastify({ text: "Error updating status", backgroundColor: "#ef4444" }).showToast();
        }
    }

    useEffect(() => {
        getSubjects();
    }, [schoolType]);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, md: 3 }, px: { xs: 1, md: 0 } }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    All Subjects
                </Typography>
                {!readOnly && (
                    <Button
                        variant="contained"
                        startIcon={<AddCircle size={20} variant="Bold" />}
                        onClick={() => setOpen({ ...open, add: true })}
                        sx={{
                            borderRadius: 1,
                            textTransform: 'none',
                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                        }}
                    >
                        Add Subject
                    </Button>
                )}
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 1, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>#</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Subject Name</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Root Category</TableCell>
                                {!isMobile && <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Status</TableCell>}
                                {!readOnly && <TableCell sx={{ fontWeight: 600, color: '#475569' }} align="right">Actions</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} sx={{ p: 0 }}>
                                        <LinearProgress sx={{ bgcolor: '#e0e7ff', '& .MuiLinearProgress-bar': { bgcolor: '#6366f1' } }} />
                                    </TableCell>
                                </TableRow>
                            ) : rows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#64748b' }}>
                                        No subjects found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rows.map((row, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell sx={{ color: '#64748b' }}>{index + 1}</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={row.root}
                                                size="small"
                                                icon={<Category size={14} />}
                                                sx={{
                                                    textTransform: 'capitalize',
                                                    bgcolor: '#f1f5f9',
                                                    color: '#475569'
                                                }}
                                            />
                                        </TableCell>
                                        {!isMobile && (
                                            <TableCell>
                                                <Chip
                                                    label={row.status}
                                                    size="small"
                                                    sx={{
                                                        textTransform: 'capitalize',
                                                        fontWeight: 600,
                                                        bgcolor: row.status === 'active' ? '#dcfce7' : '#fee2e2',
                                                        color: row.status === 'active' ? '#15803d' : '#b91c1c'
                                                    }}
                                                />
                                            </TableCell>
                                        )}
                                        {!readOnly && (
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
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* ADD COMPONENT */}
            <Dialog
                open={open.add}
                onClose={() => setOpen({ ...open, add: false })}
                PaperProps={{ sx: { borderRadius: 3, width: 400 } }}
            >
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                    <Typography variant="h6" fontWeight={700}>Add Subject</Typography>
                    <IconButton onClick={() => setOpen({ ...open, add: false })} size="small"><CloseCircle size={20} /></IconButton>
                </Box>
                <form onSubmit={(e) => handleSave(e, 'add')}>
                    <Box sx={{ p: 3 }}>
                        <TextField
                            label="Subject Name"
                            name="subject_name"
                            variant="outlined"
                            fullWidth
                            required
                            sx={{ mb: 3 }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Book1 size={20} color="#94a3b8" /></InputAdornment>
                            }}
                        />
                        <FormControl fullWidth sx={{ mb: 1 }}>
                            <InputLabel id="root">Root Category</InputLabel>
                            <Select
                                labelId="root_add"
                                name="root_add"
                                value={root}
                                label="Root Category"
                                onChange={(e) => setRoot(e.target.value)}
                                required
                            >
                                <MenuItem value="science">Science</MenuItem>
                                <MenuItem value="language">Language</MenuItem>
                                <MenuItem value="humanity">Humanity</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ p: 3, pt: 0, display: 'flex', gap: 2 }}>
                        <Button onClick={() => setOpen({ ...open, add: false })} fullWidth variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
                        <Button type="submit" fullWidth variant="contained" sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>Save</Button>
                    </Box>
                </form>
            </Dialog>

            {/* EDIT COMPONENT */}
            <Drawer
                anchor="right"
                open={open.edit}
                onClose={() => setOpen({ ...open, edit: false })}
                PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}
            >
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                    <Typography variant="h6" fontWeight={700}>Edit Subject</Typography>
                    <IconButton onClick={() => setOpen({ ...open, edit: false })}><CloseCircle size={20} /></IconButton>
                </Box>

                <form onSubmit={(e) => handleSave(e, 'edit')} style={{ padding: 24 }}>
                    <input type="hidden" name="subject_id_edit" value={edit.id || ''} />

                    <TextField
                        label="Subject Name"
                        name="subject_name_edit"
                        value={edit.name || ''}
                        onChange={e => setEdit({ ...edit, name: e.target.value })}
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Root Category</InputLabel>
                        <Select
                            name="root_edit"
                            value={edit.root || ''}
                            label="Root Category"
                            onChange={e => setEdit({ ...edit, root: e.target.value })}
                        >
                            <MenuItem value="science">Science</MenuItem>
                            <MenuItem value="language">Language</MenuItem>
                            <MenuItem value="humanity">Humanity</MenuItem>
                        </Select>
                    </FormControl>

                    <Divider sx={{ mb: 3 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f8fafc', p: 2, borderRadius: 2, mb: 4 }}>
                        <Typography variant="body2" fontWeight={600}>Subject Status</Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: edit.status === 'active' ? '#10b981' : '#f43f5e' }}>
                                {edit.status?.toUpperCase()}
                            </Typography>
                            <Switch
                                checked={edit.status === "active"}
                                onChange={e => {
                                    const newStatus = e.target.checked ? "active" : "inactive";
                                    setEdit({ ...edit, status: newStatus });
                                    activate(edit.id, newStatus);
                                }}
                                color="success"
                            />
                        </Stack>
                    </Box>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        startIcon={<TickCircle size={20} variant="Bold" />}
                        sx={{
                            py: 1.5,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                        }}
                    >
                        Save Changes
                    </Button>
                </form>
            </Drawer>
        </Box>
    );
}

export default Subjects;
