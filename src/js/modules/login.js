export function init() {
    const isHidden = 'is-hidden';
    const loginForm = document.querySelector('.js-login-form');
    const loginInput = document.querySelector('.js-login-code');
    const loginButton = document.querySelector('.js-login-button');
    const loginForgotten = document.querySelector('.js-login-forgotten');
    const loginNotFound = document.querySelector('.js-login-not-found');
    const loginError = document.querySelector('.js-login-error');
    const originalButtonText = loginButton.innerHTML;

    const resetState = () => {
        loginForgotten.classList.remove(isHidden);
        loginNotFound.classList.add(isHidden);
        loginError.classList.add(isHidden);
        loginButton.innerHTML = originalButtonText;
    };

    const enableButton = (event) => {
        if (event.target.value && event.target.value.length >= 3) {
            loginButton.removeAttribute('disabled');
        } else {
            loginButton.setAttribute('disabled', true);
        }
    };

    loginInput.addEventListener('change', enableButton);
    loginInput.addEventListener('input', enableButton);
    loginInput.addEventListener('blur', enableButton);
    
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        resetState();
        
        const queryParams = { invite: loginInput.value };

        loginButton.innerHTML = "Checking...";

        fetch(`/.netlify/functions/login?${new URLSearchParams(queryParams).toString()}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.inviteFound === true && data.inviteCode) {
                    window.location.replace(`/${data.inviteCode}/`); 
                } else {
                    resetState();
                    loginForgotten.classList.add(isHidden);
                    loginNotFound.classList.remove(isHidden);
                }
            })
            .catch((error) => {
                resetState();
                loginForgotten.classList.add(isHidden);
                loginError.classList.remove(isHidden);
                console.error(error);
            });
    });
}