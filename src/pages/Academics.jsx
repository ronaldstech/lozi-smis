import React, { useState } from 'react';
import {
    Box,
    Tab,
    Tabs,
    Typography,
    Paper,
    Fade, Stack,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Book as SubjectsIcon,
    Profile2User as TeacherIcon,
    Calendar as YearIcon
} from 'iconsax-react';
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
                                Academics Management
                            </Typography>
                            <Typography sx={{ color: '#64748b', fontSize: 13, display: 'flex', alignItems: 'center', gap: 1 }}>
                                Curriculum, sessions and teacher allocations
                            </Typography>
                        </Box>

                        <Tabs
                            value={tabIndex}
                            onChange={handleChange}
                            variant={isMobile ? "scrollable" : "standard"}
                            scrollButtons="auto"
                            sx={{
                                minHeight: 40,
                                '& .MuiTabs-flexContainer': {
                                    gap: 1
                                },
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    minHeight: 40,
                                    borderRadius: '10px',
                                    color: '#64748b',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    px: 2,
                                    '&:hover': {
                                        bgcolor: 'rgba(241, 245, 249, 0.8)',
                                        color: '#334155',
                                    },
                                    '&.Mui-selected': {
                                        color: '#6366f1',
                                        bgcolor: 'rgba(99, 102, 241, 0.14)',
                                    }
                                },
                                '& .MuiTabs-indicator': {
                                    display: 'none'
                                }
                            }}
                        >
                            <Tab icon={<TeacherIcon size={18} />} iconPosition="start" label="Allocations" />
                            <Tab icon={<SubjectsIcon size={18} />} iconPosition="start" label="Subjects" />
                            <Tab icon={<YearIcon size={18} />} iconPosition="start" label="Sessions" />
                        </Tabs>
                    </Stack>
                </Paper>

                <Box sx={{
                    p: { xs: 1, md: 2 },
                    minHeight: 500
                }}>
                    <TabPanel value={tabIndex} index={0}>
                        <SubjectTeachers readOnly={isReadOnly} hideHeader={true} />
                    </TabPanel>
                    <TabPanel value={tabIndex} index={1}>
                        <Subjects readOnly={isReadOnly} hideHeader={true} />
                    </TabPanel>
                    <TabPanel value={tabIndex} index={2}>
                        <AcademicYears readOnly={isReadOnly} hideHeader={true} />
                    </TabPanel>
                </Box>
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