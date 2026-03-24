<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Login</title>
	<?php require 'links.php';?>
</head>
<body>
	<div id="root"></div>
</body>
<script type="text/babel">
<?php

$files = [
	'jsx/login.jsx'
];

foreach ($files as $file) {
	require $file;
}
?>
</script>
</html>