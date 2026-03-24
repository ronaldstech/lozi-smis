<?php
$to = 'liwewejacob265@gmail.com';
$subject = 'Test Email from PHP';
$message = 'Hello, this is a test email sent from PHP!';
$headers = 'From: bit24-jliwewe@mubas.ac.mw' . "\r\n" .
           'Reply-To: bit24-jliwewe@mubas.ac.mw' . "\r\n" .
           'X-Mailer: PHP/' . phpversion();

// Send email
if (mail($to, $subject, $message, $headers)) {
    echo "Email sent successfully!";
} else {
    echo "Email sending failed.";
}
?>