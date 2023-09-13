
// Function to validate email format
function validateEmail(email) {
    const re = /^(([^<>()[\]\.,;:\s@"]+(\.[^<>()[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

document.getElementById('submitButton').addEventListener('click', function() {
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    const messageInput = document.getElementById('messageInput');

    const name = nameInput.value;
    const email = emailInput.value;
    const message = messageInput.value;

    // Validation
    if (!name || !email || !message) {
        alert('All fields are required.');
        return;
    }

    if (!validateEmail(email)) {
        alert('Please enter a valid email.');
        return;
    }

    // Send Email
    Email.send({
        SecureToken: 'TU_TOKEN', // Obtén un token desde https://smtpjs.com/
        To: 'kuellarfer@gmail.com',
        From: email,
        Subject: `New Message from ${name}`,
        Body: message,
    }).then(response => {
        if (response === 'OK') {
            alert('Email sent successfully.');
        } else {
            alert('Failed to send email. Please try again.');
        }
    }).catch(error => {
        alert('An error occurred. Please try again.');
    });
});



