export function init() {
    const continueButton = document.querySelector('.js-continue');
    const rsvpSelects = document.querySelectorAll('.js-rsvp-select input');

    console.log('rsvp form');
    // show continue button
    rsvpSelects.forEach((select) => {
        select.addEventListener('change', (event) => {
            console.log(event);
            console.log(event.target.value);
            continueButton.removeAttribute('disabled');
        });
    });

    // show meal choice section on press of continue button

    // show meal choice only for accepting guests
    
    // show confirm button
}