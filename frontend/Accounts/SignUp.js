function validateForm(){
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
}