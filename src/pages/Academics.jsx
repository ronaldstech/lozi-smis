import React, { useState } from 'react';
import {
    Box,
    Tab,
    Tabs,
    Typography,
    Paper,
    Fade,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    AutoStories as SubjectsIcon, // More relevant icon
    AssignmentInd as TeacherIcon,
    EventAvailable as YearIcon
} from '@mui/icons-material';
import Subjects from './academics/Subjects';
import SubjectTeachers from './academics/SubjectTeachers';
import AcademicYears from './academics/AcademicYears';
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';

function Academics() {
    const { user } = useContext(AppContext);
    const isReadOnly = !user?.isAdmin;

    const [tabIndex, setTabIndex] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <Fade in timeout={800}>
            <Box sx={{
                p: { xs: 0, md: 1 },
                minHeight: '100vh',
                bgcolor: '#f8fafc'
            }}>
                {/* Page Title Section with Decorative Background */}
                <Box sx={{
                    mb: { xs: 2, md: 4 },
                    px: { xs: 2, md: 0 },
                    pt: { xs: 2, md: 0 },
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
                    p: 4,
                    border: '1px solid #e2e8f0'
                }}>
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 900,
                                color: '#0f172a',
                                fontSize: { xs: '1.5rem', md: '2.25rem' },
                                letterSpacing: '-0.02em',
                                mb: 1
                            }}
                        >
                            Academics Management
                        </Typography>
                        <Typography sx={{ color: '#64748b', fontSize: 16, fontWeight: 500, maxWidth: 600 }}>
                            Strategize your curriculum, empower your teachers, and orchestrate academic precision across all sessions.
                        </Typography>
                    </Box>
                    {/* Subtle geometric decoration */}
                    <Box sx={{
                        position: 'absolute',
                        right: -20,
                        top: -20,
                        width: 150,
                        height: 150,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)',
                        zIndex: 0
                    }} />
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        overflow: 'hidden',
                        borderRadius: 4,
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
                        mb: 4
                    }}
                >
                    {/* Tab Navigation Wrapper */}
                    <Box sx={{
                        px: { xs: 1, md: 3 },
                        pt: 2,
                        pb: 1,
                        background: 'rgba(255, 255, 255, 0.5)',
                        borderBottom: '1px solid rgba(226, 232, 240, 0.5)'
                    }}>
                        <Tabs
                            value={tabIndex}
                            onChange={handleChange}
                            variant={isMobile ? "scrollable" : "standard"}
                            scrollButtons="auto"
                            sx={{
                                minHeight: 48,
                                '& .MuiTabs-flexContainer': {
                                    gap: 2
                                },
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    minHeight: 44,
                                    borderRadius: '12px',
                                    color: '#64748b',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    px: 3,
                                    mb: 1,
                                    '&:hover': {
                                        bgcolor: 'rgba(241, 245, 249, 0.8)',
                                        color: '#334155',
                                        transform: 'translateY(-1px)'
                                    },
                                    '&.Mui-selected': {
                                        color: '#6366f1',
                                        bgcolor: 'rgba(99, 102, 241, 0.1)',
                                        boxShadow: 'inset 0 0 0 1px rgba(99, 102, 241, 0.2)'
                                    }
                                },
                                '& .MuiTabs-indicator': {
                                    display: 'none'
                                }
                            }}
                        >
                            <Tab icon={<TeacherIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Teacher Allocations" />
                            <Tab icon={<SubjectsIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Subject Curriculum" />
                            <Tab icon={<YearIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Academic Sessions" />
                        </Tabs>
                    </Box>

                    {/* Content Area */}
                    <Box sx={{
                        p: { xs: 2, md: 4 },
                        minHeight: 500,
                        background: 'linear-gradient(to bottom, transparent, rgba(248, 250, 252, 0.3))'
                    }}>
                        <TabPanel value={tabIndex} index={0}>
                            <SubjectTeachers readOnly={isReadOnly} />
                        </TabPanel>
                        <TabPanel value={tabIndex} index={1}>
                            <Subjects readOnly={isReadOnly} />
                        </TabPanel>
                        <TabPanel value={tabIndex} index={2}>
                            <AcademicYears readOnly={isReadOnly} />
                        </TabPanel>
                    </Box>
                </Paper>
            </Box>
        </Fade>
    );
}

/* Helper Component for cleaner transitions */
function TabPanel({ children, value, index }) {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && (
                <Fade in={true} timeout={400}>
                    <Box>{children}</Box>
                </Fade>
            )}
        </div>
    );
}

export default Academics;