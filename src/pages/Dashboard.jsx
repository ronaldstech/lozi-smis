import React, { useState, useEffect } from 'react';
import {
    Button,
    Typography,
    Grid,
    Paper,
    Box,
    CircularProgress,
    Avatar,
    Divider,
    Stack
} from '@mui/material';
import {
    People,
    Teacher,
    Buildings,
    Graph,
    Add,
    Notification,
    DocumentText,
    ArrowRight2
} from 'iconsax-react';

/* ---------------------- Stat Card ---------------------- */
const StatCard = ({ title, value, icon, color, loading, trend }) => (
    <Paper
        elevation={0}
        sx={{
            p: { xs: 3, md: 3.5 },
            height: '100%',
            borderRadius: '28px',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                transform: { md: 'translateY(-10px)' },
                background: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 30px 60px -12px rgba(0,0,0,0.12)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
            }
        }}
    >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
                <Typography
                    variant="caption"
                    sx={{
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                        fontSize: '0.7rem'
                    }}
                >
                    {title}
                </Typography>

                {loading ? (
                    <Box sx={{ mt: 1 }}>
                        <CircularProgress
                            size={20}
                            thickness={6}
                            sx={{ color: color.split(',')[0] }}
                        />
                    </Box>
                ) : (
                    <Box sx={{ mt: 0.5 }}>
                        <Typography
                            sx={{
                                fontWeight: 900,
                                fontSize: { xs: '1.8rem', md: '2.4rem' },
                                letterSpacing: '-0.02em',
                                background: `linear-gradient(135deg, ${color})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                lineHeight: 1.1
                            }}
                        >
                            {value}
                        </Typography>
                        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                            <Graph size={14} color="#16a34a" variant="Bold" />
                            <Typography
                                variant="caption"
                                sx={{
                                    color: '#16a34a',
                                    fontWeight: 800,
                                    fontSize: '0.75rem'
                                }}
                            >
                                {trend}
                            </Typography>
                        </Stack>
                    </Box>
                )}
            </Box>

            <Box
                sx={{
                    width: 54,
                    height: 54,
                    borderRadius: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, ${color})`,
                    color: '#fff',
                    boxShadow: `0 8px 16px -4px rgba(0,0,0,0.1)`,
                }}
            >
                {React.cloneElement(icon, { size: 28, variant: "Bulk" })}
            </Box>
        </Stack>
    </Paper>
);

/* ---------------------- Dashboard ---------------------- */
function Dashboard() {
    const [stats, setStats] = useState({
        students: '0',
        teachers: '0',
        classes: '0',
        performance: '0%'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setStats({
                students: '1,240',
                teachers: '48',
                classes: '32',
                performance: '+12%'
            });
            setLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
                justifyContent="space-between"
                sx={{ mb: 4 }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontWeight: 900,
                            fontSize: { xs: '2rem', md: '2.6rem' }
                        }}
                    >
                        Dashboard
                    </Typography>
                    <Typography color="text.secondary">
                        Welcome back. Here is a quick overview.
                    </Typography>
                </Box>
            </Stack>

            <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="Total Students"
                        value={stats.students}
                        icon={<People />}
                        color="#6366f1, #a855f7"
                        loading={loading}
                        trend="+2.4% vs last month"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="Faculty"
                        value={stats.teachers}
                        icon={<Teacher />}
                        color="#ec4899, #f43f5e"
                        loading={loading}
                        trend="Full staffing"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="Active Classes"
                        value={stats.classes}
                        icon={<Buildings />}
                        color="#f59e0b, #ef4444"
                        loading={loading}
                        trend="8 rooms in use"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="Performance"
                        value={stats.performance}
                        icon={<Graph />}
                        color="#10b981, #3b82f6"
                        loading={loading}
                        trend="Strong growth"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Live Feed */}
                <Grid item xs={12} md={7}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2.5, md: 4 },
                            borderRadius: '24px',
                            background: 'rgba(255,255,255,0.9)',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}
                    >
                        <Stack direction="row" justifyContent="space-between" mb={4}>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e293b' }}>Live Feed</Typography>
                            <Button 
                                size="small" 
                                endIcon={<ArrowRight2 size={14} />}
                                sx={{ color: '#6366f1', fontWeight: 700 }}
                            >
                                View All
                            </Button>
                        </Stack>

                        {[
                            { user: 'System', action: 'Grading schema updated.', time: '2h ago', color: '#6366f1' },
                            { user: 'Admin', action: '5 students enrolled.', time: '5h ago', color: '#10b981' },
                            { user: 'Staff', action: 'Results published.', time: '1d ago', color: '#f59e0b' }
                        ].map((activity, i) => (
                            <Box key={i}>
                                <Stack direction="row" spacing={2} mb={2}>
                                    <Avatar sx={{ bgcolor: activity.color, fontWeight: 700 }}>
                                        {activity.user[0]}
                                    </Avatar>
                                    <Box>
                                        <Typography fontWeight={700}>{activity.user}</Typography>
                                        <Typography variant="body2">{activity.action}</Typography>
                                        <Typography variant="caption" color="text.disabled">
                                            {activity.time}
                                        </Typography>
                                    </Box>
                                </Stack>
                                {i !== 2 && <Divider />}
                            </Box>
                        ))}
                    </Paper>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12} md={5}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 3, md: 4 },
                            borderRadius: '24px',
                            background: 'linear-gradient(180deg, #111827, #020617)',
                            color: '#fff'
                        }}
                    >
                        <Typography fontWeight={800} sx={{ mb: 3 }}>
                            Quick Commands
                        </Typography>

                        {[
                            { label: 'Add New Student', icon: <Add size={20} /> },
                            { label: 'Post Announcement', icon: <Notification size={20} /> },
                            { label: 'Generate Reports', icon: <DocumentText size={20} /> }
                        ].map((action, i) => (
                            <Button
                                key={i}
                                fullWidth
                                startIcon={action.icon}
                                sx={{
                                    mb: 1.5,
                                    borderRadius: '14px',
                                    py: 1.6,
                                    justifyContent: 'flex-start',
                                    color: '#fff',
                                    background: 'rgba(255,255,255,0.1)',
                                    '&:hover': {
                                        background: 'rgba(255,255,255,0.18)'
                                    }
                                }}
                            >
                                {action.label}
                            </Button>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Dashboard;
