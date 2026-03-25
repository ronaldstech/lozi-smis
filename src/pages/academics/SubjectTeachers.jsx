import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import {
    Box, Typography, Table, TableHead, TableRow, TableCell,
    TableBody, Stack, Paper, Fade, Button, Chip, Avatar, Tooltip, LinearProgress,
    useTheme, useMediaQuery
} from '@mui/material';
import {
    Edit2, Buildings2
} from 'iconsax-react';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

import TeacherManagementDrawer from './components/TeacherManagementDrawer';
import AssignSubjectDialog from './components/AssignSubjectDialog';

import { API_URL } from '../../config';

function SubjectTeachers({ readOnly = false, hideHeader = false }) {
    const { schoolType } = useContext(AppContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [rows, setRows] = useState([]);
    const [academic, setAcademic] = useState({ id: 0, name: "Loading...", term: "" });
    const [open, setOpen] = useState({ add: false, addsub: false });
    const [manage, setManage] = useState({});
    const [subs, setSubs] = useState([]);
    const [subt, setSubt] = useState([]);
    const [form, setForm] = useState(0);
    const [loading, setLoading] = useState(false);
    const [subtLoading, setSubtLoading] = useState(false);

    /* ================= DATA FETCHING ================= */
    const getAcademic = async () => {
        console.log("Fetching Academic Year for schoolType:", schoolType);
        const res = await fetch(`${API_URL}?getAcademic=true&school_type=${schoolType}`);
        const data = await res.json();
        console.log("Academic Year Data:", data);
        setAcademic(data);
    };

    const getStaff = async () => {
        if (!academic.id) return;
        setLoading(true);
        console.log("Fetching Staff for academicId:", academic.id, "schoolType:", schoolType);
        try {
            const res = await fetch(`${API_URL}?getStaffA=${academic.id}&school_type=${schoolType}`);
            const data = await res.json();
            console.log("Staff Data:", data);
            setRows(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching staff:", error);
        } finally {
            setLoading(false);
        }
    };

    const getSubs = async () => {
        console.log("Fetching All Subjects...");
        try {
            const res = await fetch(`${API_URL}?getSubs=true`);
            const data = await res.json();
            console.log("Subjects Data:", data);
            setSubs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching subjects:", error);
            setSubs([]);
        }
    };

    const getSubt = async (teacherId, academicId) => {
        if (!academicId || !teacherId) return;
        setSubtLoading(true);
        console.log("Fetching Subject Teachers for teacherId:", teacherId, "academicId:", academicId);
        try {
            const res = await fetch(`${API_URL}?getSubt=true&academic_id=${academicId}&teacher_id=${teacherId}&school_type=${schoolType}`);
            const data = await res.json();
            console.log("Subject Teachers Data:", data);
            setSubt(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching subject teachers:", error);
            setSubt([]);
        } finally {
            setSubtLoading(false);
        }
    };

    /* ================= ACTIONS ================= */
    const select_subject = async (subj) => {
        // Validation: ensure all required fields are present
        if (!manage.id || !subj.id || !form || !academic.id || !schoolType) {
            console.error("Missing required parameters for subject assignment:", {
                teacher_id: manage.id,
                subject_id: subj.id,
                form: form,
                academic_id: academic.id,
                school_type: schoolType
            });
            Toastify({
                text: "Missing assignment data. Please try again.",
                backgroundColor: "#dc2626"
            }).showToast();
            return;
        }

        const body = new URLSearchParams({
            assignSubject: "true", // Using string "true" for consistency
            teacher_id: manage.id.toString(),
            subject_id: subj.id.toString(),
            form: form.toString(),
            academic_id: academic.id.toString(),
            school_type: schoolType
        });

        try {
            console.log("Assigning Subject with body:", Object.fromEntries(body));
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body,
            });

            const text = await response.text();
            console.log("Server Response Text:", text);
            let res;
            try {
                res = JSON.parse(text);
            } catch (e) {
                console.error("Server return non-JSON response:", text);
                throw new Error("Invalid server response");
            }

            Toastify({
                text: res.message,
                backgroundColor: res.status ? "#4f46e5" : "#dc2626"
            }).showToast();

            if (res.status) {
                getSubt(manage.id, academic.id);
                getStaff();
            }
        } catch (error) {
            console.error("Assignment error:", error);
            Toastify({
                text: "Failed to connect to server",
                backgroundColor: "#dc2626"
            }).showToast();
        }
    };


    const handleDelete = async (id) => {
        console.log("Deleting Subject Teacher Entry ID:", id);
        const response = await fetch(API_URL, {
            method: 'POST',
            body: new URLSearchParams({ deleteSubt: "true", id: id })
        });
        const res = await response.json();
        console.log("Delete Response:", res);
        if (res.status) {
            Toastify({ text: res.message, backgroundColor: "#ef4444" }).showToast();
            getSubt(manage.id, academic.id);
            getStaff();
        }
    }

    // Handler to open the assign dialog (passed to drawer)
    const handleAssignNew = (selectedForm) => {
        setForm(selectedForm);
        setOpen({ ...open, addsub: true });
        getSubs();
    };

    useEffect(() => {
        setAcademic({ id: 0, name: "Loading...", term: "" });
        getAcademic();
    }, [schoolType]);

    useEffect(() => {
        if (academic.id && academic.school === schoolType) {
            getStaff();
        }
    }, [academic.id, academic.school, schoolType]);

    return (
        <Fade in timeout={600}>
            <Box
                sx={{
                    minHeight: hideHeader ? 'auto' : '100vh',
                    backgroundColor: hideHeader ? 'transparent' : '#f8fafc',
                    px: { xs: 0, md: hideHeader ? 0 : 1 },
                    py: { xs: 0, md: hideHeader ? 0 : 1 }
                }}
            >
                {/* ================= HEADER (STICKY) ================= */}
                {!hideHeader && (
                    <Paper
                        elevation={0}
                        sx={{
                            position: { xs: 'relative', md: 'sticky' },
                            top: 0,
                            zIndex: 1100,
                            mb: { xs: 2, md: 4 },
                            p: { xs: 1, md: 2 },
                            borderRadius: '14px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(255, 255, 255, 0.6)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={{ xs: 1, md: 2 }}
                            justifyContent="space-between"
                            alignItems={{ xs: 'stretch', md: 'center' }}
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: { xs: '1rem', md: '1.25rem' },
                                        fontWeight: 800,
                                        color: '#0f172a'
                                    }}
                                >
                                    Teacher Allocations
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                    <Buildings2 size={16} color="#6366f1" />
                                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                                        {academic.name} — Term {academic.term}
                                    </Typography>
                                </Stack>
                            </Box>

                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={2}
                            >
                                <Chip
                                    label="Active Session"
                                    size="small"
                                    sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 700, borderRadius: '6px' }}
                                />
                            </Stack>
                        </Stack>
                    </Paper>
                )}

                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: '14px',
                        border: '1px solid rgba(0,0,0,0.05)',
                        overflow: 'hidden',
                        background: 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)'
                    }}
                >
                    <Box sx={{ overflowX: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Teacher</TableCell>
                                    {!isMobile && <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Workload</TableCell>}
                                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Subjects</TableCell>
                                    {!readOnly && <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} sx={{ p: 0 }}>
                                            <LinearProgress sx={{ bgcolor: '#e0e7ff', '& .MuiLinearProgress-bar': { bgcolor: '#6366f1' } }} />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    Array.isArray(rows) && rows.map((row, index) => (
                                        <TableRow key={index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell>
                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                    {!isMobile && (<Avatar
                                                        src={`/images/profile.jpg`}
                                                        alt={row.username}
                                                        sx={{
                                                            width: 40, height: 40,
                                                            bgcolor: '#f1f5f9', color: '#6366f1',
                                                            fontSize: '1rem', fontWeight: 700,
                                                            border: '2px solid #fff',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                                        }}
                                                    />)}
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                                            {row.username}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                            Staff ID: #00{row.id}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </TableCell>
                                            {!isMobile && (
                                                <TableCell sx={{ minWidth: 150 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Box sx={{ width: '100%', mr: 1 }}>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={Math.min((row.subject_count / 6) * 100, 100)}
                                                                sx={{
                                                                    height: 6, borderRadius: 5, bgcolor: '#f1f5f9',
                                                                    '& .MuiLinearProgress-bar': { borderRadius: 5, bgcolor: row.subject_count > 6 ? '#f59e0b' : '#6366f1' }
                                                                }}
                                                            />
                                                        </Box>
                                                        <Typography variant="caption" fontWeight={700} color="textSecondary">
                                                            {row.subject_count}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                            )}
                                            <TableCell>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {row.subjects && row.subjects.length > 0 ? (
                                                        row.subjects.map((s, i) => (
                                                            <Chip
                                                                key={s.id || i}
                                                                label={s.name}
                                                                size="small"
                                                                sx={{ fontSize: '0.65rem', height: 20, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}
                                                            />
                                                        ))
                                                    ) : (
                                                        <Typography variant="caption" italic color="#cbd5e1">No assignments</Typography>
                                                    )}
                                                </Box>
                                            </TableCell>
                                            {!readOnly && (
                                                <TableCell align="right">
                                                    <Tooltip title="Manage Schedule">
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            onClick={() => {
                                                                setManage(row);
                                                                setOpen({ ...open, add: true });
                                                                getSubt(row.id, academic.id);
                                                            }}
                                                            sx={{ textTransform: 'none', borderRadius: '8px', bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' } }}
                                                        >
                                                            Assign
                                                        </Button>
                                                    </Tooltip>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Box>
                </Paper>

                <TeacherManagementDrawer
                    open={open.add}
                    onClose={() => setOpen({ ...open, add: false })}
                    teacher={manage}
                    subjects={subt}
                    loading={subtLoading}
                    onDelete={handleDelete}
                    onAssignNew={handleAssignNew}
                />

                <AssignSubjectDialog
                    open={open.addsub}
                    onClose={() => setOpen({ ...open, addsub: false })}
                    form={form}
                    subjects={subs}
                    onSelect={select_subject}
                    onSave={() => { setOpen({ ...open, addsub: false }); getStaff(); }}
                />
            </Box>
        </Fade>
    );
}

export default SubjectTeachers;