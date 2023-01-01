export function init() {
    const messageForm = document.querySelector('.js-message-form');
    const messageSubmit = document.querySelector('.js-message-submit');
    const messageError = document.querySelector('.js-message-error');
    const isHidden = "is-hidden";
    const originalButtonText = messageSubmit.innerHTML;

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
    
        messageError.classList.add(isHidden);
        messageSubmit.innerHTML = "Sending...";

        const formData = new FormData(messageForm);
        const plainFormData = Object.fromEntries(formData.entries());
    
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(plainFormData),
        };

        fetch('/.netlify/functions/message', fetchOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log('data', data);
                if (data.success === true) {
                    console.log('success');
                    window.location.replace(messageForm.action); 
                } else {
                    messageError.classList.remove(isHidden);
                }
                messageSubmit.innerHTML = originalButtonText;
            })
            .catch((error) => {
                messageError.classList.remove(isHidden);
                messageSubmit.innerHTML = originalButtonText;
                console.error(error);
            });
    });
}