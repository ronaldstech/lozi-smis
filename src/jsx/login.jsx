const { TextField, Button, Dialog, Box, Link } = MaterialUI;

function Index(){

    const login = (event) => {
        event.preventDefault();
        $.post("api/", $(event.target).serialize(), response=>{
            try{
                let res = JSON.parse(response);
                if(res.status){
                    if(res.admin){
                        Toast("Success");
                        window.location.href = "login.php";
                    }
                    else{
                        Toast("Success");
                        window.location.href = "staff.php";
                    }
                } else{
                    Toast(res.message);
                }
            } catch(E){
                alert(E.toString()+response);
            }
        })
    }
    return (
        <Dialog open={true}>
            <Box style={{width:400}}>
                <div className="w3-padding">
                    <font sx={{fontSize:24}}>Login in to start your session</font>
                </div>
                <form className="w3-padding" onSubmit={login}>
                    <TextField label="Username" size="small" fullWidth name="username" sx={{mb:2}}/>
                    <TextField label="Password" size="small" fullWidth name="password" type="password" sx={{mb:2}}/>
                    <Link href="#" underline="hover" color="error">Forgot Password?</Link>
                    <Button type="submit" variant="contained" fullWidth sx={{mt:2}}>Login</Button>
                </form>
            </Box>
        </Dialog>
    )
}

window.onload = () => {
    ReactDOM.render(<Index />, document.getElementById("root"));
}