<?php 

require 'db.php';

$read = $db->query("SELECT * FROM marks WHERE aca_id = '10' AND form = '1'");
$i = 1;
while($row = $read->fetch_assoc()){
    
    echo $i." ";
    $i++;
}