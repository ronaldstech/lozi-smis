const {ListItemText,ListItemIcon, ListItemButton, ListItem, Switch, Button, Dialog, Box, DateField, Stack, Alert,
    FormControl, Select, InputLabel, MenuItem, SelectChangeEvent , TextField, Typography, Input, TablePagination, Drawer, Paper, Table, TableHead, TableRow, TableCell, TableBody, createTheme, ThemeProvider, Checkbox, FormGroup, FormControlLabel} = MaterialUI;
const { useState,useEffect, createContext, useContext } = React;

const Context = createContext({});
let theme = createTheme({
    palette: {
        primary: {
            main: '#3a5a40',
        },
        secondary: {
            main: '#edf2ff',
        },
        orange: {
            main: '#ffa500',
        },
        blue: {
            main: '#0000ff',
        },
    },
    components:{
        MuiButton:{
            styleOverrides:{
                root:{
                    borderRadius:"64px",
                    textTransform:"none",
                    padding:"6px 24px"
                }
            },
            defaultProps:{
                variant:"contained"
            }
        },
        MuiDialog:{
            styleOverrides:{
                root:{
                    borderRadius:"24px",
                    textTransform:"none",
                },
                paper:{
                    borderRadius:"26px",
                    backgroundColor:"#f8f1f6",
                    padding:"24px 12px",
                    boxShadow:"0px 1px 2px 0px rgb(0 0 0 / 30%), 0px 2px 6px 2px rgb(0 0 0 / 15%);"
                }
            },
            defaultProps:{
                elevation:2
            }
        },
        MuiDrawer:{
            styleOverrides:{
                paper:{
                    borderTopLeftRadius:"26px",
                    borderBottomLeftRadius:"26px",
                    backgroundColor:"#f8f1f6",
                    padding:"24px 12px",
                    boxShadow:"0px 1px 2px 0px rgb(0 0 0 / 30%), 0px 2px 6px 2px rgb(0 0 0 / 15%);"
                }
            },
            defaultProps:{
                elevation:2
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: '8px',
                    },
                },
            },
        },
        /*MuiPaper:{
            styleOverrides:{
                root:{
                    borderRadius:"16px",
                    textTransform:"none",
                }
            },
        }*/
    }
});
function Index() {
    const [stage, setStage] = useState("Dashboard");
    const [menus, setMenus] = useState([
        {
            title:"Dashboard",
            icon:"home"
        },
        {
            title:"Staff",
            icon:"group"
        },
        {
            title:"Students",
            icon:"group"
        },
        {
            title:"Academics",
            icon:"shopping_bag"
        },
        {
            title:"Profile",
            icon:"person"
        },
        {
            title:"Log Out",
            icon:"logout"
        }
    ])

    const [user, setUser] = useState({
        id:0,
        username:"user",
        email:"user@gmail.com",
        picture:"pro_file.png",
        district_data:{
            name:""
        }

    });

    const [academic, setAcademic] = useState({
        id:0,
        name:"Academic Name"
    });

    const getUser = () =>{
        $.get("api/", {getUser:"true"}, function(res){
            setUser(res);
        })
    }

    const getAcademic = () =>{
        $.get("api/", {getAcademic:"true"}, function(res){
            setAcademic(res);
            console.log(res);
        })
    }
    useEffect(()=>{
        getUser();
        getAcademic();
    },[])
    return (
        <Context.Provider value={{user, academic, setUser, setAcademic}}>
        <div className="w3-row w3-padding">
            <div className="w3-col w3-border-right w3-padding" style={{
                height:innerHeight+"px",
                overflowY:"auto",
                borderRadius: "15px",
                background: "#333333", 
                color: "white",
                width: "15%",
                position: "fixed"
            }}>
                <div className="w3-padding-large w3-center w3-text-white w3-border-bottom">
                    <img src="images/pro_file.jpg" className="w3-circle" style={{width:"50%"}} />
                    <Typography variant="body1" sx={{mt: 1}} className="w3-text-white">{user.username}</Typography>
                    <font className="w3-text-red">Academic: <font className="w3-text-white">{academic.name}</font></font>
                </div><p></p>
                {menus.map((menu, index) =>(
                    <ListItem key={index} disablePadding>
                        <ListItemButton onClick={() => setStage(menu.title)} 
                        sx={{background: stage == menu.title ? "#6666ff" : "", mb:1, borderRadius: "10px", "&:hover": {background: "#ccccff", color: "black"}}}>
                            <ListItemIcon>
                                <span className="material-symbols-rounded w3-text-white">{menu.icon}</span>
                            </ListItemIcon>
                            <ListItemText primary={menu.title} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </div>
            <div className="w3-rest w3-padding" style={{
                width: "85%",
                position: "fixed",
                left: "15%",
                overflowY: "auto",
                height: innerHeight + "px"
            }}>
                {stage == "Dashboard" && <Dashboard />}
                {stage == "Staff" && <Staff />}
                {stage == "Students" && <Students />}
                {stage == "Academics" && <Academics />}
                {stage == "Profile" && <Profile />}
                {stage == "Log Out" && <LogOut />}
            </div>
        </div>
        </Context.Provider>
    );
}

function Dashboard() {
   const change = () =>{
        window.open("../kkss_open/staff.php");
    }
    return (
        <>
            <div className="w3-padding">
                <h3>Dashboard</h3>
                <hr/>
                <Typography variant="boday1">Day School</Typography>
                <Button variant="contained" sx={{ml:1}} onClick={change} color="error">Change</Button>
            </div>
        </>
    )
}

function Staff() {
    const [search,setSearch] = useState("");

    const handleChange = (event) => {
        setAcc_type(event.target.value);
    };

    const [rows, setRows] = useState([]);

    const getStaff = () => {
		$.get("api/", {getStaff:"true"}, res=>setRows(res))
	};

    useEffect(()=>{
        getStaff();
    },[])

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const print = () => {
        window.open("api/index.php?print_staff","_blank").focus();
    }
    return (
        <div>
            <div className="w3-padding w3-border-bottom">
                <h1>Staff</h1>
            </div>
            <div className="w3-padding">
                <Button onClick={print} variant="contained" color="secondary">Download PDF</Button><br/>
                <Input type="text" value={search} onChange={e=>setSearch(e.target.value)} variant="filled" className="float-right" placeholder="Search table" sx={{width:300,m:1}} />
                <div className="w3-padding">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Profile</TableCell>
                                <TableCell>Account Type</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows
                            .filter(row=>row.username.toLowerCase().includes(search.toLowerCase()))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => (
                                <TableRow key={index} sx={{background: index%2==0 ? "#f0f0f0" : ""}}>
                                    <TableCell>{index+1}</TableCell>
                                    <TableCell>{row.username}</TableCell>
                                    <TableCell>{row.phone}</TableCell>
                                    <TableCell><img src={"images/pro_file.jpg"} style={{width:40}}/></TableCell>
                                    <TableCell>{row.acc_type}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                    <TablePagination
					rowsPerPageOptions={[5, 10, 25, 50, 100,200,500]}
					component="div"
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage} />
                </div>
            </div>
        </div>
        
    );
}

function Students() {
    

    const [form, setForm] = useState("");

    const [gender, setGender] = useState("");

    const handleChange = (event) => {
        setForm(event.target.value);
    };

    const handleChange2 = (event) => {
        setGender(event.target.value);
    };

    const [search,setSearch] = useState("");

    const [rows, setRows] = useState([]);

    const getStudents = () => {
		$.get("api/", {getStudents:"true"}, res=>setRows(res))
	};

    const print = () => {
        window.open("api/index.php?print_students","_blank").focus();
    }

    useEffect(()=>{
        getStudents();
    },[])
    return (
        <div>
            <div className="w3-padding w3-border-bottom">
                <h1>Students</h1>
            </div>
            <div className="w3-padding">
                <Button onClick={print} variant="contained" color="secondary">Download PDF</Button><br/>
                <Input type="text" value={search} onChange={e=>setSearch(e.target.value)} variant="filled" className="float-right" placeholder="Search table" sx={{width:300,m:1}} />
                <div className="w3-padding">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell>First Name</TableCell>
                                <TableCell>Gender</TableCell>
                                <TableCell>Reg No</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Time Registered</TableCell>
                                <TableCell>Registered By</TableCell>
                                <TableCell>Profile</TableCell>
                                <TableCell>Form</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows
                            //.filter(row=>row.username.toLowerCase().includes(search.toLowerCase()))
                            //.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => (
                                <TableRow key={index} sx={{background: index%2==0 ? "#f0f0f0" : ""}}>
                                    <TableCell>{index+1}</TableCell>
                                    <TableCell>{row.last}</TableCell>
                                    <TableCell>{row.first}</TableCell>
                                    <TableCell>{row.gender}</TableCell>
                                    <TableCell>{row.student_reg}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.time_added}</TableCell>
                                    <TableCell>{row.admin_name}</TableCell>
                                    <TableCell><img src={"images/pro_file.jpg"} style={{width:40}}/></TableCell>
                                    <TableCell>{row.form}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </div>
            </div>
        </div>
        
    );
}

function Profile() {
    const {user, setUser} = useContext(Context);

    const [open, setOpen] = useState({
        change: false,
        user: false,
        phone: false,
        email: false
    });

    const changePassword = (e) => {
        e.preventDefault();
        $.post("api/", $("#change_password").serialize(), function(res){
            if(res.status){
                setOpen({...open, change: false});
                Toast(res.message);
            }
            else{
                Toast(res.message);
            }
        })
    }

    const getUser = () =>{
        $.get("api/", {getUser:"true"}, function(res){
            setUser(res);
        })
    }

    const changeUsername = (event) => {
        event.preventDefault();
        $.post("api/", $(event.target).serialize(), response=>{
            try{
                let res = JSON.parse(response);
                if(res.status){
                    Toast("Updated!");
                    setOpen({...open, user: false})
                    getUser();
                }
                else{
                    Toast(res.message)
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    const changeEmail = (event) => {
        event.preventDefault();
        $.post("api/", $(event.target).serialize(), response=>{
            try{
                let res = JSON.parse(response);
                if(res.status){
                    Toast("Updated!");
                    setOpen({...open, email: false})
                    getUser();
                }
                else{
                    Toast(res.message)
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }
    const changePhone = (event) => {
        event.preventDefault();
        $.post("api/", $(event.target).serialize(), response=>{
            try{
                let res = JSON.parse(response);
                if(res.status){
                    Toast("Updated!");
                    setOpen({...open, phone: false})
                    getUser();
                }
                else{
                    Toast(res.message)
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }
    useEffect(()=>{
        getUser();
    },[])
    return (
        <div>
            <h1 className="w3-border-bottom">Profile</h1>
            <div className="w3-padding w3-row">
                <div className="w3-col s3 w3-center w3-padding-small">
                    <img src="images/pro_file.jpg"  style={{width:"100%"}} />
                    <Button variant="contained" color="success" sx={{mt:1}} size="small" onClick={() => setOpen({...open, image: true})}><span className="material-symbols-rounded float-right">photo_camera</span>Change Image</Button>
                </div>
                <div className="w3-col s7 w3-padding-small">
                    <font>Personal Details</font>
                    <div className="w3-padding w3-border-bottom">
                        <font>Username: </font><b>{user.username}</b><span className="material-symbols-rounded float-right" style={{cursor: "pointer"}} onClick={() => setOpen({...open, user: true})}>edit</span>
                    </div><br/>
                    <div className="w3-padding w3-border-bottom">
                        <font>Phone: </font><b>{user.phone}</b><span className="material-symbols-rounded float-right" style={{cursor: "pointer"}} onClick={() => setOpen({...open, phone: true})}>edit</span>
                    </div><br/>
                    <div className="w3-padding w3-border-bottom">
                        <font>Email: </font><b>{user.email}</b><span className="material-symbols-rounded float-right" style={{cursor: "pointer"}} onClick={() => setOpen({...open, email: true})}>edit</span>
                    </div><br/>
                    <div className="w3-padding w3-border-bottom">
                        <font>Role: </font><b>{user.role}</b><font className="float-right" style={{color: "red"}}>Not Editable</font>
                    </div><br/>
                    <div className="w3-padding w3-border-bottom">
                        <Button variant="contained" color="error" onClick={() => setOpen({...open, change: true})}><span className="material-symbols-rounded float-right">lock</span>Change Password</Button>
                    </div>
                </div>
            </div>
            <Dialog
                open={open.user}
                onClose={() => setOpen({...open, user: false})}
            >
                <Box sx={{p: 2, width: 450}}>
                    <div className="w3-padding w3-border-bottom">
                        <Typography>Change Username</Typography>
                    </div>
                    <form className="w3-padding clearfix" onSubmit={changeUsername}>
                        <input type="hidden" name="user_id" value={user.id} />
                        <TextField 
                            label="Username" 
                            name="username_edit" 
                            value={user.username} 
                            onChange={e=>{setUser({...user, username: e.target.value})}} 
                            variant="outlined" 
                            size="small" 
                            fullWidth 
                            sx={{mb: 2, mt: 2}}
                        /><br/>
                        <Button variant="contained" color="success" type="submit">Change Username</Button> 
                        <Button variant="contained" className="float-right" size="small" color="error" onClick={() => setOpen({...open, user: false})}>Cancel</Button> 
                    </form>
                </Box>
            </Dialog>
            <Dialog
                open={open.phone}
                onClose={() => setOpen({...open, phone: false})}
            >
                <Box sx={{p: 2, width: 450}}>
                    <div className="w3-padding w3-border-bottom">
                        <Typography>Change Phone</Typography>
                    </div>
                    <form className="w3-padding clearfix" onSubmit={changePhone}>
                        <input type="hidden" name="user_id" value={user.id} />
                        <TextField 
                            label="Phone" 
                            name="phone_edit" 
                            value={user.phone} 
                            onChange={e=>{setUser({...user, phone: e.target.value})}} 
                            variant="outlined" 
                            size="small" 
                            fullWidth 
                            sx={{mb: 2, mt: 2}}
                        /><br/>
                        <Button variant="contained" color="success" type="submit">Change Phone</Button> 
                        <Button variant="contained" className="float-right" size="small" color="error" onClick={() => setOpen({...open, phone: false})}>Cancel</Button> 
                    </form>
                </Box>
            </Dialog>
            <Dialog
                open={open.email}
                onClose={() => setOpen({...open, email: false})}
            >
                <Box sx={{p: 2, width: 450}}>
                    <div className="w3-padding w3-border-bottom">
                        <Typography>Change Email</Typography>
                    </div>
                    <form className="w3-padding clearfix" onSubmit={changeEmail}>
                        <input type="hidden" name="user_id" value={user.id} />
                        <TextField 
                            label="Email" 
                            name="email_edit" 
                            value={user.email} 
                            onChange={e=>{setUser({...user, email: e.target.value})}} 
                            variant="outlined" 
                            size="small" 
                            fullWidth 
                            sx={{mb: 2, mt: 2}}
                        /><br/>
                        <Button variant="contained" size="small" color="success" type="submit">Change Email</Button>
                        <Button variant="contained" className="float-right" size="small" color="error" onClick={() => setOpen({...open, email: false})}>Cancel</Button> 
                    </form>
                </Box>
            </Dialog>
            <Drawer
                anchor="right"
                open={open.change}
                onClose={() => setOpen({...open, change: false})}
            >
                <Box sx={{p: 2, width: 450}}>
                    <div className="w3-padding w3-border-bottom">
                        <Typography>Change Password</Typography>
                    </div>
                    <form className="w3-padding clearfix" onSubmit={changePassword}>
                        <input type="hidden" name="user_id" value={user.id} />
                        <TextField 
                            label="Current Password" 
                            name="current_password" 
                            type="password" 
                            variant="outlined" 
                            size="small" 
                            fullWidth 
                            required
                        /><hr/>
                        <TextField 
                            label="New Password" 
                            name="new_password" 
                            type="password" 
                            variant="outlined" 
                            size="small" 
                            fullWidth 
                            required
                        /><hr/>
                        <TextField 
                            label="Confirm Password" 
                            name="confirm_password" 
                            type="password" 
                            variant="outlined" 
                            size="small" 
                            fullWidth 
                            required
                        /><hr/>
                        <br/><br/>
                        <Button variant="contained" color="error" type="submit">Change Password</Button> 
                    </form>
                </Box>
            </Drawer>
        </div>

    );
}

function Academics() {
    const [stage, setStage] = useState("Home");
    const [open, setOpen] = useState({
        edit: false, 
        open: false
    });
    const [menus, setMenus] = useState([
        {
            title: "Home",
            icon: "home"
        },
        {
            title: "Subjects",
            icon: "bookmarks"
        },
        {
            title: "Academic Years",
            icon: "cached"
        }
    ]);

    return (
        <div>
            <div className="w3-padding w3-border-bottom">
                <h1>Academics</h1>
            </div>
            <div className="w3-padding">
                {menus.map((menu, index) =>(
                    <Button key={index} variant="outlined" sx={{
                        "&:hover": {background: "#ff3385", color: "white"}, 
                        mr: 1, 
                        color: stage == menu.title ? "white" : "", 
                        borderRadius: "10px",
                        background: stage == menu.title ? "#660029" : ""}} onClick={() => setStage(menu.title)} color="error">
                        <span className="material-symbols-rounded">{menu.icon}</span> {menu.title}
                    </Button>
                        /*<ListItem key={index} disablePadding>
                            <ListItemButton onClick={() => setStage(menu.title)} sx={{background: stage == menu.title ? "#6666ff" : "", borderRadius: "10px"}}>
                                <ListItemIcon>
                                    <span className="material-symbols-rounded w3-text-white">{menu.icon}</span>
                                </ListItemIcon>
                                <ListItemText primary={menu.title} />
                            </ListItemButton>
                        </ListItem>*/
                ))}
            </div>
            <div className="w3-padding">  
                {stage == "Subjects" && <Subjects />}     
                {stage == "Home" && <Home />}     
                {stage == "Academic Years" && <AcademicYears />}     
            </div>
        </div>
    );
    function Subjects() {

        const [rows, setRows] = useState([]);

        const getSubjects = () => {
            $.get("api/", {getSubjects:"true"}, res=>setRows(res))
        }

        const [edit2, setEdit2] = useState({});

        useEffect(getSubjects, []);
        return (
            <div>
                <h1 className="w3-border-bottom">Subjects</h1>
                <div className="">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Subject Name</TableCell>
                                <TableCell>Root</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) =>(
                                <TableRow key={index}>
                                    <TableCell>{index+1}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.root}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }
    function Home() {
        const [sub, setSub] = useState([]);
        const [open, setOpen] = useState({
            upload: false
        });

        const getSubjects = () => {
            $.get("api/", {getSubjectsTeacher:"true"}, res=>setSub(res))
        }

        const [info, setInfo] = useState({
            status: true
        });
        
        const getInfo = () =>{
            $.get("api/", {getInfoUpload: true}, function(response){
                let res = JSON.parse(response);
                if(res.status){
                    setInfo(res.data);
                }
                else{
                    alert("error");
                }
            })
        }
        const [aca_data, setAcaData] = useState({});
        const [rows, setRows] = useState([]);
        const getYourStudents = (form, aca_id, name, term, subId) => {
            $.get("api/", {
                getYourStudents: true, 
                form: form, 
                academic_id: aca_id,
                subject_id: subId
            }, res=>{
                setRows(res)
                setAcaData({form: form, name: name, term: term})
                setOpen({upload: true})
            })
        }

        const getYourStudentsMarks = (form, aca_id, name, term, subId) => {
            const params = new URLSearchParams({
                print_marks: true,
                form: form,
                academic_id: aca_id,
                subject_id: subId
            });
              
            const url = `api/index.php?${params.toString()}`;
            window.open(url, "_blank").focus();
        }
        const updateMark = (id, subject, form, academic_id, value) => {
            if(value == "" || value == null || value == undefined || value >100 || value<0){
                return;
            }
            else{
                //Toast(value);
                $.post("api/", {
                    updateEndTerm: true,
                    id: id,
                    subject: subject,
                    form: form,
                    academic_id: academic_id,
                    value: value
                }, function(response){
                    let res = JSON.parse(response);
                    if(res.status){
                        Toast(res.message);
                    }
                    else{
                        Toast(res.message);
                    }
                })
            }
        }

        const updateAssessment = (id, subject, form, academic_id, value) => {
            if(value == "" || value == null || value == undefined || value >100 || value<0){
                return;
            }
            else{
                //Toast(value);
                $.post("api/", {
                    updateAssessment: true,
                    id: id,
                    subject: subject,
                    form: form,
                    academic_id: academic_id,
                    value: value
                }, function(response){
                    let res = JSON.parse(response);
                    if(res.status){
                        Toast(res.message);
                    }
                    else{
                        Toast(res.message);
                    }
                })
            }
        }
        
        useEffect(()=>{
            getSubjects();
            getInfo();

            const intervalId = setInterval(() => {
                getInfo();
                getSubjects();
            }, 1000);
            return () => clearInterval(intervalId);
        },[])
        return (
            <div>
                <h1>Your subjects</h1>
                <div className="">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Subject</TableCell>
                                <TableCell>Form</TableCell>
                                <TableCell>Term</TableCell>
                                <TableCell>Total Students</TableCell>
                                <TableCell>Registered</TableCell>
                                <TableCell>Dropped</TableCell>
                                <TableCell>Upload {info.status}</TableCell>
                                <TableCell>Export</TableCell>
                                <TableCell>Download</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sub.map((row, index)=>(
                                <TableRow key={index}>
                                    <TableCell>{index+1}</TableCell>
                                    <TableCell>{row.subject_data.name}</TableCell>
                                    <TableCell>{row.form}</TableCell>
                                    <TableCell>{row.academic_data.term}</TableCell>
                                    <TableCell>{row.total_students}</TableCell>
                                    <TableCell>{row.registered}</TableCell>
                                    <TableCell>{row.total_students - row.registered}</TableCell>
                                    <TableCell>
                                        {info.status == "active" ? (
                                            <Button variant="contained" color="blue" size="small" onClick={() => {
                                                getYourStudents(row.form, row.academic_data.id, row.subject_data.name, row.academic_data.term, row.subject_data.id);
                                            }}><span className="material-symbols-rounded" style={{fontSize: "18px"}}>backup</span> Upload</Button>
                                        ) : (
                                           <Typography variant="body1" color="error">Upload closed</Typography>
                                           
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="success" size="small" onClick={() => {
                                            
                                        }}><span className="material-symbols-rounded" style={{fontSize: "18px"}}>download</span> CSV</Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="orange" size="small" onClick={() => {
                                            getYourStudentsMarks(row.form, row.academic_data.id, row.subject_data.name, row.academic_data.term, row.subject_data.id)
                                        }}><span className="material-symbols-rounded" style={{fontSize: "18px"}}>download</span> PDF</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Drawer anchor="right" open={open.upload}>
                        <Box style={{width: "700px"}} className="w3-padding">
                            <Typography variant="h6">Upload Scores for {aca_data.name}, Form {aca_data.form} - Term {aca_data.term} , Academic Year </Typography><hr/>
                            <Button variant="contained" color="error" size="small" onClick={() => setOpen({upload: false})}>Close</Button>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Full Name</TableCell>
                                        <TableCell>Assessment(s)</TableCell>
                                        <TableCell>EndofTerm</TableCell>
                                        <TableCell>Upload</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
									{Array.isArray(rows) ? <>
                                        {rows.map((row, index)=>(
                                            <TableRow key={row.id}>
                                                <TableCell>{index+1}</TableCell>
                                                <TableCell>{row.last.toUpperCase()} {row.first.toUpperCase()}</TableCell>
                                                <TableCell><TextField size="small" name="assessments"
                                                onBlur={(e) => updateAssessment(row.id, row.subject, row.form, row.academic_id, e.target.value)}
                                                label={row.mark.assessments}
                                                /></TableCell>
                                                <TableCell><TextField size="small" name="end_term"
                                                label={row.mark.end_term}
                                                onBlur={(e) => updateMark(row.id, row.subject, row.form, row.academic_id, e.target.value)}/></TableCell>
                                                <TableCell>
                                                    <Button variant="contained" size="small" color="success">
                                                        <span className="material-symbols-rounded" style={{fontSize: "18px"}}>edit</span>
                                                    </Button>
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="contained" size="small" color="error" onClick={() => {}}>
                                                        <span className="material-symbols-rounded" style={{fontSize: "18px"}}>delete</span>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        </>: <>
                                            <Alert severity="error">Rows is not array: Error from server</Alert>
                                            <div>{JSON.stringify(rows)}</div>
                                        </>}
                                    </TableBody>
                            </Table>
                        </Box>
                    </Drawer>
                </div>
            </div>
        );
    }
    function AcademicYears() {

        const [rows, setRows] = useState([]);

        const fetchAcademicYears = () => {
            $.get("api/", {getAcademicYears: 1}, function(res){
                setRows(res);
            });
        };

        useEffect(() => {
            fetchAcademicYears();
        }, []);
        return (
            <div>
                <h1 className="w3-border-bottom">Academic Years</h1>
                <div className="">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Academic Year</TableCell>
                                <TableCell>Term</TableCell>
                                <TableCell>Opening Term</TableCell>
                                <TableCell>Closing Term</TableCell>
                                <TableCell>Next Term Begins On</TableCell>
                                <TableCell>Fees</TableCell>
                                <TableCell>School Requirements</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) =>(
                                <TableRow key={index}>
                                    <TableCell>{index+1}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.term}</TableCell>
                                    <TableCell>{row.opening_term}</TableCell>
                                    <TableCell>{row.closing_term}</TableCell>
                                    <TableCell>{row.next_term_begins}</TableCell>
                                    <TableCell>{row.fees}</TableCell>
                                    <TableCell>{row.requirements}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }
}

function LogOut() {
    const [open, setOpen] = useState({
        logout: true
    });
    return (
        <div>
            <Dialog open={open.logout} onClose={() => setOpen({...open, logout: false})}>
                <Box sx={{width: "400px"}}>
                    <div className="w3-padding w3-border-bottom">
                        <Typography>Log Out</Typography>
                    </div>
                    <div className="w3-padding">
                        <center><Typography>Are you sure you want to log out?</Typography></center>    
                    </div>
                    <div className="w3-padding">
                        <center>
                            <Button variant="contained" color="error" onClick={() => window.location.href = "logout.php"}>Yes</Button>
                            <Button variant="contained" sx={{ml: 1}} color="primary" onClick={() => setOpen({...open, logout: false})}>No</Button>
                        </center>
                    </div>
                </Box>
            </Dialog>
        </div>
    );
}

window.onload = () => {
    ReactDOM.render(<ThemeProvider theme={theme}><Index /></ThemeProvider>, document.getElementById("root"));
}