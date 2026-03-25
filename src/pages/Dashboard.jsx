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
    ArrowRight2,
    Setting2
} from 'iconsax-react';
import { useAppContext } from '../context/AppContext';

/* ---------------------- Sparkline (Mini Chart) ------------------- */
const Sparkline = ({ color }) => (
    <Box sx={{ width: 80, height: 30, opacity: 0.8 }}>
        <svg viewBox="0 0 80 30" width="100%" height="100%">
            <path
                className="sparkline-path"
                d="M0 25 C 10 25, 15 5, 25 15 S 35 25, 45 10 S 65 5, 80 20"
                fill="none"
                stroke={`url(#gradient-${color.replace(/[^a-zA-Z0-9]/g, '')})`}
                strokeWidth="3"
                strokeLinecap="round"
            />
            <defs>
                <linearGradient id={`gradient-${color.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={color.split(',')[0]} />
                    <stop offset="100%" stopColor={color.split(',')[1]} />
                </linearGradient>
            </defs>
        </svg>
    </Box>
);

/* ---------------------- Stat Card ---------------------- */
const StatCard = ({ title, value, icon, color, loading, trend }) => (
    <Paper
        elevation={0}
        className="glass-premium"
        sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: { xs: 0, md: '28px' },
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                transform: { md: 'translateY(-8px) scale(1.02)' },
                background: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 30px 60px -12px rgba(0,0,0,0.12)',
                '& .icon-box': {
                    transform: 'scale(1.1) rotate(5deg)',
                    filter: 'brightness(1.1)'
                }
            }
        }}
    >
        {/* Subtle mesh overlay for the card */}
        <Box sx={{
            position: 'absolute',
            top: 0, right: 0, width: '120px', height: '120px',
            background: `radial-gradient(circle at top right, ${color.split(',')[0]}15, transparent 70%)`,
            zIndex: 0
        }} />

        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="flex-start" sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                    variant="caption"
                    sx={{
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                        fontSize: '0.65rem'
                    }}
                >
                    {title}
                </Typography>

                {loading ? (
                    <Box sx={{ mt: 2 }}>
                        <CircularProgress size={20} thickness={6} sx={{ color: color.split(',')[0] }} />
                    </Box>
                ) : (
                    <Box sx={{ mt: 0.5 }}>
                        <Typography
                            sx={{
                                fontWeight: 900,
                                fontSize: { xs: '1.6rem', md: '2.1rem' },
                                letterSpacing: '-0.03em',
                                background: `linear-gradient(135deg, ${color})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                lineHeight: 1.1
                            }}
                        >
                            {value}
                        </Typography>

                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1.5 }}>
                            <Sparkline color={color} />
                            <Box sx={{
                                px: 1, py: 0.25,
                                borderRadius: '8px',
                                bgcolor: 'rgba(22, 163, 74, 0.08)',
                                display: 'flex', alignItems: 'center', gap: 0.5
                            }}>
                                <Graph size={12} color="#16a34a" variant="Bold" />
                                <Typography
                                    variant="caption"
                                    sx={{ color: '#16a34a', fontWeight: 800, fontSize: '0.7rem' }}
                                >
                                    {trend.split(' ')[0]}
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                )}
            </Box>

            <Box
                className="icon-box"
                sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, ${color})`,
                    color: '#fff',
                    boxShadow: `0 8px 16px -4px ${color.split(',')[0]}40`,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: 4,
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        backdropFilter: 'blur(4px)'
                    }
                }}
            >
                {React.cloneElement(icon, { size: 24, variant: "Bold", color: "#fff", style: { zIndex: 1 } })}
            </Box>
        </Stack>
    </Paper>
);

/* ---------------------- Dashboard ---------------------- */
function Dashboard() {
    const { user } = useAppContext();
    const [stats, setStats] = useState({
        students: '0',
        teachers: '0',
        classes: '0',
        performance: '0%'
    });
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

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

    const formattedDate = currentTime.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    return (
        <Box className="mesh-bg" sx={{ px: { xs: 0, md: 3 }, py: { xs: 2.5, md: 4 }, minHeight: '100vh' }}>
            {/* Header */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
                sx={{ mb: 5 }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontWeight: 900,
                            fontSize: { xs: '1.8rem', md: '2.5rem' },
                            letterSpacing: '-1.5px',
                            color: '#1e293b',
                            lineHeight: 1.2,
                            textTransform: 'capitalize'
                        }}
                    >
                        Good {currentTime.getHours() < 12 ? 'Morning' : 'Afternoon'}, {user?.username?.split(' ')[0] || 'Admin'}
                    </Typography>
                    <Typography
                        variant="subtitle2"
                        sx={{ color: 'text.secondary', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                        {formattedDate} • System Online
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<Notification variant="Bulk" size={20} />}
                    sx={{
                        borderRadius: '16px',
                        px: 3,
                        py: 1.5,
                        boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.4)'
                    }}
                >
                    View Reports
                </Button>
            </Stack>

            <Grid container columnSpacing={{ xs: 0, sm: 3 }} rowSpacing={{ xs: 2, sm: 3 }} sx={{ mb: 5 }}>
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

            <Grid container columnSpacing={{ xs: 0, sm: 4 }} rowSpacing={{ xs: 3, sm: 0 }}>
                {/* Live Feed */}
                <Grid item xs={12} md={7}>
                    <Paper
                        elevation={0}
                        className="glass-premium"
                        sx={{
                            p: { xs: 3, md: 4 },
                            borderRadius: { xs: 0, md: '32px' },
                            height: '100%'
                        }}
                    >
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                            <Typography sx={{ fontWeight: 900, fontSize: '1.25rem', color: '#1e293b', letterSpacing: '-0.5px' }}>
                                Live Activities
                            </Typography>
                            <Box sx={{ p: 1, borderRadius: '12px', bgcolor: 'rgba(0,0,0,0.03)', cursor: 'pointer' }}>
                                <ArrowRight2 size={18} color="#64748b" />
                            </Box>
                        </Stack>

                        <Stack spacing={0} sx={{ position: 'relative' }}>
                            {[
                                { user: 'System', action: 'Grading schema updated for Term 2.', time: '2h ago', color: '#6366f1', icon: <Setting2 variant="Bold" /> },
                                { user: 'Admin', action: '5 new students enrolled in Class 10A.', time: '5h ago', color: '#10b981', icon: <People variant="Bold" /> },
                                { user: 'Staff', action: 'Mid-term results published successfully.', time: '1d ago', color: '#f59e0b', icon: <DocumentText variant="Bold" /> }
                            ].map((activity, i) => (
                                <Box key={i} sx={{ position: 'relative', pb: 4 }}>
                                    {/* Timeline Line */}
                                    {i !== 2 && (
                                        <Box sx={{
                                            position: 'absolute', left: 20, top: 40, bottom: 0,
                                            width: '2px', bgcolor: 'rgba(0,0,0,0.05)', borderRadius: '1px'
                                        }} />
                                    )}

                                    <Stack direction="row" spacing={2.5}>
                                        <Box sx={{
                                            width: 42, height: 42, borderRadius: '14px',
                                            bgcolor: `${activity.color}15`, color: activity.color,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0, zIndex: 1, border: '1px solid rgba(255,255,255,0.8)'
                                        }}>
                                            {React.cloneElement(activity.icon, { size: 20, color: 'currentColor' })}
                                        </Box>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#334155' }}>{activity.user}</Typography>
                                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled' }}>{activity.time}</Typography>
                                            </Stack>
                                            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, fontWeight: 500, lineHeight: 1.5 }}>
                                                {activity.action}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>

                {/* Quick Actions Grid */}
                <Grid item xs={12} md={5}>
                    <Box sx={{ height: '100%' }}>
                        <Typography sx={{ fontWeight: 900, fontSize: '1.25rem', mb: 3, color: '#1e293b', letterSpacing: '-0.5px' }}>
                            Quick Commands
                        </Typography>

                        <Grid container spacing={2}>
                            {[
                                { label: 'Add Student', icon: <Add variant="Bold" />, color: '#6366f1', desc: 'New admission' },
                                { label: 'Broadcast', icon: <Notification variant="Bold" />, color: '#ec4899', desc: 'Post notice' },
                                { label: 'Reports', icon: <DocumentText variant="Bold" />, color: '#f59e0b', desc: 'Gen results' },
                                { label: 'Settings', icon: <Setting2 variant="Bold" />, color: '#10b981', desc: 'School config' }
                            ].map((action, i) => (
                                <Grid item xs={6} key={i}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2.5,
                                            borderRadius: '24px',
                                            bgcolor: 'rgba(255,255,255,0.5)',
                                            border: '1px solid rgba(255,255,255,0.8)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                bgcolor: '#fff',
                                                transform: 'translateY(-5px)',
                                                boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)',
                                                '& .action-icon': { bgcolor: action.color, color: '#fff' }
                                            }
                                        }}
                                    >
                                        <Box
                                            className="action-icon"
                                            sx={{
                                                width: 44, height: 44, borderRadius: '14px',
                                                bgcolor: '#fff', color: action.color,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                mb: 2, transition: 'all 0.3s ease',
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.03)'
                                            }}
                                        >
                                            {React.cloneElement(action.icon, { size: 24, color: 'currentColor' })}
                                        </Box>
                                        <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e293b' }}>{action.label}</Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{action.desc}</Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>

                        <Paper
                            elevation={0}
                            sx={{
                                mt: 3,
                                p: 3,
                                borderRadius: '24px',
                                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                                color: '#fff',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                <Typography sx={{ fontWeight: 800, mb: 0.5 }}>System Insights</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 500 }}>
                                    Your school is performing 15% better than last semester. Keep it up!
                                </Typography>
                            </Box>
                            <Graph variant="Bulk" size={80} style={{ position: 'absolute', right: -10, bottom: -10, opacity: 0.1, color: '#fff' }} />
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Dashboard;
