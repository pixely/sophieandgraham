import { hide, show, disable, enable } from '../utils';

export function init() {
    const loginForm = document.querySelector('.js-login-form');
    const loginInput = document.querySelector('.js-login-code');
    const loginButton = document.querySelector('.js-login-button');
    const loginForgotten = document.querySelector('.js-login-forgotten');
    const loginNotFound = document.querySelector('.js-login-not-found');
    const loginError = document.querySelector('.js-login-error');
    const originalButtonText = loginButton.innerHTML;

    const resetState = () => {
        show(loginForgotten);
        hide(loginNotFound);
        hide(loginError);
        loginButton.innerHTML = originalButtonText;
    };

    const enableButton = (event) => {
        if (event.target.value && event.target.value.length >= 3) {
            enable(loginButton);
        } else {
            disable(loginButton);
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
                    hide(loginForgotten);
                    show(loginNotFound);
                }
            })
            .catch((error) => {
                resetState();
                hide(loginForgotten);
                show(loginError);
                console.error(error);
            });
    });
}