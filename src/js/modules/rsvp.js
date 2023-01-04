import { hide, show, disable, enable } from '../utils';

const state = {
    guestCount: 0,
    checkedCount: 0,
    acceptedCount: 0,
};

export function init() {
    const rsvpSelectsSelector = '.js-rsvp-select input';
    const mealSelectSelector = '.js-meal-select input';
    const guestInlineName = '.js-name-inline';
    const rsvpForm = document.querySelector('.js-rsvp-form');
    const continueButton = document.querySelector('.js-continue');
    const mealChoiceSection = document.querySelector('.js-meal-choices');
    const mealChoiceHeader = document.querySelector('.js-meal-choice-header');
    const rsvpSelects = document.querySelectorAll(rsvpSelectsSelector);
    const mealSelects = document.querySelectorAll(mealSelectSelector);
    const confirmButton = document.querySelector('.js-confirm');
    const rsvpValidation = document.querySelector('.js-validation-1');
    const guestValidation = document.querySelector('.js-validation-2');
    const mealValidation = document.querySelector('.js-validation-3');
    const rsvpError = document.querySelector('.js-rsvp-error');
    const originalButtonText = confirmButton.innerHTML;
    const continuePress = false;
    const guestSelectSelector = '.js-guest-select input[value$="-yes"]:checked';
    const guestName = document.querySelector('.js-guest-name');
    const guestNameInput = document.querySelector('.js-guest-name-input');
    
    let expectedMealChoices = 0;

    const setState = (key, value) => {
        state[key] = value;
        return state;
    };

    const updateGuestCount = () => {
        return setState('guestCount', [...new Set([...rsvpSelects].map((el) => el.name))].length);
    };

    const updateCheckedCount = () => {
        const checkedRsvps = document.querySelectorAll(`${rsvpSelectsSelector}:checked`);
        return setState('checkedCount', checkedRsvps.length);
    };

    const updateAcceptedCount = () => {
        return setState('acceptedCount', 0);
    };

    const checkRsvps = () => {
        updateGuestCount();
        return state.checkedCount == state.guestCount;
    };

    const checkGuests = () => {
        const showGuest = false;
        const validState = false;
        const guestSelect = document.querySelector(guestSelectSelector);

        const all = [...new Set([...rsvpSelects].map((el) => el.name))];
        const guest = [...new Set([...document.querySelectorAll('.js-guest-select input')].map((el) => el.name))];
        const filters = all.filter((person) => !guest.includes(person));
        
        filters.map((person) => {
            if(document.querySelector(`input[name="${person}"][value$="-yes"]:checked`)) {
                showGuest = true;
            }
        })
        
        if (guestSelect){
            show(guestName);
            
            // Set inline text with new guest name
            document.querySelector(`${guestInlineName}[data-id="${guestNameInput.id}"]`)?.innerHTML = guestNameInput.value;

            if(guestNameInput.value && guestNameInput.value !== '') {
                validState = true;
            }
        } else {
            hide(guestName);
            validState = true;
        }
        
        if (showGuest) {
            show(document.querySelector('.js-guest-select'));
        } else {
            hide(document.querySelector('.js-guest-select'));
            hide(guestName);
            validState = true;
        }

        return validState;
    };

    const validateRsvps = () => {
        updateCheckedCount();
        
        const validGuests = checkGuests();
        const validRsvps = checkRsvps();
        
        hide(rsvpValidation);
        hide(guestValidation);
        
        if (validGuests && validRsvps) {
            enable(continueButton);
        } else {
            disable(continueButton);
            if(!validGuests) {
                show(guestValidation);
            } else {
                show(rsvpValidation);
            }
            continuePress = false;
            show(continueButton);
            hide(mealChoiceSection);
        }

        checkVisibleMealChoices();
    };

    const checkVisibleMealChoices = () => {
        let acceptCount = 0;
        let selectedCount = 0;
        [...new Set([...rsvpSelects].map((el) => el.name))].forEach((select) => {
            document.querySelectorAll(`[name="${select}"]:checked`).forEach((input) => {
                selectedCount++;
                if(input.value.includes('yes')) {
                    show(document.querySelector(`.js-meal-${select}`));
                    acceptCount++;
                } else {
                    hide(document.querySelector(`.js-meal-${select}`));
                }
            });
            
            if (acceptCount == 0 && (state.guestCount == state.checkedCount)) {
                hide(mealChoiceHeader);
            } else {
                show(mealChoiceHeader);
            }

            if (continuePress === false && acceptCount == 0 && (state.guestCount == state.checkedCount)) {
                hide(continueButton);
                show(mealChoiceSection);
            } else if (continuePress === false) {
                show(continueButton);
                hide(mealChoiceSection);    
            } else if (continuePress) {
                show(mealChoiceSection);
            }

            expectedMealChoices = acceptCount;
        });
        validateMealChoices();
    }

    const validateMealChoices = () => {
        const selectedCount = 0;
        disable(confirmButton);
        show(mealValidation);
        
        document.querySelectorAll(`${rsvpSelectsSelector}[value$="-yes"]:checked`).forEach((select) => {
            if (document.querySelector(`[name="${select.name.replace('attend', 'meal')}"]:checked`)) selectedCount++;
        });

        if (selectedCount == expectedMealChoices || mealSelects.length === 0) {
            enable(confirmButton); 
            hide(mealValidation);
        }
    }

    const continueButtonClick = () => {
        continuePress = true;
        hide(continueButton);
        show(mealChoiceSection);
    };

    const rsvpSubmit = (event) => {
        event.preventDefault();
    
        hide(rsvpError);

        confirmButton.innerHTML = "Checking...";

        const formData = new FormData(rsvpForm);
        const plainFormData = Object.fromEntries(formData.entries());
    
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(plainFormData),
        };

        fetch('/.netlify/functions/rsvp', fetchOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.success === true && data.type) {
                    window.location.replace(`/${data.inviteCode}/thank-you/${data.type}/`); 
                } else {
                    hide(mealValidation);
                    show(rsvpError);
                }
                confirmButton.innerHTML = originalButtonText;
            })
            .catch((error) => {
                hide(mealValidation);
                show(rsvpError);
                confirmButton.innerHTML = originalButtonText;
                console.error(error);
            });
    };
    
    const setEventHandlers = () => {
        // show continue button
        rsvpSelects.forEach((select) => {
            select?.addEventListener('mousedown', validateRsvps);
            select?.addEventListener('change', validateRsvps);
        }); 

        guestNameInput?.addEventListener('keyup', validateRsvps);
        guestNameInput?.addEventListener('change', validateRsvps);

        // show meal choice section on press of continue button
        continueButton?.addEventListener('click', continueButtonClick);

        // show confirm button
        mealSelects.forEach((select) => {
            select?.addEventListener('mousedown', validateMealChoices);
            select?.addEventListener('change', validateMealChoices);
        }); 

        rsvpForm?.addEventListener('submit', rsvpSubmit);
    };

    validateRsvps();
    setEventHandlers();

}