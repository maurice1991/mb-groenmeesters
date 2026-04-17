<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

require __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    exit('Ongeldige aanvraag');
}

$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $message === '') {
    header('Location: /?status=error');
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: /?status=error');
    exit;
}

$safeName    = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$safeEmail   = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$safePhone   = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$safeSubject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
$safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.transip.email';
    $mail->SMTPAuth   = true;
    $mail->Username   = $_ENV['SMTP_USER'];
    $mail->Password   = $_ENV['SMTP_PASS'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    $mail->CharSet = 'UTF-8';

    $mail->setFrom('info@mb-groenmeesters.nl', 'MB Groenmeesters');
    $mail->addAddress('info@mb-groenmeesters.nl');
    $mail->addReplyTo($email, $name);

    $mail->isHTML(true);
    $mail->Subject = $subject !== '' ? $subject : 'Nieuwe aanvraag';

    $mail->Body = "
        <h2>Nieuwe aanvraag</h2>
        <p><b>Naam:</b> {$safeName}</p>
        <p><b>Email:</b> {$safeEmail}</p>
        <p><b>Telefoon:</b> {$safePhone}</p>
        <p><b>Onderwerp:</b> {$safeSubject}</p>
        <p><b>Bericht:</b><br>{$safeMessage}</p>
    ";

    $mail->AltBody =
        "Nieuwe aanvraag\n\n" .
        "Naam: {$name}\n" .
        "Email: {$email}\n" .
        "Telefoon: {$phone}\n" .
        "Onderwerp: {$subject}\n\n" .
        "Bericht:\n{$message}";

    $mail->send();

    header('Location: /?status=success');
    exit;

} catch (Exception $e) {
    header('Location: /?status=error');
    exit;
}