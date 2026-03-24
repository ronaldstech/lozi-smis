<?php 

require "db.php";

$data = [];

$read = $db->query("SELECT * FROM students WHERE form = '4'");
while($row = $read->fetch_assoc()){
    $data[] = [
        "uid" => $row["id"],
        "firstName" => $row["first"],
        "middleName" => $row["middle"],
        "lastName" => $row["last"],
        "form" => $row["form"],
        "gender" => $row["gender"],
        "status" => $row["status"],
        "school" => "day"
    ];
}

echo json_encode($data);