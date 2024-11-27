/** function validateForm(){
    let setEmail = document.forms["loginForm"]["email"].value;
    let setPassword = document.forms["loginForm"]["password"].value;

    sessionStorage.setItem("emailKey", setEmail);
    sessionStorage.setItem("passwordKey", setPassword);
} **/

async function validateForm(event) {
    event.preventDefault();

    let email = document.forms["loginForm"]["email"].value;
    let password = document.forms["loginForm"]["password"].value;

    try {
        let response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        let result = await response.text();
        if (response.ok) {
            alert(result);
            window.location.href = 'profile.html';
        } else {
            alert(result);
        }
    } catch (err) {
        console.error('Error:', err);
        alert('An error occurred. Please try again.');
    }
}
