function validateForm(){
    setUsername = document.forms["loginForm"]["username"];
    setPassword = document.forms["loginForm"]["password"];

    sessionStorage.setItem("usernameKey", setUsername);
    sessionStorage.setItem("passwordKey", setPassword);
}