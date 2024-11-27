/** function validateForm(){
    let setEmail = document.forms["signUpForm"]["email"].value;
    let setPassword = document.forms["signUpForm"]["password"].value;
    let setCheckPassword = document.forms["signUpForm"]["checkPassword"].value;

    if (setCheckPassword != setPassword){
        alert("ensure passwords match");
        return false;
    }

    if (!setEmail.includes("@students.towson.edu")){
        alert("You must use your TU email");
        return false;
    }

    sessionStorage.setItem("emailKey", setEmail);
    sessionStorage.setItem("passwordKey", setPassword);
} **/

async function validateForm(event) {
    event.preventDefault();

    let email = document.forms["signUpForm"]["email"].value;
    let password = document.forms["signUpForm"]["password"].value;
    let checkPassword = document.forms["signUpForm"]["checkPassword"].value;

    if (password !== checkPassword) {
        alert("Passwords do not match!");
        return false;
    }

    try {
        let response = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        let result = await response.text();
        if (response.ok) {
            alert(result);
            window.location.href = 'Login.html';
        } else {
            alert(result);
        }
    } catch (err) {
        console.error('Error:', err);
        alert('An error occurred. Please try again.');
    }
}
