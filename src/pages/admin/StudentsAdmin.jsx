import React, { useState, useEffect, useContext } from 'react';
import {
    Box,
    Fade,
    Paper,
    Typography,
    Stack,
    Button,
    Grid
} from '@mui/material';
import {
    UserAdd,
    ExportCurve,
    People,
    TickCircle,
    CloseCircle,
    SearchNormal1,
    Trash,
    Edit2,
    CalendarEdit
} from 'iconsax-react';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

import StudentTable from './components/StudentTable';
import StudentAddDialog from './components/StudentAddDialog';
import StudentEditDrawer from './components/StudentEditDrawer';
import StudentDeleteDialog from './components/StudentDeleteDialog';
import { AppContext } from '../../context/AppContext';

import { API_URL } from '../../config';

/* =======================
   STAT CARD COMPONENT
======================= */
const StatCard = ({ title, count, icon, color }) => (
    <Paper
        elevation={0}
        className="glass-premium"
        sx={{
            p: 1,
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: 2.5,
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                transform: 'translateY(-5px)',
                '& .icon-box': { transform: 'scale(1.1) rotate(5deg)' }
            }
        }}
    >
        <Box
            className="icon-box"
            sx={{
                width: 40,
                height: 40,
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${color} 0%, ${color}aa 100%)`,
                color: '#fff',
                position: 'relative',
                zIndex: 1,
                transition: 'all 0.3s ease',
                boxShadow: `0 8px 16px -4px ${color}40`,
            }}
        >
            {/* Mesh overlay for icon box */}
            <Box sx={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'radial-gradient(circle at top left, rgba(255,255,255,0.3), transparent)',
                borderRadius: 'inherit'
            }} />
            {icon}
        </Box>

        <Box sx={{ zIndex: 1 }}>
            <Typography
                variant="caption"
                sx={{
                    fontWeight: 800,
                    color: 'text.secondary',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    fontSize: '0.65rem',
                    opacity: 0.8
                }}
            >
                {title}
            </Typography>
            <Typography
                variant="h5"
                sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: '-0.5px' }}
            >
                {count}
            </Typography>
        </Box>
    </Paper>
);

function StudentsAdmin() {
    const { user, schoolType } = useContext(AppContext);
    const isReadOnly = !user?.isAdmin;

    const [open, setOpen] = useState({
        add: false,
        edit: false,
        delet: false
    });

    const [rows, setRows] = useState([]);
    const [active, setActive] = useState({});
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    /* ===== DERIVED STATS ===== */
    const totalStudents = rows.length;
    const activeStudents = rows.filter(r => r.status === 'active').length;
    const inactiveStudents = totalStudents - activeStudents;

    /* ===== FETCH DATA ===== */
    const getStudents = async () => {
        setLoading(true);
        console.log("Fetching Students for schoolType:", schoolType);
        try {
            const res = await fetch(`${API_URL}?getStudents=true&school_type=${schoolType}`);
            const data = await res.json();
            console.log("Students Data:", data);
            if (Array.isArray(data)) {
                setRows(data);
            } else {
                setRows([]);
                console.error("Invalid student data:", data);
                Toastify({ text: "Failed to load student data", backgroundColor: "#ef4444" }).showToast();
            }
        } catch (error) {
            console.error(error);
            Toastify({ text: "Connection error", backgroundColor: "#ef4444" }).showToast();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getStudents();
    }, [schoolType]);

    /* ===== HANDLERS ===== */
    const handleFormSubmit = async (event, action) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const body = new URLSearchParams(formData);

        try {
            console.log(`Submitting form for action: ${action} with body:`, Object.fromEntries(body));
            const response = await fetch(API_URL, {
                method: 'POST',
                body: body,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            const text = await response.text();
            console.log("Server Response Text:", text);
            let res;
            try {
                res = JSON.parse(text);
            } catch (e) {
                console.error("Server Error:", text);
                throw new Error("Invalid server response");
            }

            if (res.status) {
                Toastify({
                    text: action === 'add' ? "Student Added!" : "Student Updated!",
                    backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                }).showToast();
                setOpen(prev => ({ ...prev, [action]: false }));
                getStudents();
                if (action === 'add') event.target.reset();
            } else {
                Toastify({ text: res.message || "Error occurred", backgroundColor: "#ef4444" }).showToast();
            }
        } catch (error) {
            Toastify({ text: error.message, backgroundColor: "#ef4444" }).showToast();
        }
    };

    const saveStudent = (e) => handleFormSubmit(e, 'add');
    const updateStudent = (e) => handleFormSubmit(e, 'edit');

    const activate = async (id, status) => {
        try {
            const body = new URLSearchParams({ student_id: id, status_edit: status });
            console.log("Updating student status with body:", Object.fromEntries(body));
            const response = await fetch(API_URL, {
                method: 'POST',
                body: body,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            const res = await response.json();
            console.log("Status Update Response:", res);

            if (res.status) {
                Toastify({
                    text: status === "active" ? "Activated!" : "Deactivated!",
                    backgroundColor: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                }).showToast();
                getStudents();
            } else {
                Toastify({ text: res.message, backgroundColor: "#ef4444" }).showToast();
            }
        } catch (error) {
            Toastify({ text: "Error updating status", backgroundColor: "#ef4444" }).showToast();
        }
    }

    const deleteStudent = async (id) => {
        try {
            const body = new URLSearchParams({ student_id: id, deleteStudent: true });
            console.log("Deleting student with body:", Object.fromEntries(body));
            const response = await fetch(API_URL, {
                method: 'POST',
                body: body,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            const res = await response.json();
            console.log("Delete Student Response:", res);

            if (res.status) {
                Toastify({ text: "Deleted Successfully", backgroundColor: "#64748b" }).showToast();
                setOpen({ ...open, delet: false });
                getStudents();
            } else {
                Toastify({ text: res.message, backgroundColor: "#ef4444" }).showToast();
            }
        } catch (error) {
            Toastify({ text: "Error deleting student", backgroundColor: "#ef4444" }).showToast();
        }
    }

    const print = () => {
        window.open("api/index.php?print_students", "_blank")?.focus();
    }

    return (
        <Fade in timeout={600}>
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundColor: '#f8fafc',
                    px: { xs: 0, md: 1 },
                    py: { xs: 0, md: 1 }
                }}
            >
                {/* ================= HEADER (STICKY) ================= */}
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
                                Students Directory
                            </Typography>
                            <Typography sx={{ color: '#64748b', fontSize: 13 }}>
                                Manage enrolled students, records, and status
                            </Typography>
                        </Box>

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                        >
                            <Button
                                variant="outlined"
                                onClick={print}
                                sx={{
                                    borderRadius: '14px',
                                    textTransform: 'none',
                                    px: 3,
                                    whiteSpace: 'nowrap',
                                    borderColor: 'rgba(99, 102, 241, 0.2)',
                                    '&:hover': {
                                        borderColor: '#6366f1',
                                        bgcolor: 'rgba(99, 102, 241, 0.05)'
                                    }
                                }}
                            >
                                Export PDF
                            </Button>

                            {!isReadOnly && (
                                <Button
                                    variant="contained"
                                    onClick={() => setOpen({ ...open, add: true })}
                                    sx={{
                                        borderRadius: '14px',
                                        textTransform: 'none',
                                        px: 3,
                                        whiteSpace: 'nowrap',
                                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                        boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.4)',
                                    }}
                                >
                                    Add Student
                                </Button>
                            )}
                        </Stack>
                    </Stack>
                </Paper>

                {/* ================= STATS ================= */}
                <Grid container spacing={{ xs: 1, md: 2 }} sx={{ mb: { xs: 1, md: 2 } }}>
                    <Grid item xs={12} sm={4}>
                        <StatCard
                            title="Total Students"
                            count={totalStudents}
                            icon={<People size={28} variant="Bulk" />}
                            color="#6366f1"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <StatCard
                            title="Active"
                            count={activeStudents}
                            icon={<TickCircle size={28} variant="Bulk" />}
                            color="#10b981"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <StatCard
                            title="Inactive"
                            count={inactiveStudents}
                            icon={<CloseCircle size={28} variant="Bulk" />}
                            color="#ef4444"
                        />
                    </Grid>
                </Grid>

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
                        <StudentTable
                            rows={rows}
                            loading={loading}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            search={search}
                            onSearchChange={(e) => setSearch(e.target.value)}
                            onPageChange={(e, p) => setPage(p)}
                            onRowsPerPageChange={(e) => {
                                setRowsPerPage(parseInt(e.target.value, 10));
                                setPage(0);
                            }}
                            onEditClick={(student) => {
                                setActive(student);
                                setOpen({ ...open, edit: true });
                            }}
                            onDeleteClick={(student) => {
                                setActive(student);
                                setOpen({ ...open, delet: true });
                            }}
                            readOnly={isReadOnly}
                        />
                    </Box>
                </Paper>

                {/* ================= DIALOGS ================= */}
                <StudentAddDialog
                    open={open.add}
                    onClose={() => setOpen({ ...open, add: false })}
                    onSave={saveStudent}
                />

                <StudentEditDrawer
                    open={open.edit}
                    onClose={() => setOpen({ ...open, edit: false })}
                    activeStudent={active}
                    onUpdate={updateStudent}
                    onActivate={activate}
                />

                <StudentDeleteDialog
                    open={open.delet}
                    onClose={() => setOpen({ ...open, delet: false })}
                    onConfirm={() => deleteStudent(active.id)}
                    studentName={`${active.first} ${active.last}`}
                />

            </Box>
        </Fade>
    );
}

export default StudentsAdmin;


