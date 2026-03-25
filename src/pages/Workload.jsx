import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
    Box,
    Typography,
    Paper,
    Fade,
    Grid,
    Stack,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Chip,
    useTheme,
    useMediaQuery,
    CircularProgress,
    TextField,
    InputAdornment,
    IconButton,
    Tooltip,
    Skeleton,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import {
    Task as AssignmentIcon,
    People as GroupsIcon,
    TickCircle as DoneIcon,
    TrendUp as ProgressIcon,
    Buildings as SchoolIcon,
    User as PersonIcon,
    SearchNormal1 as SearchIcon,
    Refresh as RefreshIcon,
    Filter as FilterIcon,
    CloseCircle as ClearIcon
} from 'iconsax-react';
import { AppContext } from '../context/AppContext';

import { API_URL } from '../config';

/* =======================
   STAT CARD COMPONENT
======================= */
const StatCard = ({ title, count, icon, color, subtitle }) => (
    <Paper
        elevation={0}
        sx={{
            p: 2.5,
            borderRadius: 4,
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
            <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a' }}>
                    {count}
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

function Workload() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { academic, schoolType } = useContext(AppContext);

    const [loading, setLoading] = useState(true);
    const [assignments, setAssignments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterForm, setFilterForm] = useState('All');
    const [stats, setStats] = useState({
        totalAssignments: 0,
        completedAssignments: 0,
        avgProgress: 0,
        activeTeachers: 0
    });

    const fetchWorkloadData = async () => {
        if (!academic.id) return;
        setLoading(true);
        try {
            // 1. Fetch all staff and their basic assignments
            const staffRes = await fetch(`${API_URL}?getStaffA=${academic.id}&school_type=${schoolType}`);
            const staffData = await staffRes.json();
            const staffList = Array.isArray(staffData) ? staffData : [];

            // 2. Prepare promises for individual subject progress
            const assignmentPromises = [];

            for (const teacher of staffList) {
                if (teacher.subjects && Array.isArray(teacher.subjects)) {
                    for (const sub of teacher.subjects) {
                        const progressUrl = `${API_URL}?getSubjectProgress=1&aca_id=${sub.aca_id || academic.id}&form=${sub.form}&subject=${sub.subject || sub.subject_id || sub.id}`;
                        assignmentPromises.push(
                            fetch(progressUrl)
                                .then(res => res.json())
                                .then(data => {
                                    console.log(`[Workload Debug] URL: ${progressUrl}`, { sub, data });

                                    // Robust extraction
                                    const source = Array.isArray(data) ? data[0] : data;
                                    const progress = Number(source?.progress || 0);
                                    const total = Number(source?.total_students || 0);
                                    const graded = Number(source?.graded_students || 0);

                                    return {
                                        ...sub,
                                        teacherName: teacher.username,
                                        teacherId: teacher.id,
                                        progress,
                                        studentCount: total,
                                        gradedCount: graded
                                    };
                                })
                                .catch(err => {
                                    console.error('Progress API error:', err);
                                    return {
                                        ...sub,
                                        teacherName: teacher.username,
                                        teacherId: teacher.id,
                                        progress: 0,
                                        studentCount: 0,
                                        gradedCount: 0,
                                        error: true
                                    };
                                })
                        );

                    }
                }
            }

            // 3. Resolve all promises in parallel
            const allAssignments = await Promise.all(assignmentPromises);
            setAssignments(allAssignments);

            // 4. Calculate stats from finalized data
            const completed = allAssignments.filter(a => a.progress === 100).length;
            const totalProg = allAssignments.reduce((acc, curr) => acc + curr.progress, 0);

            setStats({
                totalAssignments: allAssignments.length,
                completedAssignments: completed,
                avgProgress: allAssignments.length > 0 ? Math.round(totalProg / allAssignments.length) : 0,
                activeTeachers: staffList.filter(t => t.subject_count > 0).length
            });

        } catch (error) {
            console.error("Error fetching workload distribution:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAssignments = useMemo(() => {
        return assignments.filter(item => {
            const matchesSearch =
                (item.teacherName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.name || '').toLowerCase().includes(searchQuery.toLowerCase());
            const matchesForm = filterForm === 'All' || (item.form && item.form.toString() === filterForm);
            return matchesSearch && matchesForm;
        });
    }, [assignments, searchQuery, filterForm]);

    const forms = useMemo(() => {
        const uniqueForms = [...new Set(assignments.filter(a => a.form !== undefined && a.form !== null).map(a => a.form.toString()))];
        return uniqueForms.sort((a, b) => a - b);
    }, [assignments]);

    useEffect(() => {
        fetchWorkloadData();
    }, [academic.id, schoolType]);

    return (
        <Fade in timeout={800}>
            <Box sx={{
                p: { xs: 0, md: 1 },
                minHeight: '100vh',
                bgcolor: '#f8fafc'
            }}>
                {/* Header */}
                <Box sx={{ mb: 4, px: { xs: 1, md: 0 }, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
                            Workload Intelligence
                        </Typography>
                        <Typography sx={{ color: '#64748b', fontSize: 13, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SchoolIcon size={16} color="#64748b" />
                            Real-time grading progress and assignment distribution for {academic?.name || "current session"}.
                        </Typography>
                    </Box>
                    <Tooltip title="Refresh Data">
                        <IconButton
                            onClick={fetchWorkloadData}
                            disabled={loading}
                            sx={{
                                bgcolor: '#fff',
                                border: '1px solid #e2e8f0',
                                '&:hover': { bgcolor: '#f1f5f9' },
                                borderRadius: 3
                            }}
                        >
                            <RefreshIcon size={20} color="#64748b" className={loading ? 'spin' : ''} />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Summary Stats */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={6} lg={3}>
                        <StatCard
                            title="Total Classes"
                            count={loading ? <Skeleton width={40} /> : stats.totalAssignments}
                            icon={<AssignmentIcon size={28} color="#6366f1" />}
                            color="#6366f1"
                            subtitle="Total active allocations"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={3}>
                        <StatCard
                            title="Active Teachers"
                            count={loading ? <Skeleton width={40} /> : stats.activeTeachers}
                            icon={<PersonIcon size={28} color="#3b82f6" />}
                            color="#3b82f6"
                            subtitle="Teaching this session"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={3}>
                        <StatCard
                            title="School Progress"
                            count={loading ? <Skeleton width={60} /> : `${stats.avgProgress}%`}
                            icon={<ProgressIcon size={28} color="#f59e0b" />}
                            color="#f59e0b"
                            subtitle="Average grading completion"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={3}>
                        <StatCard
                            title="Completed"
                            count={loading ? <Skeleton width={40} /> : stats.completedAssignments}
                            icon={<DoneIcon size={28} color="#10b981" />}
                            color="#10b981"
                            subtitle="Ready for reports"
                        />
                    </Grid>
                </Grid>

                {/* Search and Filters */}
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    sx={{ mb: 3 }}
                >
                    <TextField
                        placeholder="Search teacher or subject..."
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{
                            flexGrow: 1,
                            '& .MuiOutlinedInput-root': {
                                bgcolor: '#fff',
                                borderRadius: 3,
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon size={20} color="#94a3b8" />
                                </InputAdornment>
                            ),
                            endAdornment: searchQuery && (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                                        <ClearIcon size={18} />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel sx={{ fontWeight: 600 }}>Filter by Form</InputLabel>
                        <Select
                            value={filterForm}
                            label="Filter by Form"
                            onChange={(e) => setFilterForm(e.target.value)}
                            sx={{
                                bgcolor: '#fff',
                                borderRadius: 3,
                                fontWeight: 700
                            }}
                        >
                            <MenuItem value="All">All Forms</MenuItem>
                            {forms.map(f => (
                                <MenuItem key={f} value={f}>Form {f}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>

                {/* Main Content Table */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 0,
                        borderRadius: 4,
                        border: '1px solid #e2e8f0',
                        bgcolor: '#fff',
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b' }}>
                            Allocation Details ({filteredAssignments.length})
                        </Typography>
                        {loading && <CircularProgress size={20} thickness={5} sx={{ color: '#6366f1' }} />}
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Teacher</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Subject</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Class</TableCell>
                                    {!isMobile && <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Students</TableCell>}
                                    <TableCell sx={{ fontWeight: 700, color: '#475569', width: '30%' }}>Grading Efficiency</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading && assignments.length === 0 ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell colSpan={5} sx={{ py: 3 }}><LinearProgress sx={{ opacity: 0.1, borderRadius: 2 }} /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredAssignments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="body1" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                                                    {searchQuery || filterForm !== 'All'
                                                        ? "No assignments match your filters."
                                                        : "No assignments found for this school context."}
                                                </Typography>
                                                {(searchQuery || filterForm !== 'All') && (
                                                    <IconButton
                                                        onClick={() => { setSearchQuery(''); setFilterForm('All'); }}
                                                        sx={{ mt: 1, color: '#6366f1', fontSize: 14, fontWeight: 700 }}
                                                    >
                                                        Clear All Filters
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredAssignments.map((row, idx) => (
                                        <TableRow key={idx} hover sx={{ transition: 'background-color 0.2s' }}>
                                            <TableCell>
                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                    <Avatar
                                                        src={`/images/profile.jpg`}
                                                        sx={{
                                                            width: 32, height: 32, fontSize: '0.8rem', fontWeight: 700,
                                                            bgcolor: '#6366f1', color: '#fff'
                                                        }}
                                                    >
                                                        {row.teacherName.charAt(0)}
                                                    </Avatar>
                                                    <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: 14 }}>
                                                        {row.teacherName}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>
                                                    {row.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={`Form ${row.form}`}
                                                    size="small"
                                                    sx={{ bgcolor: '#f1f5f9', fontWeight: 700, borderRadius: '6px' }}
                                                />
                                            </TableCell>
                                            {!isMobile && (
                                                <TableCell>
                                                    <Tooltip title={`${row.gradedCount} graded out of ${row.studentCount}`}>
                                                        <Chip
                                                            label={`${row.gradedCount} / ${row.studentCount}`}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ fontWeight: 700, color: '#64748b' }}
                                                        />
                                                    </Tooltip>
                                                </TableCell>
                                            )}
                                            <TableCell>
                                                <Stack spacing={1}>
                                                    <Stack direction="row" justifyContent="space-between">
                                                        <Typography variant="caption" sx={{ fontWeight: 800, color: row.progress === 100 ? '#10b981' : '#6366f1' }}>
                                                            {row.progress}%
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                                                            {row.progress === 100 ? 'Finalized' : 'In Progress'}
                                                        </Typography>
                                                    </Stack>
                                                    <Tooltip title={`${row.progress}% Complete`}>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={row.progress}
                                                            sx={{
                                                                height: 6,
                                                                borderRadius: 3,
                                                                bgcolor: '#f1f5f9',
                                                                '& .MuiLinearProgress-bar': {
                                                                    bgcolor: row.progress === 100 ? '#10b981' : '#6366f1',
                                                                    borderRadius: 3
                                                                }
                                                            }}
                                                        />
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </Fade>
    );
}

export default Workload;
