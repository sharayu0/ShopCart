const loginForm = document.querySelector("#login-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const emailError = document.querySelector("#email-error");
const passwordError = document.querySelector("#password-error");
const passwordToggle = document.querySelector("#password-toggle");
const loginMessage = document.querySelector("#login-message");

passwordToggle.addEventListener("click", () => {

    if(passwordInput.type === "password") {
        passwordInput.type = "text";
        passwordToggle.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
        passwordToggle.setAttribute("aria-label", "Hide Password");
    } else {
        passwordInput.type = "password";
        passwordToggle.innerHTML = '<i class="fa-regular fa-eye"></i>';
        passwordToggle.setAttribute("aria-label", "Show Password");
    }
});

function validateLoginForm() {

    let isValid = true;
    emailError.textContent = "";
    passwordError.textContent = "";

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if(email === "") {

        emailError.textContent =  "Please enter your email address.";
        isValid = false;
    } else if(!emailInput.checkValidity()) {

        emailError.textContent = "Please enter a valid email address.";
        isValid = false;
    }

    if(password === "") {

        passwordError.textContent = "Please enter your password.";
        isValid = false;
    } else if(password.length < 6) {

        passwordError.textContent = "Password must be at least 6 characters.";
        isValid = false;
    }
    return isValid;
} 

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    loginMessage.textContent = "";
    const isValid = validateLoginForm();    
    if(!isValid) {
        return;
    }
    loginMessage.textContent =  "Login form submitted successfully.";
});
