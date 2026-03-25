import React, { useState, useEffect, useContext } from 'react';
import {
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Box,
    Paper,
    Stack,
    Divider,
    Fade,
    Grid,
    useTheme,
    useMediaQuery,
    Tooltip,
    Skeleton,
    CircularProgress,
    Alert,
    AlertTitle,
    Chip
} from '@mui/material';
import {
    DocumentDownload as DownloadIcon,
    DocumentText as DescriptionIcon,
    Buildings as SchoolIcon,
    Task as AssignmentIcon,
    PresentionChart as AnalyticsIcon,
    InfoCircle as InfoIcon,
    People as GroupsIcon,
    Status as ProgressIcon,
    Magicpen as AutoIcon,
    Danger as WarningIcon
} from 'iconsax-react';
import { AppContext } from '../context/AppContext';

import { API_URL } from '../config';

/* =======================
   STAT CARD COMPONENT
======================= */
const StatCard = ({ title, count, icon, color, subtitle, loading }) => (
    <Paper
        elevation={0}
        sx={{
            p: 1,
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            height: '100%',
            transition: 'all .3s ease',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(0,0,0,.08)'
            }
        }}
    >
        <Stack direction="row" spacing={2} alignItems="center">
            <Box
                sx={{
                    width: 54,
                    height: 54,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: `${color}15`,
                    color
                }}
            >
                {icon}
            </Box>
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {title}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a' }}>
                    {loading ? <Skeleton width="60%" /> : count}
                </Typography>
                {subtitle && (
                    <Typography variant="caption" sx={{ color: '#94a3b8', mt: 0.5, display: 'block' }}>
                        {subtitle}
                    </Typography>
                )}
            </Box>
        </Stack>
    </Paper>
);

function Results() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { academic, schoolType } = useContext(AppContext);

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [stats, setStats] = useState({
        studentCount: 0,
        avgProgress: 0,
        readyReports: 0,
        totalClasses: 0
    });

    const [formData, setFormData] = useState({
        form_select: "",
        type_select: ""
    });

    const fetchStats = async () => {
        if (!academic.id) return;
        setLoading(true);
        try {
            // 1. Fetch Students count
            const studentRes = await fetch(`${API_URL}?getStudents=true&school_type=${schoolType}`);
            const studentData = await studentRes.json();
            const studentCount = Array.isArray(studentData) ? studentData.length : 0;

            // 2. Fetch Workload/Progress info
            const staffRes = await fetch(`${API_URL}?getStaffA=${academic.id}&school_type=${schoolType}`);
            const staffData = await staffRes.json();
            const staffList = Array.isArray(staffData) ? staffData : [];

            const assignmentPromises = [];
            for (const teacher of staffList) {
                if (teacher.subjects && Array.isArray(teacher.subjects)) {
                    for (const sub of teacher.subjects) {
                        const progressUrl = `${API_URL}?getSubjectProgress=1&aca_id=${sub.aca_id || academic.id}&form=${sub.form}&subject=${sub.subject || sub.subject_id || sub.id}`;
                        assignmentPromises.push(
                            fetch(progressUrl)
                                .then(res => res.json())
                                .then(data => {
                                    const source = Array.isArray(data) ? data[0] : data;
                                    return Number(source?.progress || 0);
                                })
                                .catch(() => 0)
                        );
                    }
                }
            }

            const allProgress = await Promise.all(assignmentPromises);
            const totalProg = allProgress.reduce((acc, curr) => acc + curr, 0);
            const avgProgress = allProgress.length > 0 ? Math.round(totalProg / allProgress.length) : 0;
            const completedCount = allProgress.filter(p => p === 100).length;

            setStats({
                studentCount,
                avgProgress,
                readyReports: completedCount,
                totalClasses: allProgress.length
            });

        } catch (error) {
            console.error("Error fetching results stats:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [academic.id, schoolType]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    // The "Best way" is to have a single clear action that compiles and then downloads
    const handleGenerate = (event) => {
        event.preventDefault();
        setProcessing(true);

        const params = new URLSearchParams();
        params.append('form_select', formData.form_select);
        params.append('type_select', formData.type_select);
        params.append('aca_id', academic.id);
        params.append('school_type', schoolType);

        // Open in new tab - this triggers the PHP Best 6 calculation AND the download
        const url = `${API_URL}?${params.toString()}`;
        window.open(url, '_blank');

        // Simulate a processing delay for UI feedback
        setTimeout(() => {
            setProcessing(false);
        }, 2000);
    };

    const isJunior = formData.form_select && parseInt(formData.form_select) <= 2;
    const isSenior = formData.form_select && parseInt(formData.form_select) >= 3;

    return (
        <Fade in timeout={800}>
            <Box sx={{
                p: { xs: 0, md: 1 },
                minHeight: '100vh',
                bgcolor: '#f8fafc'
            }}>
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
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography
                                    sx={{
                                        fontSize: { xs: '1rem', md: '1.25rem' },
                                        fontWeight: 800,
                                        color: '#0f172a'
                                    }}
                                >
                                    Results Analyst
                                </Typography>
                                <Chip label="Live Engine" size="small" sx={{ bgcolor: '#6366f1', color: '#fff', fontWeight: 800, fontSize: '0.65rem' }} />
                            </Stack>
                            <Typography sx={{ color: '#64748b', fontSize: 13, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <SchoolIcon size={16} />
                                Best 6 subject compiler & report generator for {academic?.name || "current session"}.
                            </Typography>
                        </Box>

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                        >
                            <Tooltip title="Refresh Session Status">
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={fetchStats}
                                    disabled={loading}
                                    sx={{
                                        borderRadius: '14px',
                                        textTransform: 'none',
                                        px: 3,
                                        borderColor: '#e2e8f0',
                                        color: '#64748b',
                                        bgcolor: '#fff'
                                    }}
                                >
                                    {loading ? <CircularProgress size={16} sx={{ mr: 1 }} /> : <ProgressIcon size={16} style={{ marginRight: 8 }} />}
                                    Sync
                                </Button>
                            </Tooltip>
                        </Stack>
                    </Stack>
                </Paper>

                {/* Summary Stats */}
                <Grid container spacing={{ xs: 1, md: 2 }} sx={{ mb: { xs: 1, md: 2 } }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Enrollment"
                            count={stats.studentCount}
                            icon={<GroupsIcon size={28} color="#6366f1" />}
                            color="#6366f1"
                            subtitle="Total students"
                            loading={loading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Grading Engine"
                            count={`${stats.avgProgress}%`}
                            icon={<AutoIcon size={28} color="#3b82f6" />}
                            color="#3b82f6"
                            subtitle="Overall input completion"
                            loading={loading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Ready Batches"
                            count={`${stats.readyReports} / ${stats.totalClasses}`}
                            icon={<AnalyticsIcon size={28} color="#10b981" />}
                            color="#10b981"
                            subtitle="Classes at 100%"
                            loading={loading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Calculation Type"
                            count={isSenior ? "Points (1-9)" : isJunior ? "Marks (0-100)" : "Select Form"}
                            icon={<InfoIcon size={28} color="#f59e0b" />}
                            color="#f59e0b"
                            subtitle={isSenior ? "Senior Secondary Logic" : "Junior Secondary Logic"}
                            loading={loading}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={7}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: '14px',
                                border: '1px solid rgba(0,0,0,0.05)',
                                background: 'rgba(255, 255, 255, 0.6)',
                                backdropFilter: 'blur(20px)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {processing && (
                                <Box sx={{
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                    bgcolor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)',
                                    zIndex: 10, display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center', gap: 2
                                }}>
                                    <CircularProgress color="primary" />
                                    <Typography variant="body2" fontWeight={700}>Compiling Best 6 Subjects...</Typography>
                                </Box>
                            )}

                            <form onSubmit={handleGenerate}>
                                <Stack spacing={3}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box
                                            sx={{
                                                width: 48, height: 48, borderRadius: 3,
                                                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#0369a1'
                                            }}
                                        >
                                            <DescriptionIcon size={28} />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={800} color="#1e293b">
                                                Analyze & Export
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                Calculates totals and generates PDF batches
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Divider />

                                    {stats.avgProgress < 100 && (
                                        <Alert severity="warning" sx={{ borderRadius: 2 }}>
                                            <AlertTitle sx={{ fontWeight: 800 }}>Grading Incomplete</AlertTitle>
                                            Overall grading is at {stats.avgProgress}%. Generating reports now may result in incomplete Best 6 calculations.
                                        </Alert>
                                    )}

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <InputLabel id="form_select_label">Class Form</InputLabel>
                                                <Select
                                                    labelId="form_select_label"
                                                    name="form_select"
                                                    id="form_select"
                                                    label="Class Form"
                                                    value={formData.form_select}
                                                    onChange={handleChange}
                                                    required
                                                    sx={{ borderRadius: 3, fontWeight: 700 }}
                                                >
                                                    {[1, 2, 3, 4].map(f => (
                                                        <MenuItem key={f} value={f}>Form {f}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <InputLabel id="type_select_label">Document Batch</InputLabel>
                                                <Select
                                                    labelId="type_select_label"
                                                    name="type_select"
                                                    id="type_select"
                                                    label="Document Batch"
                                                    value={formData.type_select}
                                                    onChange={handleChange}
                                                    required
                                                    sx={{ borderRadius: 3, fontWeight: 700 }}
                                                >
                                                    <MenuItem value="reports">Comprehensive Reports (PDF)</MenuItem>
                                                    <MenuItem value="grades">Grade Sheet Analysis</MenuItem>
                                                    <MenuItem value="marks">Mark Sheet Analysis</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px dashed #e2e8f0' }}>
                                        <Typography variant="caption" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <InfoIcon size={14} />
                                            {isSenior ? "Senior logic active: Aggregating 5 best grades (1-9) + Compulsory English." :
                                                isJunior ? "Junior logic active: Aggregating 5 best marks (0-100) + Compulsory English." :
                                                    "Select a form level to see calculation logic."}
                                        </Typography>
                                    </Box>

                                    <Button
                                        variant="contained"
                                        type="submit"
                                        size="large"
                                        startIcon={<DownloadIcon size={20} />}
                                        disabled={!formData.form_select || !formData.type_select || processing}
                                        sx={{
                                            borderRadius: 4,
                                            textTransform: 'none',
                                            fontWeight: 800,
                                            py: 2,
                                            background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
                                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                            '&:hover': {
                                                background: '#000',
                                                transform: 'translateY(-1px)'
                                            }
                                        }}
                                    >
                                        Compile & Download Batch
                                    </Button>
                                </Stack>
                            </form>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <Stack spacing={3}>
                            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: '#1e293b' }}>
                                    System Logic Overview
                                </Typography>
                                <Stack spacing={2}>
                                    {[
                                        { title: "English Constraint", desc: "English (Subject ID 12) is used in all Best 6 rankings regardless of score." },
                                        { title: "Optimization", desc: "System automatically picks the top 5 remaining subjects for each student." },
                                        { title: "Persistence", desc: "Totals and PASS/FAIL status are permanently stored in the total_marks table." }
                                    ].map((rule, idx) => (
                                        <Box key={idx}>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569', fontSize: 12 }}>
                                                {rule.title}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {rule.desc}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Paper>

                            <Box sx={{ p: 3, borderRadius: 4, bgcolor: '#111827', color: '#fff' }}>
                                <Typography variant="h6" fontWeight={900} gutterBottom>
                                    Need help?
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                                    If you notice errors in the calculations, please verify that subject assignments and grades are correctly entered in the Workload tab.
                                </Typography>
                                <Button
                                    sx={{ color: '#fff', textTransform: 'none', fontWeight: 700, p: 0 }}
                                    onClick={() => window.location.href = '/workload'}
                                >
                                    Go to Workload →
                                </Button>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Fade>
    );
}

export default Results;
