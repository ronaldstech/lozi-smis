import React, { useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Paper,
    Fade
} from '@mui/material';
import {
    Home as HomeIcon,
    Book as BookmarksIcon,
    Setting2 as SettingsIcon,
    Category as SortIcon
} from 'iconsax-react';
import Grading from './settings/Grading';
import Info from './settings/Info';
import System from './settings/System';

function Settings() {
    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <Box sx={{ mb: 2 }} padding={2}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    System Settings
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Manage grading system, school information, and general configurations.
                </Typography>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs
                    value={tabIndex}
                    onChange={handleChange}
                    aria-label="settings tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            minHeight: 48,
                        },
                        '& .Mui-selected': {
                            color: '#6366f1',
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#6366f1',
                            height: 3,
                            borderRadius: '3px 3px 0 0'
                        }
                    }}
                >
                    <Tab icon={<SortIcon size={20} />} iconPosition="start" label="Grading System" />
                    <Tab icon={<BookmarksIcon size={20} />} iconPosition="start" label="School Info" />
                    <Tab icon={<SettingsIcon size={20} />} iconPosition="start" label="System Config" />
                </Tabs>
            </Box>

            <Fade in={true} timeout={500}>
                <Box>
                    {tabIndex === 0 && <Grading />}
                    {tabIndex === 1 && <Info />}
                    {tabIndex === 2 && <System />}
                </Box>
            </Fade>
        </Box>
    );
}

export default Settings;
