function validateForm(){
    let setEmail = document.forms["loginForm"]["email"].value;
    let setPassword = document.forms["loginForm"]["password"].value;

    sessionStorage.setItem("emailKey", setEmail);
    sessionStorage.setItem("passwordKey", setPassword);
}