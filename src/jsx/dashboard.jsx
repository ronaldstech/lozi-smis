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
            title:"Results",
            icon:"receipt"
        },
        {
            title:"Profile",
            icon:"person"
        },
        {
            title: "Settings",
            icon:"settings"
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
                    <img src="images/jac.jpg" className="w3-circle" style={{width:"50%"}} />
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
                {stage == "Results" && <Results />}
                {stage == "Profile" && <Profile />}
                {stage == "Settings" && <Settings />}
                {stage == "Log Out" && <LogOut />}
            </div>
        </div>
        </Context.Provider>
    );
}

function Dashboard() {
   const change = () =>{
        window.open("../kkss_open/login.php");
    }
    return (
        <>
            <div className="w3-padding">
                <h3>Dashboard</h3>
                <hr/>
                <Typography variant="boday1">Day School</Typography>
                <Button variant="contained" sx={{ml:1}} onClick={change} color="error">Change</Button><br></br><br></br>
            </div>
        </>
    )
}

function Staff() {
    const [open, setOpen] = useState({
        add: false,
        edit: false
    })

    const saveStaff = (event) => {
        event.preventDefault();
        $.post("api/", $(event.target).serialize(), response=>{
            try{
                let res = JSON.parse(response);
                if(res.status){
                    Toast("Added!");
                    setOpen({...open, add: false})
                    getStaff();
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

    const [acc_type, setAcc_type] = useState("");

    const [active, setActive] = useState({});

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

    const updateStaff = (event) => {
        event.preventDefault();
        $.post("api/", $(event.target).serialize(), response=>{
            try{
                let res = JSON.parse(response);
                if(res.status){
                    Toast("Updated!");
                    setOpen({...open, edit: false})
                    getStaff();
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

    const activate = (id, status) => {
        $.post("api/", {staff_id:id, status:status}, response=>{
            try{
                let res = JSON.parse(response);
                if(res.status){
                    Toast(status=="active"?"Activated!":"Deactivated!");
                    getStaff();
                }
                else{
                    Toast(res.message)
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
       //alert(id);
    }

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
                <Button variant="contained" color="success" onClick={() => setOpen({...open, add: true})}>Add New</Button> <Button onClick={print} variant="contained" color="secondary">Download PDF</Button><br/>
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
                                <TableCell>Action</TableCell>
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
                                    <TableCell>
                                        <Button variant="contained" size="small" color={row.status=="active"?"success":"error"} onClick={e=>{
                                            setActive(row)
                                            setOpen({...open, edit: true})
                                        }}>Edit</Button> 
                                    </TableCell>
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
                <Dialog open={open.add} onClose={() => setOpen({...open, add: false})}>
                    <Box sx={{width: "400px"}}>
                        <div className="w3-padding w3-border-bottom">
                            <Typography>Add New Staff Member</Typography>
                        </div>
                        <form className="w3-padding clearfix" onSubmit={saveStaff}>
                            <TextField label="Username" name="username_add" variant="outlined" size="small" sx={{mb:2}} fullWidth />
                            <TextField label="Phone" name="phone_add" variant="outlined" size="small" sx={{mb:2}} fullWidth />
                            <FormControl fullWidth>
                                <InputLabel id="acc_type">Account Type</InputLabel>
                                <Select
                                    labelId="acc_type"
                                    name="acc_type_add"
                                    id="acc_type"
                                    value={acc_type}
                                    label="Account Type"
                                    onChange={handleChange}
                                    size="small"
                                    sx={{mb:2}}
                                >
                                    <MenuItem value="teacher">Teacher</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                </Select>
                                </FormControl>
                            <Button variant="contained" color="error" onClick={() => setOpen({...open, add: false})}>Cancel</Button> 
                            <Button type="submit" className="w3-right" variant="contained" color="success">Save</Button>
                        </form>
                    </Box>
                </Dialog>
                <Drawer
                    anchor="right"
                    open={open.edit}
                    onClose={() => setOpen({...open, edit: false})}
                >
                    <Box sx={{p: 2, width: 450}}>
                        <div className="w3-padding w3-border-bottom">
                            <Typography>Edit Staff Member</Typography>
                        </div>
                        <center><img src="images/pro_file.jpg" className="w3-circle" style={{width:"50%"}} /></center>
                        <br/>
                        <form className="w3-padding clearfix" onSubmit={updateStaff}>
                            <input type="hidden" name="staff_id_edit" value={active.id} />
                            <TextField 
                            label="Username" 
                            name="username_edit" 
                            value={active.username}
                            onChange={e=>{setActive({...active, username: e.target.value})}}
                            variant="outlined" 
                            size="small" 
                            sx={{mb:2}} 
                            fullWidth /><hr/>
                            <TextField 
                            label="Phone" 
                            name="phone_edit" 
                            value={active.phone} 
                            onChange={e=>{setActive({...active, phone: e.target.value})}} 
                            variant="outlined" 
                            size="small" 
                            sx={{mb:2}} 
                            fullWidth /><hr/>
                            <FormControl fullWidth>
                                <InputLabel id="acc_type">Account Type</InputLabel>
                                <Select
                                    labelId="acc_type"
                                    name="acc_type_edit"
                                    id="acc_type"
                                    value={active.acc_type}
                                    label="Account Type"
                                    onChange={e=>{setActive({...active, acc_type: e.target.value})}}
                                    size="small"
                                    sx={{mb:2}}
                                >
                                    <MenuItem value="teacher">Teacher</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                </Select>
                            </FormControl><hr/>
                            <font>Status: </font><font>{active.status}</font>
                            <Switch className="float-right" 
                            checked={active.status == "active" ? true : false} 
                            onChange={e=>{
                                setActive({...active, status: e.target.checked ? "active" : "inactive"})
                                activate(active.id, e.target.checked ? "active" : "inactive")
                            }}/>
                            <br/><br/>
                            <Button variant="contained" color="error" onClick={() => setOpen({...open, edit: false})}>Cancel</Button> 
                            <Button type="submit" className="w3-right" variant="contained" color="success">Save</Button>
                        </form>
                    </Box>
                </Drawer>
            </div>
        </div>
        
    );
}

function Students() {
    const [open, setOpen] = useState({
        add: false,
        edit: false,
        delet: false
    })

    const saveStudent = (event) => {
        event.preventDefault();
        $.post("api/", $(event.target).serialize(), response=>{
            try{
                let res = JSON.parse(response);
                if(res.status){
                    Toast("Added!");
                    setOpen({...open, add: false})
                    getStudents();
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

    const [active, setActive] = useState({});

    const updateStudent = (event) => {
        event.preventDefault();
        $.post("api/", $(event.target).serialize(), response=>{
            try{
                let res = JSON.parse(response);
                if(res.status){
                    Toast("Updated!");
                    setOpen({...open, edit: false})
                    getStudents();
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

    const activate = (id, status) => {
        $.post("api/", {student_id:id, status_edit:status}, response=>{
            try{
                let res = JSON.parse(response);
                if(res.status){
                    Toast(status=="active"?"Activated!":"Deactivated!");
                    getStudents();
                }
                else{
                    Toast(res.message)
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
       //alert(id);
    }

    const getStudents = () => {
		$.get("api/", {getStudents:"true"}, res=>setRows(res))
	};
	
	const deleteStudent = (id) =>{
	    $.post("api/", {student_id:id, deleteStudent:true}, response=>{
	        try{
                let res = JSON.parse(response);
                if(res.status){
                    Toast(res.message);
                    setOpen({...open, delet:false});
                    getStudents();
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
                <Button variant="contained" color="success" onClick={() => setOpen({...open, add: true})}>Add New</Button> <Button onClick={print} variant="contained" color="secondary">Download PDF</Button><br/>
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
                                <TableCell>Profile</TableCell>
                                <TableCell>Form</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Edit</TableCell>
                                <TableCell>Action</TableCell>
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
                                    <TableCell><img src={"images/pro_file.jpg"} style={{width:40}}/></TableCell>
                                    <TableCell>{row.form}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" size="small" color={row.status=="active"?"success":"error"} onClick={e=>{
                                            setActive(row)
                                            setOpen({...open, edit: true})
                                        }}>Edit</Button> 
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" size="small" color="error" onClick={e=>{
                                            setActive(row)
                                            setOpen({...open, delet: true})
                                        }}>Delete</Button> 
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </div>
                <Dialog open={open.add} onClose={() => setOpen({...open, add: false})}>
                    <Box sx={{width: "400px"}}>
                        <div className="w3-padding w3-border-bottom">
                            <Typography>Add New Student</Typography>
                        </div>
                        <form className="w3-padding clearfix" onSubmit={saveStudent}>
                            <TextField label="First Name" name="fname_add" variant="outlined" size="small" sx={{mb:2}} fullWidth />
                            <TextField label="Middle Name" name="mname_add" variant="outlined" size="small" sx={{mb:2}} fullWidth />
                            <TextField label="Last Name" name="lname_add" variant="outlined" size="small" sx={{mb:2}} fullWidth />
                            <FormControl fullWidth>
                                <InputLabel id="form">Form</InputLabel>
                                <Select
                                    labelId="form_add"
                                    name="form_add"
                                    id="form_add"
                                    value={form}
                                    label="Form"
                                    onChange={handleChange}
                                    size="small"
                                    sx={{mb:2}}
                                >
                                    <MenuItem value={1}>Form 1</MenuItem>
                                    <MenuItem value={2}>Form 2</MenuItem>
                                    <MenuItem value={3}>Form 3</MenuItem>
                                    <MenuItem value={4}>Form 4</MenuItem>
                                </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel id="gender">Gender</InputLabel>
                                    <Select
                                        labelId="gender_add"
                                        name="gender_add"
                                        id="gender_add"
                                        value={gender}
                                        label="Gender"
                                        onChange={handleChange2}
                                        size="small"
                                        sx={{mb:2}}
                                    >
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                    </Select>
                                </FormControl>
                            <Button variant="contained" color="error" onClick={() => setOpen({...open, add: false})}>Cancel</Button> 
                            <Button type="submit" className="w3-right" variant="contained" color="success">Save</Button>
                        </form>
                    </Box>
                </Dialog>
                
                <Dialog open={open.delet} onClose={() => setOpen({...open, delet: false})}>
                    <Box sx={{width: "400px"}}>
                        <div className="w3-padding w3-border-bottom">
                            <Typography>Delete this student? {active.first} {active.last}</Typography>
                        </div>
                        <div className="w3-padding">
                            <Button onClick={() => setOpen({...open, delet: false})}>Cancel</Button><Button color="error" className="float-right" onClick={() => {deleteStudent(active.id)}}>Yes</Button>
                        </div>
                    </Box>
                </Dialog>

                <Drawer
                    anchor="right"
                    open={open.edit}
                    onClose={() => setOpen({...open, edit: false})}
                >
                    <Box sx={{p: 2, width: 450}}>
                        <div className="w3-padding w3-border-bottom">
                            <Typography>Edit Student</Typography>
                        </div>
                        <center><img src="images/pro_file.jpg" className="w3-circle" style={{width:"50%"}} /></center>
                        <br/>
                        <form className="w3-padding clearfix" onSubmit={updateStudent}>
                            <input type="hidden" name="student_id_edit" value={active.id} />
                            <TextField 
                            label="First Name" 
                            name="fname_edit" 
                            value={active.first}
                            onChange={e=>{setActive({...active, first: e.target.value})}}
                            variant="outlined" 
                            size="small" 
                            fullWidth /><hr/>
                            <TextField 
                            label="Middle Name" 
                            name="mname_edit" 
                            value={active.middle} 
                            onChange={e=>{setActive({...active, middle: e.target.value})}} 
                            variant="outlined" 
                            size="small" 
                            fullWidth /><hr/>
                            <TextField 
                            label="Last Name" 
                            name="lname_edit" 
                            value={active.last} 
                            onChange={e=>{setActive({...active, last: e.target.value})}} 
                            variant="outlined" 
                            size="small" 
                            fullWidth /><hr/>
                            <FormControl fullWidth>
                                <InputLabel id="form_edit">Form</InputLabel>
                                <Select
                                    labelId="form_edit"
                                    name="form_edit"
                                    id="form_edit"
                                    value={active.form}
                                    label="Form"
                                    onChange={e=>{setActive({...active, form: e.target.value})}}
                                    size="small"
                                >
                                    <MenuItem value={1}>Form 1</MenuItem>
                                    <MenuItem value={2}>Form 2</MenuItem>
                                    <MenuItem value={3}>Form 3</MenuItem>
                                    <MenuItem value={4}>Form 4</MenuItem>
                                </Select>
                            </FormControl><hr/>
                            <FormControl fullWidth>
                                <InputLabel id="gender_edit">Gender</InputLabel>
                                <Select
                                    labelId="gender_edit"
                                    name="gender_edit"
                                    id="gender_edit"
                                    value={active.gender}
                                    label="Gender"
                                    onChange={e=>{setActive({...active, gender: e.target.value})}}
                                    size="small"
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                </Select>
                            </FormControl><hr/>
                            <TextField 
                            label="Registration No." 
                            name="reg_edit" 
                            value={active.student_reg}
                            onChange={e=>{setActive({...active, student_reg: e.target.value})}}
                            variant="outlined" 
                            size="small" 
                            fullWidth /><hr/>
                            <font>Status: </font><font>{active.status}</font>
                            <Switch className="float-right" 
                            checked={active.status == "active" ? true : false} 
                            onChange={e=>{
                                setActive({...active, status: e.target.checked ? "active" : "inactive"})
                                activate(active.id, e.target.checked ? "active" : "inactive")
                            }}/><hr/>
                            <br/><br/>
                            <Button variant="contained" color="error" onClick={() => setOpen({...open, edit: false})}>Cancel</Button> 
                            <Button type="submit" className="w3-right" variant="contained" color="success">Save</Button>
                        </form>
                    </Box>
                </Drawer>
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
    const [stage, setStage] = useState("Subject Teachers");
    const [open, setOpen] = useState({
        edit: false, 
        open: false
    });
    const [menus, setMenus] = useState([
        {
            title: "Subject Teachers",
            icon: "sort"
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
                {stage == "Subject Teachers" && <SubjectTeachers />}     
                {stage == "Academic Years" && <AcademicYears />}     
            </div>
        </div>
    );
    function Subjects() {
        const [root, setRoot] = useState("");

        const [open_sub, setOpen_sub] = useState({
            add: false,
            edit: false
        });

        const handleChange = (event) => {
            setRoot(event.target.value);
        };

        const saveSubject = (event) => {
            event.preventDefault();
            $.post("api/", $(event.target).serialize(), response=>{
                try{
                    let res = JSON.parse(response);
                    if(res.status){
                        Toast("Added!");
                        setOpen({...open_sub, add: false});
                        getSubjects();
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

        const [rows, setRows] = useState([]);

        const getSubjects = () => {
            $.get("api/", {getSubjects:"true"}, res=>setRows(res))
        }

        const [edit2, setEdit2] = useState({});

        const updateSubject = (event) => {
            event.preventDefault();
            $.post("api/", $(event.target).serialize(), response=>{
                try{
                    let res = JSON.parse(response);
                    if(res.status){
                        Toast("Edited!");
                        setOpen({...open_sub, edit: false});
                        getSubjects();
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

        const activate = (id, status) => {
            $.post("api/", {subject_id:id, status_edit:status}, response=>{
                try{
                    let res = JSON.parse(response);
                    if(res.status){
                        Toast(status=="active"?"Activated!":"Deactivated!");
                        getSubjects();
                    }
                    else{
                        Toast(res.message)
                    }
                }
                catch(E){
                    alert(E.toString()+response);
                }
            })
           //alert(id);
        }

        useEffect(getSubjects, []);
        return (
            <div>
                <h1 className="w3-border-bottom">Subjects</h1>
                <div className="">
                    <Button variant="contained" color="success" sx={{mb: 2}} onClick={() => setOpen_sub({...open_sub, add: true})}>Add Subject</Button>
                    <Dialog open={open_sub.add} onClose={() => setOpen_sub({...open_sub, add: false})}>
                        <Box sx={{width: "400px"}}>
                            <div className="w3-padding w3-border-bottom">
                                <Typography>Add New Subject</Typography>
                            </div>
                            <form className="w3-padding clearfix" onSubmit={saveSubject}>
                                <TextField label="Subject Name" name="subject_name" variant="outlined" size="small" sx={{mb:2}} fullWidth />
                                <FormControl fullWidth>
                                    <InputLabel id="root">Root</InputLabel>
                                    <Select
                                        labelId="root_add"
                                        name="root_add"
                                        id="root_add"
                                        value={root}
                                        label="Root"
                                        onChange={handleChange}
                                        size="small"
                                        sx={{mb:2}}
                                    >
                                        <MenuItem value="science">Science</MenuItem>
                                        <MenuItem value="language">Language</MenuItem>
                                        <MenuItem value="humanity">Humanity</MenuItem>
                                    </Select>
                                </FormControl>
                                <Button variant="contained" color="error" onClick={() => setOpen_sub({...open_sub, add: false})}>Cancel</Button> 
                                <Button type="submit" className="w3-right" variant="contained" color="success">Save</Button>
                            </form>
                        </Box>
                    </Dialog>
                </div>
                <div className="">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Subject Name</TableCell>
                                <TableCell>Root</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) =>(
                                <TableRow key={index}>
                                    <TableCell>{index+1}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.root}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" size="small" sx={{mr: 1}} color={row.status == "active" ? "success" : "error"} onClick={e=>{
                                            e.preventDefault();
                                            setEdit2(row);
                                            setOpen_sub({...open_sub, edit: true})
                                        }}>Edit</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Drawer open={open_sub.edit} onClose={() => setOpen_sub({...open_sub, edit: false})} anchor="right">
                        <Box sx={{width: "450px"}}>
                            <div className="w3-padding w3-border-bottom">
                                <Typography>Edit Subject</Typography>
                            </div>
                            <form className="w3-padding-large clearfix" onSubmit={updateSubject}>
                                <input type="hidden" name="subject_id_edit" value={edit2.id} />
                                <TextField label="Subject Name" 
                                    name="subject_name_edit" 
                                    variant="outlined" 
                                    value={edit2.name}
                                    onChange={e=>{setEdit2({...edit2, name: e.target.value})}}
                                    size="small" sx={{mb:2}} fullWidth />
                                <FormControl fullWidth>
                                    <InputLabel id="root">Root</InputLabel>
                                    <Select
                                        labelId="root_edit"
                                        name="root_edit"
                                        id="root_edit"
                                        value={edit2.root}
                                        label="Root"
                                        onChange={e=>{setEdit2({...edit2, root: e.target.value})}}
                                        size="small"
                                        sx={{mb:2}}
                                    >
                                        <MenuItem value="science">Science</MenuItem>
                                        <MenuItem value="language">Language</MenuItem>
                                        <MenuItem value="humanity">Humanity</MenuItem>
                                    </Select>
                                </FormControl>
                                <hr/>
                                <Switch checked={edit2.status == "active"} onChange={e=>{
                                    setEdit2({...edit2, status: e.target.checked ? "active" : "inactive"})
                                    activate(edit2.id, e.target.checked ? "active" : "inactive")
                                    }}></Switch>
                                <label className="float-right">{edit2.status == "active" ? "Active" : "Inactive"}</label>
                                <hr/>
                                <Button variant="contained" color="error" onClick={() => setOpen_sub({...open_sub, edit: false})}>Cancel</Button> 
                                <Button type="submit" className="w3-right" variant="contained" color="success">Save</Button>
                            </form>
                        </Box>
                    </Drawer>
                </div>
            </div>
        );
    }
    function SubjectTeachers() {
        const [rows, setRows] = useState([]);

        const [academic, setAcademic] = useState({
            id:0,
            name:"Academic Name"
        });

        const [open, setOpen] = useState({
            add: false,
            addsub: false
        });

        const [manage, setManage] = useState({});

        const getStaff = () => {
            $.get("api/", {getStaffA:academic.id}, res=>{
                setRows(res);
            })
        };

        const [subs, setSubs] = useState([]);

        const getSubs = () => {
            $.get("api/", {getSubs:"true"}, res=>setSubs(res))
        };

        const getAcademic = () =>{
            $.get("api/", {getAcademic:"true"}, function(res){
                setAcademic(res);
                console.log(res);
            })
        }

        const myFunction = () => {
            var x = document.getElementById("Demo");
            if (x.className.indexOf("w3-show") == -1) { 
              x.className += " w3-show";
            } else {
              x.className = x.className.replace(" w3-show", "");
            }
        }

        const [teacher, setTeacher] = useState({
            id:0,
            name:"Teacher Name"
        })
        const [form, setForm] = useState({
            form:0
        });

        const select_subject = (subj, event) => {
            //alert(subj.id);
            $.post("api/", {teacher_id: manage.id, subject_id: subj.id, form: form.form, academic_id: academic.id}, res=>{
                let ms = JSON.parse(res);
                Toast(ms.message);
                getSubt(manage.id, academic.id);
            })
        }

        const [subt, setSubt] = useState([]);
        const getSubt = (id, academic_id) => {
            $.get("api/", {getSubt:"true", academic_id: academic_id, teacher_id: id}, res=>setSubt(res))
        };

        const handleDelete = (id) => {
            $.post("api/", {deleteSubt: "true", id: id}, res=>{
                let ms = JSON.parse(res);
                if(ms.status){
                    Toast(ms.message);
                    getSubt(manage.id, academic.id);
                    getStaff();
                }
                else{
                    Toast(ms.message);
                }
            })
        }
        
        useEffect(()=>{
            getStaff();
            getAcademic();
        },[])
        return (
            <div>
                <h1>Subject Teachers</h1>
                <div className="">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Teacher</TableCell>
                                <TableCell>Term</TableCell>
                                <TableCell>Total Subs</TableCell>
                                <TableCell>Subject IDs</TableCell>
                                <TableCell>Academic Year</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) =>(
                                <TableRow key={index}>
                                    <TableCell>{index+1}</TableCell>
                                    <TableCell>{row.username}</TableCell>
                                    <TableCell>{academic.term}</TableCell>
                                    <TableCell>{row.subject_count}</TableCell>
                                    <TableCell>{row.subjects.join(", ")}</TableCell>
                                    <TableCell>{academic.name}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" size="small" sx={{mr: 1}} color={row.status == "active" ? "success" : "primary"} onClick={() => {
                                            setOpen({...open, add: true});
                                            setManage(row);
                                            getSubt(row.id, academic.id);
                                        }}>Manage</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Drawer open={open.add} onClose={() => setOpen({...open, add: false})} anchor="right">
                        <Box sx={{width : '600px'}}>
                            <div className="w3-padding border-bottom">
                                <Typography variant="body1"> Manage Subjects for {manage.username} <span style={{cursor: 'pointer', float: 'right'}} className="material-symbols-rounded w3-hover-text-red float-right" onClick={() => setOpen({...open, add: false})}>cancel</span></Typography>
                            </div>
                            <div className="w3-padding w3-dropdown-click">
                                <Button variant="contained" color="success" onClick={myFunction}>Add</Button>
                                <div id="Demo" className="w3-dropdown-content w3-padding w3-round-large w3-animate-zoom">
                                    <Button variant="text" className="btn-block" sx={{mb:0.2}} color="error" onClick={() => {
                                        setOpen({...open, addsub: true})
                                        getSubs();
                                        setForm({form: 1})
                                    }}>Form 1</Button>
                                    <Button variant="text" className="btn-block" sx={{mb:0.2}} color="error" onClick={() => {
                                        setOpen({...open, addsub: true})
                                        getSubs();
                                        setForm({form: 2})
                                    }}>Form 2</Button>
                                    <Button variant="text" className="btn-block" sx={{mb:0.2}} color="error" onClick={() => {
                                        setOpen({...open, addsub: true})
                                        getSubs();
                                        setForm({form: 3})
                                    }}>Form 3</Button>
                                    <Button variant="text" className="btn-block" sx={{mb:0.2}} color="error" onClick={() => {
                                        setOpen({...open, addsub: true})
                                        getSubs();
                                        setForm({form: 4})
                                    }}>Form 4</Button>
                                </div>
                            </div>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Subject</TableCell>
                                        <TableCell>Term</TableCell>
                                        <TableCell>Form</TableCell>
                                        <TableCell>Academic Year</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {subt.map((row, index)=>(
                                        <TableRow key={index}>
                                            <TableCell>{index+1}</TableCell>
                                            <TableCell>{row.subject_data.name}</TableCell>
                                            <TableCell>{academic.term}</TableCell>
                                            <TableCell>{row.form}</TableCell>
                                            <TableCell>{academic.name}</TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="error" size="small" sx={{mr: 1}} onClick={() => handleDelete(row.id)}><span style={{fontSize: 16}} className="material-symbols-rounded">delete</span>Delete</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Drawer>
                    <Dialog open={open.addsub} onClose={() => setOpen({...open, addsub: false})} anchor="right">
                        <Box sx={{width : '400px'}}>
                            <div className="w3-padding-small border-bottom">
                                <Typography variant="body1"> Add Subjects <span style={{cursor: 'pointer'}} className="material-symbols-rounded w3-hover-text-red float-right" onClick={() => setOpen({...open, addsub: false})}>cancel</span></Typography>
                            </div>
                            <div className="w3-padding">
                                <div>
                                    {subs.map((row, index) =>(
                                        <div key={index}>
                                            <FormGroup  onChange={() => select_subject(row)}>
                                                <FormControlLabel control={<Checkbox color="error" />} label={row.name} />
                                            </FormGroup>
                                        </div>
                                    ))}
                                </div>
                                <center><Button variant="contained" size="small" sx={{mt:0.4}} color="success" onClick={() => {
                                    setOpen({...open, addsub: false})
                                    getSubt(manage.id, academic.id)
                                    getStaff();
                                    }}>Done</Button></center>
                                <Stack sx={{ width: '100%', mt: 1 }} spacing={2}>
                                    <Alert severity="error">1. Onchecking the check box, the subject will be added to the form</Alert>
                                    <Alert severity="error">2. Unchecking the check box, the subject will be removed from the form</Alert>
                                </Stack>
                            </div>
                        </Box>
                    </Dialog>
                </div>
            </div>
        );
    }
    function AcademicYears() {
        const [open, setOpen] = useState({
            add: false
        });
        const [rows, setRows] = useState([]);

        const fetchAcademicYears = () => {
            $.get("api/", {getAcademicYears: 1}, function(res){
                setRows(res);
            });
        }

        const saveAcademicYear = (event) => {
            event.preventDefault();
            $.post("api/", $(event.target).serialize(), response=>{
                try{
                    let res = JSON.parse(response);
                    if(res.status){
                        Toast("Added!");
                        setOpen({...open, add: false});
                        fetchAcademicYears();
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

        const updateAcademicYear = (event) => {
            event.preventDefault();
            $.post("api/", $(event.target).serialize(), response=>{
                try{
                    let res = JSON.parse(response);
                    if(res.status){
                        Toast("Updated!");
                        setOpen({...open, edit: false});
                        fetchAcademicYears();
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

        const activate = (id, status) => {
            $.post("api/", {academic_id:id, status_edit:status}, response=>{
                try{
                    let res = JSON.parse(response);
                    if(res.status){
                        Toast(res.message);
                        fetchAcademicYears();
                        if(res.message=='activated'){
                            window.location.reload();
                        }
                    }
                    else{
                        Toast(res.message)
                    }
                }
                catch(E){
                    alert(E.toString()+response);
                }
            })
           //alert(id);
        }

        const [edit2, setEdit2] = useState({});
        useEffect(() => {
            fetchAcademicYears();
        }, []);
        return (
            <div>
                <h1 className="w3-border-bottom">Academic Years</h1>
                <div className="">
                    <Button variant="contained" color="success" sx={{mb: 2}} onClick={() => setOpen({...open, add: true})}>Add Academic Year</Button>
                    <Dialog open={open.add} onClose={() => setOpen({...open, add: false})}>
                        <Box sx={{width: "400px"}}>
                            <div className="w3-padding w3-border-bottom">
                                <Typography>Add New Academic Year</Typography>
                            </div>
                            <form className="w3-padding clearfix" onSubmit={saveAcademicYear}>
                                <TextField label="Academic Year (2024-2025)" name="academic_year" variant="outlined" size="small" sx={{mb:2}} fullWidth />
                                <TextField label="Term" name="term" variant="outlined" size="small" sx={{mb:2}} fullWidth/>
                                <Typography variant="body1">Opening Term</Typography><TextField label="" name="opening_date" type="date" variant="outlined" size="small" sx={{mb:2}} fullWidth />
                                <Typography variant="body1">Closing Term</Typography><TextField label="" name="closing_date" type="date" variant="outlined" size="small" sx={{mb:2}} fullWidth />
                                <Typography variant="body1">Next Term Begins On</Typography><TextField label="" name="next_term_begins_on" type="date" variant="outlined" size="small" sx={{mb:2}} fullWidth />
                                <TextField label="Fees" name="fees" variant="outlined" size="small" sx={{mb:2}} fullWidth />
                                <TextField label="School Requirements" name="school_requirements" variant="outlined" size="small" sx={{mb:2}} fullWidth />
                                <Button variant="contained" color="error" onClick={() => setOpen({...open, add: false})}>Cancel</Button> 
                                <Button type="submit" className="w3-right" variant="contained" color="success">Save</Button>
                            </form>
                        </Box>
                    </Dialog>
                </div>
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
                                <TableCell>Actions</TableCell>
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
                                    <TableCell>
                                        <Button variant="contained" size="small" sx={{mr: 1}} color={row.status == "active" ? "success" : "error"} onClick={e=>{
                                            e.preventDefault();
                                            setEdit2(row);
                                            setOpen({...open, edit: true})
                                        }}>Edit</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Drawer open={open.edit} onClose={() => setOpen({...open, edit: false})} anchor="right">
                        <Box sx={{width: "450px"}}>
                            <div className="w3-padding w3-border-bottom">
                                <Typography>Edit Academic Year</Typography>
                            </div>
                            <form className="w3-padding-large clearfix" onSubmit={updateAcademicYear}>
                                <input type="hidden" name="academic_year_id_edit" value={edit2.id} />
                                <TextField label="Academic Name" 
                                    name="academic_name_edit" 
                                    variant="outlined" 
                                    value={edit2.name}
                                    onChange={e=>{setEdit2({...edit2, name: e.target.value})}}
                                    size="small" sx={{mb:2}} fullWidth />
                                    <Typography variant="body1">Term</Typography><TextField label="" value={edit2.term} onChange={e=>{setEdit2({...edit2, term: e.target.value})}} name="term_edit" variant="outlined" size="small" sx={{mb:2}} fullWidth />
                                <Typography variant="body1">Opening Term</Typography><TextField label="" value={edit2.opening_term} onChange={e=>{setEdit2({...edit2, opening_term: e.target.value})}} name="opening_term_edit" type="date" variant="outlined" size="small" sx={{mb:2}} fullWidth />
                                <Typography variant="body1">Closing Term</Typography><TextField label="" value={edit2.closing_term} onChange={e=>{setEdit2({...edit2, closing_term: e.target.value})}} name="closing_term_edit" type="date" variant="outlined" size="small" sx={{mb:2}} fullWidth />
                                <Typography variant="body1">Next Term Begins On</Typography><TextField label="" value={edit2.next_term_begins} onChange={e=>{setEdit2({...edit2, next_term_begins: e.target.value})}} name="next_term_begins_edit" type="date" variant="outlined" size="small" sx={{mb:2}} fullWidth />
                                <TextField label="Fees" value={edit2.fees} onChange={e=>{setEdit2({...edit2, fees: e.target.value})}} name="fees_edit" variant="outlined" size="small" sx={{mb:2}} fullWidth />
                                <TextField label="School Requirements" value={edit2.requirements} onChange={e=>{setEdit2({...edit2, requirements: e.target.value})}} name="school_requirements_edit" variant="outlined" size="small" sx={{mb:2}} fullWidth />
                                <Switch checked={edit2.status == "active"} onChange={e=>{
                                    setEdit2({...edit2, status: e.target.checked ? "active" : "inactive"})
                                    activate(edit2.id, e.target.checked ? "active" : "inactive")
                                    }}></Switch>
                                <label className="float-right">{edit2.status == "active" ? "Active" : "Inactive"}</label>
                                <hr/>
                                <Button variant="contained" color="error" onClick={() => setOpen({...open, edit: false})}>Cancel</Button> 
                                <Button type="submit" className="w3-right" variant="contained" color="success">Update</Button>
                            </form>
                        </Box>
                    </Drawer>
                </div>
            </div>
        );
    }
}

function Results() {
    const [root, setRoot] = useState("");
    const handleChange = (event) => {
        setRoot(event.target.value);
    };

    const downloadResults = (event) => {
        event.preventDefault();
    
        const formData = new FormData(event.target);
        const params = new URLSearchParams();
    
        for (let [key, value] of formData.entries()) {
            params.append(key, value);
        }
    
        const url = `api/?${params.toString()}`;
        window.open(url, '_blank'); // Open in new tab
    };
    return (
        <>
            <div className="w3-padding">
                <h2>Download PDFs of Results</h2>
                <hr/>
                <form onSubmit={downloadResults}>
                    <FormControl sx={{width:"200px"}}>
                        <InputLabel id="form_select">Form</InputLabel>
                        <Select
                            labelId="form_select"
                            name="form_select"
                            id="form_select"
                            label="Form"
                            onChange={handleChange}
                            size="small"
                        >
                            <MenuItem value={1}>Form 1</MenuItem>
                            <MenuItem value={2}>Form 2</MenuItem>
                            <MenuItem value={3}>Form 3</MenuItem>
                            <MenuItem value={4}>Form 4</MenuItem>
                        </Select>
                    </FormControl><hr/>
                    <FormControl sx={{width:"200px"}}>
                        <InputLabel id="type_select">Type</InputLabel>
                        <Select
                            labelId="type_select"
                            name="type_select"
                            id="type_select"
                            label="Type"
                            onChange={handleChange}
                            size="small"
                        >
                            <MenuItem value="reports">School Reports</MenuItem>
                            <MenuItem value="grades">Grades</MenuItem>
                            <MenuItem value="marks">Marks</MenuItem>
                            <MenuItem value="number_of_grades">Number of Grades</MenuItem>
                        </Select>
                    </FormControl><hr/>
                    <Button variant="contained" type="submit" color="success">Download</Button>
                </form>
            </div>
        </>
    )
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

function Settings() {
    const [stage, setStage] = useState("Grading");
    const {academic, setAcademic} = useContext(Context);
    const [menus, setMenus] = useState([
        {
            title: "Grading",
            icon: "home"
        },
        {
            title: "Info",
            icon: "bookmarks"
        },
        {
            title: "System",
            icon: "sort"
        }
    ])
    return (
        <div>
            <div className="w3-padding w3-border-bottom">
                <h1>Settings</h1>
            </div>
            <div className="w3-padding">
                {menus.map((menu, index) =>(
                    <Button key={index} variant="contained" size="small" sx={{mr: 1}} color={stage == menu.title ? "error" : "secondary"} onClick={() => setStage(menu.title)}>
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
                {stage == "Grading" && <Grading />}
                {stage == "Info" && <Info />}
                {stage == "System" && <System />}
            </div>
        </div>
    );

    function Grading(){
        const [open, setOpen] = useState({
            add: false,
            edit: false
        });
        const {academic, setAcademic} = useContext(Context);
        const [grades, setGrades] = useState([]);
        const getRowGrades = () => {
            $.get("api/", {getRowGrades: "true"}, response => {
                if(Array.isArray(response)){
                    setGrades(response);
                }
                else{
                    Toast("Error getting grades");
                    console.log(response);
                }
            })
        }

        const saveGrading = (event) => {
            event.preventDefault();
            $.post("api/", $(event.target).serialize(), response=>{
                try{
                    let res = JSON.parse(response);
                    if(res.status){
                        Toast("Added!");
                        setOpen({...open, add: false})
                        getRowGrades();
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

        const [seletype, setSeletype] = React.useState('');
        const [edit2, setEdit2] = useState({});

        const handleChange = (event) => {
            setSeletype(event.target.value);
        };

        const editGrading = (event) => {
            event.preventDefault();
            $.post("api/", $(event.target).serialize(), response=>{
                try{
                    let res = JSON.parse(response);
                    if(res.status){
                        Toast("Updated!");
                        setOpen({...open, edit: false})
                        getRowGrades();
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

        const activate_grade = (id, status) => {
            $.post("api/", {grade_id:id, status:status}, response=>{
                try{
                    let res = JSON.parse(response);
                    if(res.status){
                        Toast(status=="active"?"Activated!":"Deactivated!");
                        getRowGrades();
                    }
                    else{
                        Toast(res.message)
                    }
                }
                catch(E){
                    alert(E.toString()+response);
                }
            })
           //alert(id);
        }

        useEffect(()=> {
            getRowGrades();
        }, []);
        return(
            <div>
                <h1>Grading</h1>
                <div className="w3-padding">
                    <Button variant="contained" color="primary" onClick={() => setOpen({...open, add: true})}>Add Range</Button>
                </div>
                <Dialog open={open.add} onClose={() => setOpen({...open, add: false})}>
                    <Box sx={{width: "450px"}}>
                        <div className="w3-padding w3-border-bottom w3-center">
                            <Typography>Add Range</Typography>
                        </div>
                        <form onSubmit={saveGrading} className="w3-padding">
                            <Typography variant="body1" className="w3-text-red" sx={{mb: 2}}>Academic Name: {academic.name}</Typography>
                            <input type="hidden" name="academic_id" value={academic.id} />
                            <FormControl fullWidth sx={{mb:2}}>
                                <InputLabel id="demo-simple-select-label">Level</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={seletype}
                                label="Level"
                                size="small"
                                onChange={handleChange}
                                name="level"
                                >
                                <MenuItem value="senior">Senior</MenuItem>
                                <MenuItem value="junior">Junior</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField label="Min-Mark" name="min_mark" variant="outlined" size="small" sx={{mb:2}} fullWidth required />
                            <TextField label="Max-Mark" name="max_mark" variant="outlined" size="small" sx={{mb:2}} fullWidth required />
                            <TextField label="Grade" name="grade" variant="outlined" size="small" sx={{mb:2}} fullWidth required />
                            <TextField label="Remark" name="remark" variant="outlined" size="small" sx={{mb:2}} fullWidth required />
                            <Button onClick={() => setOpen({...open, add: false})} className="w3-left" variant="contained" sx={{mb:2}} color="error">Cancel</Button><Button type="submit" className="w3-right" variant="contained" sx={{mb:2}} color="success">Add</Button>
                        </form>
                    </Box>
                </Dialog>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Academic</TableCell>
                            <TableCell>Level</TableCell>
                            <TableCell>Min-Mark</TableCell>
                            <TableCell>Max-Mark</TableCell>
                            <TableCell>Grade</TableCell>
                            <TableCell>Remark</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {grades.map((row, index) =>(
                            <TableRow key={index}>
                                <TableCell>{index+1}</TableCell>
                                <TableCell>{academic.name}</TableCell>
                                <TableCell>{row.level}</TableCell>
                                <TableCell>{row.min_mark}</TableCell>
                                <TableCell>{row.max_mark}</TableCell>
                                <TableCell>{row.grade}</TableCell>
                                <TableCell>{row.remark}</TableCell>
                                <TableCell className={row.status == "active" ? "w3-text-green" : "w3-text-red"}>{row.status == "active" ? "Active" : "Inactive"}</TableCell>
                                <TableCell>
                                    <Button variant="contained" size="small" sx={{mr: 1}} color={row.status == "active" ? "success" : "error"} onClick={e=>{
                                        e.preventDefault();
                                        setEdit2(row);
                                        setOpen({...open, edit: true})
                                    }}>Edit</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Drawer open={open.edit} anchor="right" onClose={e => setOpen({...open, edit: false})}>
                    <Box className="w3-padding" sx={{width: "450px"}}>
                        <div className="w3-padding w3-border-bottom">
                            <Typography>Grading</Typography>
                        </div>
                    
                        <form onSubmit={editGrading} className="w3-padding">
                            <input type="hidden" name="academic_id" value={academic.id} />
                            <input type="hidden" name="grade_id" value={edit2.id} />
                            <FormControl fullWidth>
                                <InputLabel id="level">Level</InputLabel>
                                <Select
                                    labelId="level"
                                    name="level_edit"
                                    id="level"
                                    value={edit2.level}
                                    label="Level"
                                    onChange={e=>{setEdit2({...edit2, level: e.target.value})}}
                                    size="small"
                                    sx={{mb:2}}
                                >
                                    <MenuItem value="senior">Senior</MenuItem>
                                    <MenuItem value="junior">Junior</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField name="min_mark_edit" sx={{mb: 2}} size="small" label="Min-Mark" value={edit2.min_mark} onChange={e=>setEdit2({...edit2, min_mark: e.target.value})} fullWidth required />
                            <TextField name="max_mark" sx={{mb: 2}} size="small" label="Max-Mark" value={edit2.max_mark} onChange={e=>setEdit2({...edit2, max_mark: e.target.value})} fullWidth required />
                            <TextField name="grade" sx={{mb: 2}} size="small" label="Grade" value={edit2.grade} onChange={e=>setEdit2({...edit2, grade: e.target.value})} fullWidth required />
                            <TextField name="remark" sx={{mb: 2}} size="small" label="Remark" value={edit2.remark} onChange={e=>setEdit2({...edit2, remark: e.target.value})} fullWidth required />
                            <p></p>
                            <div><font>Status: {edit2.status == "active" ? "Active" : "Inactive"}</font><Switch name="status" className="w3-right" 
                            checked={edit2.status == "active" ? true : false} 
                            onChange={e=>{
                                setEdit2({...edit2, status: e.target.checked ? "active" : "inactive"})
                                activate_grade(edit2.id, e.target.checked ? "active" : "inactive")
                            }} /></div><hr/>
                            <div>
                                <Button onClick={e => setOpen({...open, edit: false})} className="w3-left" variant="contained" sx={{mt:2}} color="error">Close</Button>
                                <Button type="submit" className="w3-right" variant="contained" sx={{mt:2}} color="success">Edit</Button>
                            </div>
                        </form>
                    </Box>
                </Drawer>

            </div>
        )
    }
    function Info(){
        const [update, setUpdate] = useState({
            edit: false
        });

        const [info, setInfo] = useState({});

        const getInfo = () =>{
            $.get("api/", {getInfo: true}, function(res){
                setInfo(res);
            })
        }

        const updateInfo = (event) =>{
            event.preventDefault();
            $.post("api/", $(event.target).serialize(), response=>{
                try{
                    let res = JSON.parse(response);
                    if(res.status){
                        Toast("Updated!");
                        setUpdate({...open, edit: false});
                        getInfo();
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

        useEffect(()=> {
            getInfo();
        }, []);
        return(
            <div>
                <h1>Info</h1>
                <hr/>
                <div className="w3-row">
                    <div className="w3-col m6">
                        <Typography variant="body1" sx={{mb:2}}>Scool Name: <b>{info.name}</b></Typography>
                        <Typography variant="body1" sx={{mb:2}}>Scool Address: <b>{info.address}</b></Typography>
                        <Typography variant="body1" sx={{mb:2}}>School Email Address: <b>{info.email}</b></Typography>
                        <Typography variant="body1" sx={{mb:2}}>School Phone Number: <b>{info.phone}</b></Typography>
                        <Typography variant="body1" sx={{mb:2}}>School Motto: <b>{info.motto}</b></Typography>
                        <Typography variant="body1" sx={{mb:2}}>School Vision: <b>{info.vision}</b></Typography>
                        <Typography variant="body1" sx={{mb:2}}>School Mission: <b>{info.mission}</b></Typography><hr/>
                        <Button variant="contained" color="primary" sx={{mt:2}} onClick={e=>{
                            setUpdate({...update, edit:true})
                        }}>Update</Button>
                    </div>
                    <Dialog open={update.edit} onClose={() => setUpdate({...update, edit: false})}>
                        <Box sx={{width: "450px"}}>
                            <div className="w3-padding w3-border-bottom w3-center">
                                <Typography>Update School Info</Typography>
                            </div>
                            <form className="w3-padding" onSubmit={updateInfo}>
                                <TextField label="School Name" name="school_name" value={info.name} onChange={e=>setInfo({...info, name: e.target.value})} variant="outlined" size="small" sx={{mb:2}} fullWidth />
                                <TextField label="School Address" name="address" value={info.address} onChange={e=>setInfo({...info, address: e.target.value})} variant="outlined" size="small" sx={{mb:2}} fullWidth />
                                <TextField label="Email Address" name="email" value={info.email} onChange={e=>setInfo({...info, email: e.target.value})} variant="outlined" size="small" sx={{mb:2}} fullWidth />
                                <TextField label="Phone Number" name="phone" value={info.phone} onChange={e=>setInfo({...info, phone: e.target.value})} variant="outlined" size="small" sx={{mb:2}} fullWidth />
                                <TextField label="Motto" name="motto" value={info.motto} onChange={e=>setInfo({...info, motto: e.target.value})} variant="outlined" size="small" sx={{mb:2}} fullWidth />
                                <TextField label="Vision" name="vision" value={info.vision} onChange={e=>setInfo({...info, vision: e.target.value})} variant="outlined" size="small" sx={{mb:2}} fullWidth />
                                <TextField label="Mission" name="mission" value={info.mission} onChange={e=>setInfo({...info, mission: e.target.value})} variant="outlined" size="small" sx={{mb:2}} fullWidth />
                                <Button onClick={() => setUpdate({...update, edit: false})} className="w3-left" variant="contained" sx={{mb:2}} color="error">Cancel</Button><Button type="submit" className="w3-right" variant="contained" sx={{mb:2}} color="success">Update</Button>
                            </form>
                        </Box>
                    </Dialog>
                    <div className="w3-col m6">
                        <font> School logo</font><br></br>
                        <img src="images/coat.png" width="100"/><br></br>
                        <Button size="small" sx={{mt: 2}} variant="contained" color="primary">Change</Button>
                    </div>
                </div>
                
            </div>
        )
    }
    function System(){
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

        const activate_grade = (status) =>{
            $.post("api/", {change_upload_status: status}, function(response){
                let res = JSON.parse(response);
                if(res.status){
                    getInfo();
                }
            })
        }
        useEffect(()=>{
            getInfo();
        }, []);
        return(
            <div>
                <div className="w3-padding">
                    <Typography variant="h5">Turn on or off grade uploading</Typography>
                    <Switch name="grade_upload" 
                    checked={info.status == "active" ? true : false} 
                    onChange={e=>{
                        setInfo({...info, status: e.target.checked ? "active" : "inactive"})
                        activate_grade(e.target.checked ? "active" : "inactive")
                    }} />{info.status == 'active' ? 'On' : 'Off'}
                </div>
            </div>
        )
    }
}


window.onload = () => {
    ReactDOM.render(<ThemeProvider theme={theme}><Index /></ThemeProvider>, document.getElementById("root"));
}