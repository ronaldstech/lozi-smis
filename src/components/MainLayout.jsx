import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useMediaQuery,
    useTheme,
    Drawer,
    AppBar,
    Toolbar,
    IconButton,
    Box,
    Avatar,
    Stack,
    Menu as MuiMenu
} from '@mui/material';
import {
    Home2,
    People,
    Book,
    Receipt21,
    Profile as PersonIcon,
    Setting2,
    Logout,
    HambergerMenu,
    Teacher,
    Buildings,
    Category
} from 'iconsax-react';
import { useAppContext } from '../context/AppContext';

function MainLayout({ children, menus }) {
    const { user, academic, schoolType, toggleSchoolType, logout } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const getActiveMenu = () => {
        const path = location.pathname;
        if (path === '/' || path === '/portal/staff') return 'Dashboard';
        if (path.includes('/my-classes')) return 'My Classes';
        if (path.includes('/students')) return 'Students';
        if (path.includes('/academics')) return 'Academics';
        if (path.includes('/results')) return 'Results';
        if (path.includes('/profile')) return 'Profile';
        if (path.includes('/workload')) return 'Workload';
        if (path.startsWith('/settings')) return 'Settings';
        if (path.includes('/staff')) return 'Staff';
        return 'Dashboard';
    };

    const activeMenu = getActiveMenu();

    const defaultMenus = [
        { title: "Dashboard", icon: <Home2 variant="Broken" size={22} />, path: "/" },
        { title: "Staff", icon: <Teacher variant="Broken" size={22} />, path: "/staff" },
        { title: "Students", icon: <People variant="Broken" size={22} />, path: "/students" },
        { title: "Academics", icon: <Buildings variant="Broken" size={22} />, path: "/academics" },
        { title: "Results", icon: <Receipt21 variant="Broken" size={22} />, path: "/results" },
        { title: "Profile", icon: <PersonIcon variant="Broken" size={22} />, path: "/profile" },
        { title: "Settings", icon: <Setting2 variant="Broken" size={22} />, path: "/settings" },
        { title: "Log Out", icon: <Logout variant="Broken" size={22} />, action: "logout" }
    ];

    const currentMenus = menus || defaultMenus;

    const handleNavigation = (menu) => {
        if (menu.action === 'logout') {
            logout();
            navigate('/login');
        } else {
            navigate(menu.path);
            if (isMobile) {
                setMobileOpen(false);
            }
        }
    };

    const drawerContent = (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(10px)',
            overflowY: 'auto'
        }}>
            {/* Profile Header Section */}
            <Box sx={{
                position: 'relative',
                padding: '15px 10px 7px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
            }}>
                <Box sx={{ position: 'relative', display: 'inline-block', mb: 1.5 }}>
                    <Avatar
                        src={`/images/profile.jpg`}
                        sx={{
                            width: 100,
                            height: 100,
                            border: '4px solid #fff',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.08)'
                        }}
                    />

                    <Box sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        width: 16,
                        height: 16,
                        backgroundColor: '#10b981',
                        border: '3px solid white',
                        borderRadius: '50%',
                        zIndex: 2,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }} />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', letterSpacing: '-0.5px', mb: 1 }}>
                    {user?.username || 'User'}
                </Typography>

                <Stack spacing={1} sx={{ width: '100%', alignItems: 'center' }}>
                    <Box sx={{
                        px: 2, py: 0.5,
                        borderRadius: '24px',
                        bgcolor: 'rgba(99, 102, 241, 0.12)',
                        backdropFilter: 'blur(4px)',
                    }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                            {user?.role || 'Staff'}
                        </Typography>
                    </Box>
                    <Box sx={{
                        px: 2, py: 0.5,
                        borderRadius: '24px',
                        bgcolor: 'rgba(236, 72, 153, 0.1)',
                        backdropFilter: 'blur(4px)',
                    }}>
                        <Typography variant="caption" sx={{ color: '#ec4899', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {academic.name}
                        </Typography>
                    </Box>
                </Stack>

                {/* School Type Switcher */}
                <Box sx={{ mt: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{
                        display: 'inline-flex',
                        bgcolor: 'rgba(15, 23, 42, 0.04)',
                        borderRadius: '16px',
                        p: 0.6,
                        border: '1px solid rgba(0,0,0,0.02)'
                    }}>
                        <Box
                            onClick={() => toggleSchoolType('day')}
                            sx={{
                                px: 2, py: 0.8,
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                bgcolor: schoolType === 'day' ? '#fff' : 'transparent',
                                color: schoolType === 'day' ? '#6366f1' : '#64748b',
                                boxShadow: schoolType === 'day' ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                                '&:hover': { color: schoolType === 'day' ? '#6366f1' : '#1e293b' }
                            }}
                        >
                            <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em' }}>DAY</Typography>
                        </Box>
                        <Box
                            onClick={() => toggleSchoolType('open')}
                            sx={{
                                px: 2, py: 0.8,
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                bgcolor: schoolType === 'open' ? '#fff' : 'transparent',
                                color: schoolType === 'open' ? '#6366f1' : '#64748b',
                                boxShadow: schoolType === 'open' ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                                '&:hover': { color: schoolType === 'open' ? '#6366f1' : '#1e293b' }
                            }}
                        >
                            <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em' }}>OPEN</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Menu Items Section */}
            <Box sx={{ flexGrow: 1, padding: '10px 12px' }}>
                <List disablePadding>
                    {currentMenus.map((menu, index) => {
                        const isActive = activeMenu === menu.title;
                        return (
                            <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                                <ListItemButton
                                    onClick={() => handleNavigation(menu)}
                                    sx={{
                                        borderRadius: "16px",
                                        position: 'relative',
                                        py: 1,
                                        px: 2,
                                        background: isActive
                                            ? "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)"
                                            : "transparent",
                                        color: isActive ? "white" : "#64748b",
                                        boxShadow: isActive ? "0 10px 20px -5px rgba(99, 102, 241, 0.4)" : "none",
                                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        "&:hover": {
                                            background: isActive
                                                ? "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)"
                                                : "rgba(99, 102, 241, 0.08)",
                                            color: isActive ? "white" : "#1e293b",
                                            transform: isActive ? "scale(1.02)" : "translateX(4px)"
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{
                                        color: isActive ? "white" : "#94a3b8",
                                        minWidth: "40px",
                                        transition: "all 0.3s",
                                        "& svg": {
                                            color: "inherit"
                                        }
                                    }}>
                                        {menu.icon && React.cloneElement(menu.icon, {
                                            variant: isActive ? "Bold" : "Broken",
                                            size: 22,
                                            color: isActive ? "white" : "#94a3b8"
                                        })}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={menu.title}
                                        primaryTypographyProps={{
                                            fontWeight: isActive ? 700 : 500,
                                            fontSize: '0.95rem',
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>

            {/* Footer Section */}
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography
                    variant="caption"
                    sx={{ color: 'text.disabled', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.65rem', opacity: 0.5 }}
                >
                    v1.2.0 • LOZI-SMIS
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Mobile AppBar */}
            {isMobile && (
                <AppBar
                    position="fixed"
                    elevation={0}
                    sx={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderBottom: '1px solid rgba(0,0,0,0.08)',
                        zIndex: 1201, // Above everything but the drawer
                        top: 0,
                        left: 0,
                        right: 0
                    }}
                >
                    <Toolbar sx={{ height: 64 }}>
                        <IconButton
                            onClick={handleDrawerToggle}
                            sx={{
                                mr: 2,
                                color: '#6366f1',
                                bgcolor: 'rgba(99, 102, 241, 0.08)',
                            }}
                        >
                            <HambergerMenu variant="Bold" size={24} />
                        </IconButton>
                        <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 800 }}>
                            {activeMenu}
                        </Typography>
                    </Toolbar>
                </AppBar>
            )}

            {/* Sidebar Drawer */}
            <Box
                component="nav"
                sx={{ width: { md: 280 }, flexShrink: { md: 0 } }}
            >
                {/* Mobile Drawer (Temporary) */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        zIndex: (theme) => theme.zIndex.drawer + 2,
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' },
                    }}
                >
                    {drawerContent}
                </Drawer>

                {/* Desktop Drawer (Permanent/Fixed) */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: 280,
                            position: 'fixed',
                            top: 10,
                            left: 10,
                            height: 'calc(100vh - 20px)',
                            border: 'none',
                            borderRadius: '16px',
                            background: 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                        },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            {/* Content Area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 0, md: 1 },
                    width: { md: `calc(100% - 280px)` },
                    mt: { xs: 7, md: 0 },
                    height: '100vh',
                    overflowY: 'auto'
                }}
            >
                <Box
                    className="glass-card"
                    sx={{
                        minHeight: '100%',
                        p: { xs: 0, md: 1.5 },
                        borderRadius: { xs: 0, md: '16px' }
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
}

export default MainLayout;
