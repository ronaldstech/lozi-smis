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
    CloseCircle
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
        sx={{
            p: 3,
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: 2.5,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                transform: 'translateY(-5px)',
                background: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)'
            }
        }}
    >
        <Box
            sx={{
                width: 52,
                height: 52,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                color: '#fff',
                boxShadow: `0 8px 16px -4px ${color}40`,
            }}
        >
            {React.cloneElement(icon, { size: 24, variant: "Bulk" })}
        </Box>

        <Box>
            <Typography
                variant="caption"
                sx={{
                    fontWeight: 800,
                    color: 'text.secondary',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    fontSize: '0.65rem'
                }}
            >
                {title}
            </Typography>
            <Typography
                variant="h5"
                sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: '-0.02em' }}
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
                    px: { xs: 0, md: 2 },
                    py: { xs: 0, md: 2 }
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
                        p: { xs: 2.5, md: 3.5 },
                        borderRadius: '24px',
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
                                    fontSize: { xs: '1.25rem', md: '1.75rem' },
                                    fontWeight: 900,
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
                            spacing={1}
                        >
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<ExportCurve size={20} />}
                                onClick={print}
                                sx={{
                                    borderRadius: '16px',
                                    textTransform: 'none',
                                    borderColor: 'rgba(99, 102, 241, 0.2)',
                                    fontWeight: 700,
                                    height: 48,
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
                                    fullWidth
                                    variant="contained"
                                    startIcon={<UserAdd size={20} />}
                                    onClick={() => setOpen({ ...open, add: true })}
                                    sx={{
                                        borderRadius: '16px',
                                        textTransform: 'none',
                                        px: 4,
                                        height: 48,
                                        fontWeight: 700,
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
                <Grid container spacing={{ xs: 1, md: 2 }} sx={{ mb: { xs: 2, md: 4 } }}>
                    <Grid item xs={12} sm={4}>
                        <StatCard
                            title="Total Students"
                            count={totalStudents}
                            icon={<People />}
                            color="#6366f1"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <StatCard
                            title="Active"
                            count={activeStudents}
                            icon={<TickCircle />}
                            color="#10b981"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <StatCard
                            title="Inactive"
                            count={inactiveStudents}
                            icon={<CloseCircle />}
                            color="#ef4444"
                        />
                    </Grid>
                </Grid>

                {/* ================= TABLE ================= */}
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


