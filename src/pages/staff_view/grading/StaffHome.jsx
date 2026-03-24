import React, { useState, useEffect, useContext } from 'react';
import {
    Box,
    Typography,
    Chip,
    Stack,
    Fade,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    TaskSquare,
    Eye
} from 'iconsax-react';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import { AppContext } from '../../../context/AppContext';

// Sub-components
import SubjectTable from './components/SubjectTable';
import GradingDialog from './components/GradingDialog';

import { API_URL } from '../../../config';

function StaffHome() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user, academic, schoolType } = useContext(AppContext);

    // State
    const [sub, setSub] = useState([]);
    const [open, setOpen] = useState({ upload: false });
    const [info, setInfo] = useState({ status: "inactive" });
    const [acaData, setAcaData] = useState({});
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [studentLoading, setStudentLoading] = useState(false);

    // Derived State
    const gradedCount = rows.filter(r => r.end_term !== "").length;

    const progress = rows.length > 0 ? Math.round((gradedCount / rows.length) * 100) : 0;

    // Actions
    const getSubjects = async () => {
        if (!user.id || !academic.id) return;
        setLoading(true);
        try {
            const params = new URLSearchParams({
                getSubt: "true",
                academic_id: academic.id,
                teacher_id: user.id,
                school_type: schoolType
            });
            const res = await fetch(`${API_URL}?${params.toString()}`);
            const data = await res.json();

            const subjects = Array.isArray(data) ? data : [];

            // Compute progress per subject
            const subjectsWithProgress = await Promise.all(subjects.map(async (subject) => {
                try {
                    const studentParams = new URLSearchParams({
                        getYourStudents: "true",
                        form: subject.form,
                        academic_id: subject.aca_id,
                        subject_id: subject.subject
                    });
                    const studentRes = await fetch(`${API_URL}?${studentParams.toString()}`);
                    const studentData = await studentRes.json();
                    const students = Array.isArray(studentData) ? studentData : [];

                    const gradedCount = students.filter(r => r.mark?.end_term).length;
                    const totalStudents = students.length || 1; // avoid division by 0
                    const progress = Math.round((gradedCount / totalStudents) * 100);

                    return { ...subject, progress };
                } catch {
                    return { ...subject, progress: 0 };
                }
            }));

            setSub(subjectsWithProgress);

        } catch (error) {
            console.error("Error fetching subjects:", error);
            Toastify({ text: "Failed to load subjects", backgroundColor: "#ef4444" }).showToast();
        } finally {
            setLoading(false);
        }
    };


    const getInfo = async () => {
        try {
            const res = await fetch(`${API_URL}?getInfoUpload=true`);
            const data = await res.json();
            if (data.status) {
                setInfo(data.data);
            }
        } catch (error) {
            console.error("Error fetching info:", error);
        }
    };

    const getYourStudents = async (form, aca_id, name, term, subId) => {
        setStudentLoading(true);
        setAcaData({ form, name, term, subject_id: subId, academic_id: aca_id });
        setOpen({ upload: true });
        setRows([]);

        try {
            const params = new URLSearchParams({
                getYourStudents: "true",
                form: form,
                academic_id: aca_id,
                subject_id: subId,
                school_type: schoolType
            });
            const res = await fetch(`${API_URL}?${params.toString()}`);
            const data = await res.json();
            const normalized = Array.isArray(data)
                ? data.map(r => ({
                    ...r,
                    end_term: r.mark ? r.mark.end_term : ""
                }))
                : [];

            setRows(normalized);

        } catch (error) {
            console.error("Error fetching students:", error);
            Toastify({ text: "Failed to load student list", backgroundColor: "#ef4444" }).showToast();
        } finally {
            setStudentLoading(false);
        }
    };

    const getYourStudentsMarks = (form, aca_id, name, term, subId) => {
        const params = new URLSearchParams({
            print_marks: "true",
            form: form,
            academic_id: aca_id,
            subject_id: subId,
            school_type: schoolType
        });
        const url = `${API_URL}?${params.toString()}`;
        window.open(url, "_blank").focus();
    };

    const updateMark = async (id, subject, form, academic_id, value) => {
        if (value === "" || value === null || value === undefined) return;
        if (value > 100 || value < 0) {
            Toastify({ text: "Mark must be between 0 and 100", backgroundColor: "#f59e0b" }).showToast();
            return;
        }

        try {
            const body = new URLSearchParams({
                updateEndTerm: "true", id, subject, form, academic_id, value,
                school_type: schoolType
            });
            const response = await fetch(API_URL, {
                method: 'POST',
                body: body,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            const res = await response.json();
            if (res.status) {
                Toastify({ text: res.message, backgroundColor: "#10b981", duration: 1000 }).showToast();
            } else {
                Toastify({ text: res.message, backgroundColor: "#ef4444" }).showToast();
            }
        } catch (error) {
            console.error("Error updating mark:", error);
            Toastify({ text: "Update failed", backgroundColor: "#ef4444" }).showToast();
        }
    };

    const deleteMarkRow = async (id, subject, form, academic_id) => {
        if (!window.confirm("Are you sure you want to delete ALL marks for this student record? This cannot be undone.")) return;

        try {
            const body = new URLSearchParams({
                deleteMarkRow: "true", id, subject, form, academic_id,
                school_type: schoolType
            });
            const response = await fetch(API_URL, {
                method: 'POST',
                body: body,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            const res = await response.json();
            if (res.status) {
                Toastify({ text: res.message, backgroundColor: "#64748b", duration: 1500 }).showToast();
                // Clear end_term locally
                setRows(prev => prev.map(row => row.id === id ? { ...row, end_term: "" } : row));
            } else {
                Toastify({ text: res.message, backgroundColor: "#ef4444" }).showToast();
            }
        } catch (error) {
            console.error("Error deleting mark record:", error);
            Toastify({ text: "Action failed", backgroundColor: "#ef4444" }).showToast();
        }
    };

    const handleLocalRowUpdate = (id, field, value) => {
        setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
    };

    useEffect(() => {
        if (user.id && academic.id) {
            getSubjects();
            getInfo();
        }
    }, [user.id, academic.id]);

    return (
        <Fade in timeout={600}>
            <Box sx={{ p: { xs: 0, md: 1 } }}>
                {/* Header Section */}
                <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 2, px: { xs: 1, md: 0 } }}>
                    <Box>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                            <Box sx={{ p: 1, borderRadius: '12px', bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                                <TaskSquare variant="Bulk" size={24} />
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a' }}>
                                My Classes & Grading
                            </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ color: '#64748b', ml: { md: 6 } }}>
                            Manage your assigned subjects and student marks for {academic.name} — Term {academic.term}.
                        </Typography>
                    </Box>

                    <Chip
                        icon={<Eye size={16} variant="Bold" />}
                        label={info.status === "active" ? "Grading Window Open" : "Grading Window Closed"}
                        sx={{
                            fontWeight: 700,
                            bgcolor: info.status === "active" ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: info.status === "active" ? '#059669' : '#dc2626',
                            border: '1px solid rgba(0,0,0,0.05)',
                            px: 1, height: 32
                        }}
                    />
                </Box>

                <SubjectTable
                    sub={sub}
                    loading={loading}
                    isMobile={isMobile}
                    academic={academic}
                    onGradeClass={getYourStudents}
                    onPrintMarks={getYourStudentsMarks}
                />

                <GradingDialog
                    open={open.upload}
                    onClose={() => setOpen({ ...open, upload: false })}
                    acaData={acaData}
                    progress={progress}
                    info={info}
                    rows={rows}
                    studentLoading={studentLoading}
                    isMobile={isMobile}
                    schoolType={schoolType}
                    onUpdateMark={updateMark}
                    onDeleteMarkRow={deleteMarkRow}
                    onLocalUpdate={handleLocalRowUpdate}
                />
            </Box>
        </Fade>
    );
}

export default StaffHome;
