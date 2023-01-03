export function init() {
    const rsvpSelectsSelector = '.js-rsvp-select input';
    const mealSelectSelector = '.js-meal-select input';
    const guestInlineName = '.js-name-inline';
    const isHidden = "is-hidden";
    const rsvpForm = document.querySelector('.js-rsvp-form');
    const continueButton = document.querySelector('.js-continue');
    const mealChoiceSection = document.querySelector('.js-meal-choices');
    const mealChoiceHeader = document.querySelector('.js-meal-choice-header');
    const rsvpSelects = document.querySelectorAll(rsvpSelectsSelector);
    const rsvpSelectGroups = [...new Set([...rsvpSelects].map((el) => el.name))];
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
    
    const checkRsvps = () => {
        let selectedCount = 0;
        rsvpSelectGroups.forEach((select) => {
            if(document.querySelector(`[name="${select}"]:checked`)) selectedCount++;
        });
        return selectedCount == rsvpSelectGroups.length;
    };

    const checkGuests = () => {
        const showGuest = false;
        const validState = false;
        const guestSelect = document.querySelector(guestSelectSelector);

        console.log('all', rsvpSelectGroups);
        console.log('guests', [...new Set([...document.querySelectorAll('.js-guest-select input')].map((el) => el.name))]);

        const all = rsvpSelectGroups;
        const guest = [...new Set([...document.querySelectorAll('.js-guest-select input')].map((el) => el.name))];
        const filters = all.filter((person) => !guest.includes(person));
        
        filters.map((person) => {
            if(document.querySelector(`input[name="${person}"][value$="-yes"]:checked`)) {
                console.log('show guest');
                showGuest = true;
            }
        })
        console.log('filters', filters);

        console.log('checkGuests', guestSelect);
        console.log('guest name', guestNameInput.value);

        // [...guestSelect].forEach((select) => {
            // console.log(`[name="${select.name}"]:checked`);
            // console.log(document.querySelector(`[name="${select.name}"][value$="-yes"]:checked`));
            if (guestSelect){
                guestName.classList.remove(isHidden);

                console.log('show guest name', validState);
                
                // Set inline text with new guest name
                document.querySelector(`${guestInlineName}[data-id="${guestNameInput.id}"]`)?.innerHTML = guestNameInput.value;

                if(guestNameInput.value && guestNameInput.value !== '') {
                    validState = true;
                    console.log('input valid');
                }
            } else {
                guestName.classList.add(isHidden);
                validState = true;
            }
        // });

        if (showGuest) {
            document.querySelector('.js-guest-select').classList.remove(isHidden);
        } else {
            document.querySelector('.js-guest-select').classList.add(isHidden);
            guestName.classList.add(isHidden);
            validState = true;
        }

        return validState;
    };

    const validateRsvps = () => {
        const validGuests = checkGuests();
        const validRsvps = checkRsvps();

        rsvpValidation.classList.add(isHidden);
        guestValidation.classList.add(isHidden);

        if (validGuests && validRsvps) {
            continueButton.removeAttribute('disabled');
        } else {
            continueButton.setAttribute('disabled', true);
            if(!validGuests) {
                guestValidation.classList.remove(isHidden);
            } else {
                rsvpValidation.classList.remove(isHidden);
            }
            continuePress = false;
            continueButton.classList.remove(isHidden);
            mealChoiceSection.classList.add(isHidden);
        }

        checkVisibleMealChoices();
    };

    const checkVisibleMealChoices = () => {
        let acceptCount = 0;
        let selectedCount = 0;
        rsvpSelectGroups.forEach((select) => {
            document.querySelectorAll(`[name="${select}"]:checked`).forEach((input) => {
                selectedCount++;
                if(input.value.includes('yes')) {
                    document.querySelector(`.js-meal-${select}`).classList.remove(isHidden);
                    acceptCount++;
                } else {
                    document.querySelector(`.js-meal-${select}`).classList.add(isHidden);
                }
            });
            
            if (acceptCount == 0 && (selectedCount == rsvpSelectGroups.length)) {
                mealChoiceHeader.classList.add(isHidden);
            } else {
                mealChoiceHeader.classList.remove(isHidden);
            }

            if (continuePress === false && acceptCount == 0 && (selectedCount == rsvpSelectGroups.length)) {
                continueButton.classList.add(isHidden);
                mealChoiceSection.classList.remove(isHidden);
            } else if (continuePress === false) {
                continueButton.classList.remove(isHidden);
                mealChoiceSection.classList.add(isHidden);    
            } else if (continuePress) {
                mealChoiceSection.classList.remove(isHidden);
            }

            expectedMealChoices = acceptCount;
        });
        validateMealChoices();
    }

    const validateMealChoices = () => {
        const selectedCount = 0;
        confirmButton.setAttribute('disabled', true);
        mealValidation.classList.remove(isHidden);

        document.querySelectorAll(`${rsvpSelectsSelector}[value$="-yes"]:checked`).forEach((select) => {
            if (document.querySelector(`[name="${select.name.replace('attend', 'meal')}"]:checked`)) selectedCount++;
        });

        if (selectedCount == expectedMealChoices || mealSelects.length === 0) {
            confirmButton.removeAttribute('disabled'); 
            mealValidation.classList.add(isHidden);   
        }
    }

    // show continue button
    rsvpSelects.forEach((select) => {
        select.addEventListener('mousedown', validateRsvps);
        select.addEventListener('change', validateRsvps);
    }); 

    guestNameInput.addEventListener('keyup', validateRsvps);
    guestNameInput.addEventListener('change', validateRsvps);

    // show meal choice section on press of continue button
    continueButton.addEventListener('click', (event) => {
        continuePress = true;
        continueButton.classList.add(isHidden);
        mealChoiceSection.classList.remove(isHidden);
    });

    // show confirm button
    mealSelects.forEach((select) => {
        select.addEventListener('mousedown', validateMealChoices);
        select.addEventListener('change', validateMealChoices);
    }); 

    validateRsvps();

    rsvpForm.addEventListener('submit', (event) => {
        event.preventDefault();
    
        rsvpError.classList.add(isHidden);
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
                    mealValidation.classList.add(isHidden);
                    rsvpError.classList.remove(isHidden);
                }
                confirmButton.innerHTML = originalButtonText;
            })
            .catch((error) => {
                mealValidation.classList.add(isHidden);
                rsvpError.classList.remove(isHidden);
                confirmButton.innerHTML = originalButtonText;
                console.error(error);
            });
    });

}