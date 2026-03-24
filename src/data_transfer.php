<?php

$db = new mysqli("localhost", "u503160247_kk_ss", "Ronalds@tech265", "u503160247_kk_ss");
//$db2 = new mysqli("localhost", "u503160247_kkss", "Ronalds@tech265", "u503160247_kkss");

$read = $db->query("SELECT * FROM marks WHERE aca_id = 10");
$i = 1;
while($row = $read->fetch_assoc()){
    // echo $i." -- ".$row['assessments']." --- ".$row['end_term']." -- ".$row['final']."<br>";
    // $i++;
    $form = $row['form'];
    $student = $row['student'];
    $ass = $row['assessments'];
    $end = round((($row['end_term']/100)*60), 0);
    $total = $ass + $end;
    $subject = $row['subject'];
    
    if($form>=3){
        $level = 'senior';
    }
    else{
        $level = 'junior';
    }
    echo $i." -- ".$row['assessments']." --- ".$end." -- ".$row['final']."<br>";
    
    $remark_read = $db->query("SELECT * FROM grading WHERE $total BETWEEN min_mark AND max_mark AND level = '$level'")->fetch_assoc();
    $remark = $remark_read['remark'];
    $grade = $remark_read['grade'];
    $upd = $db->query("UPDATE marks SET final = '$total', remark = '$remark', grade = '$grade' WHERE student = '$student' AND form = '$form' AND subject = '$subject' AND aca_id = 10");
    $i++;
}