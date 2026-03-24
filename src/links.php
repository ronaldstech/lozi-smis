<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#085a9d">
<link rel="stylesheet" type="text/css" href="../resources/w3css/w3.css">
<link rel="stylesheet" type="text/css" href="../resources/w3css/tailwind.css">
<link href="../resources/vendor/bootstrap/css/bootstrap.css" rel="stylesheet">

<script type="text/javascript" src="../resources/vendor/jquery/jquery.min.js"></script>
<link rel="stylesheet" href="../resources/fontawesome/css/all.min.css">

<!--====== Default CSS ======-->
<link rel="stylesheet" href="../resources/w3css/default.css">

<link rel="stylesheet" type="text/css" href="../resources/toastify/src/toastify.css">
<script type="text/javascript" src="../resources/toastify/src/toastify.js"></script>

<link rel="stylesheet" type="text/css" href="../resources/semantic/semantic.min.css">

<!--<script type="text/javascript" src="exportTable.js"></script>-->
<script type="text/javascript" src="../resources/react.js"></script>
<script type="text/javascript" src="../resources/react-dom.js"></script>
<script type="text/javascript" src="../resources/babel.js"></script>
<script type="text/javascript" src="../resources/prop-types.js"></script>

<script type="text/javascript" src="../resources/react-is.js"></script>
<script type="text/javascript" src="../resources/material-ui.js"></script>



<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=home" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=home" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
<style>
    .material-symbols-outlined {
        font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24
    }
    .transparent-hover:hover{
        background: rgba(0, 0, 0, .040) !important;
    }
</style>


<style type="text/css">
	@font-face{
		font-family: googleRoboto;
		src:url('../fonts/Roboto/Roboto-Regular.ttf');
	}
	@font-face{
		font-family: robotLight;
		src:url('../fonts/Roboto/Roboto-Light.ttf');
	}
	@font-face{
		font-family: openSans;
		src:url('../fonts/Open_Sans/OpenSans-Regular.ttf');
	}
	@font-face{
		font-family: sansmedium;
		src:url('./fonts/sans_medium.ttf');
	}
	@font-face{
		font-family: sourceSans;
		src:url('../fonts/Source_Sans_Pro/SourceSansPro-Regular.ttf');
	}
	body{
		font-family: Arial, Helvetica, sans-serif;
	}
	.sansmedium{
		font-family: sansmedium !important;
	}
	.w3-grey{
		background: #9eb1bb !important;
	}
	.tp.w3-grey{
		border-left: 3px solid red ;
	}
	.tp{

	}
	.block{
		display: block;
	}
	thead{
		border-top-left-radius: 8px !important;
		border-top-right-radius: 8px !important;
		cursor: pointer;
	}
	.form-control.sw{
		padding-left: 40px !important;min-height: 47px !important;
	}
	.pointer{
		cursor: pointer;
	}
	.rounded-left{
		border-radius: 0 !important;
		border-bottom-left-radius: 6px !important;
		border-top-left-radius: 6px !important;
	}
	.rounded-right{
		border-radius: 0 !important;
		border-bottom-right-radius: 26px !important;
		border-top-right-radius: 26px !important;
	}
	.bcenter{
        display: inline-flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
    }
    .btn-succes,.some-padding:hover{
    	background: #023e8a;
    	color: white;
    	cursor: pointer;
    }
    .some-padding{
        padding:12px 16px !important
    }
    .ms-shadow{
    	box-shadow: rgba(0, 0, 0, 0.14) 0px 1px 2px, rgba(0, 0, 0, 0.12) 0px 0px 2px;
    }
    .absolute-bottom{
    	position:absolute;
    	bottom: 0;
    	left: 0;
    	width: 100%;
    	background: linear-gradient(rgba(0, 0, 0, .0),rgba(0, 0, 0, .8));
    	border-bottom-left-radius: 8px;
    	border-bottom-right-radius: 8px;
    }
    .border-0{
    	border: none;
    }
    .outline-0{
    	outline: none;
    }

    /* PMA Pagination Styling */
    .pma button{
    	background: inherit;
    	padding: 3px 8px;
    	color: black;
    	border: none;
    	outline: none;
    	cursor: pointer;
    	border-radius: 4px;
    }
    .pma button:hover{
    	background: #ddd;
    }
    .pma button:active{
    	background: white;
    	transition: .2s;
    }
    .pma input, .pma select{
    	border-radius: 2px;
		background: #fff;
		border: 1px solid #aaa;
		color: #555;
		padding: 3px 4px;
		font-size: 1em;
		outline: none;
    }
    .pma input:focus,.pma select:focus{
    	border: 1px solid #7c7c7c;
		background: #fff;
    }
</style>
<script type="text/javascript">
	function _(id) {
        return document.getElementById(id);
    }

    function Toast(text) {
        Toastify({
            text: text,
            gravity: "top",
            position: 'center',
            backgroundColor:"#dc3545",
            background:"#01796f"
        }).showToast();
    }
</script>