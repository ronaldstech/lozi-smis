<?php
session_start();
require 'db.php';
require 'functions.php';

if(!isset($_SESSION['staff_id'])){
	header("location: index.php");
}
$staff_id = $_SESSION['staff_id'];
$reanName = $db->query("SELECT * FROM staff WHERE id = '$staff_id'")->fetch_assoc()['username'];
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Dashboard | <?=$reanName;?></title>
	<?php require 'links.php';?>
</head>
<body>
	<div id="root"></div>
</body>
<script type="text/babel">
<?php

$files = [
	'jsx/dashboard.jsx'
];

foreach ($files as $file) {
	require $file;
}
?>
</script>
</html>