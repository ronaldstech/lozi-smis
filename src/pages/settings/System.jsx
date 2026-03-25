import React, { useState, useEffect } from 'react';
import {
    Typography,
    Switch,
    Box,
    Paper,
    FormControlLabel,
    Alert
} from '@mui/material';
import { Setting2 } from 'iconsax-react';

import { API_URL } from '../../config';

function System() {
    const [info, setInfo] = useState({
        status: false // Use boolean for easier switching, handle 'active'/'inactive' in logic
    });

    const getInfo = async () => {
        try {
            const res = await fetch(`${API_URL}?getInfoUpload=true`);
            const text = await res.text();
            // API seems to return standard response wrap
            const data = JSON.parse(text);
            if (data.status) {
                setInfo(data.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const activate_grade = async (status) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: new URLSearchParams({ change_upload_status: status }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            const data = await response.json();
            if (data.status) {
                getInfo();
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getInfo();
    }, []);

    return (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', maxWidth: 600 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
                <Box sx={{
                    p: 1, borderRadius: 2,
                    bgcolor: '#f1f5f9', color: '#475569',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <Setting2 size={22} color="#475569" variant="Bold" />
                </Box>
                <Box>
                    <Typography variant="h6" fontWeight={700}>System Configuration</Typography>
                    <Typography variant="body2" color="textSecondary">Global system settings and toggles.</Typography>
                </Box>
            </Box>

            <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Grade Upload Portal</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                    Enable or disable the ability for teachers to upload grades. When disabled, the upload feature will be locked.
                </Typography>

                <FormControlLabel
                    control={
                        <Switch
                            checked={info.status === "active"}
                            onChange={(e) => {
                                const newStatus = e.target.checked ? "active" : "inactive";
                                setInfo({ ...info, status: newStatus });
                                activate_grade(newStatus);
                            }}
                            color="success"
                        />
                    }
                    label={
                        <Typography fontWeight={600} sx={{ color: info.status === "active" ? "#166534" : "#991b1b" }}>
                            {info.status === "active" ? "Uploads Enabled" : "Uploads Disabled"}
                        </Typography>
                    }
                />
            </Box>

            {info.status === "active" && (
                <Alert severity="warning" sx={{ mt: 3, borderRadius: 2 }}>
                    Grade uploading is currently <strong>active</strong>. Teachers can make changes to student results.
                </Alert>
            )}

        </Paper>
    )
}

export default System;
