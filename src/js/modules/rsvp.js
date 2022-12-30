export function init() {
    const rsvpSelectsSelector = '.js-rsvp-select input';
    const mealSelectSelector = '.js-meal-select input';
    const isHidden = "is-hidden";
    const continueButton = document.querySelector('.js-continue');
    const mealChoiceSection = document.querySelector('.js-meal-choices');
    const mealChoiceHeader = document.querySelector('.js-meal-choice-header');
    const rsvpSelects = document.querySelectorAll(rsvpSelectsSelector);
    const rsvpSelectGroups = [...new Set([...rsvpSelects].map((el) => el.name))];
    const mealSelects = document.querySelectorAll(mealSelectSelector);
    const confirmButton = document.querySelector('.js-confirm');
    const rsvpValidation = document.querySelector('.js-validation-1');
    const mealValidation = document.querySelector('.js-validation-2');

    let expectedMealChoices = 0;
    
    const checkRsvps = () => {
        let selectedCount = 0;
        rsvpSelectGroups.forEach((select) => {
            if(document.querySelector(`[name="${select}"]:checked`)) selectedCount++;
        });
        return selectedCount == rsvpSelectGroups.length;
    };

    const validateRsvps = () => {
        if (checkRsvps()) {
            continueButton.removeAttribute('disabled');
            rsvpValidation.classList.add(isHidden);
        } else {
            rsvpValidation.classList.remove(isHidden);
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

    // show meal choice section on press of continue button
    continueButton.addEventListener('click', (event) => {
        continueButton.classList.add(isHidden);
        mealChoiceSection.classList.remove(isHidden);
    });

    // show confirm button
    mealSelects.forEach((select) => {
        select.addEventListener('mousedown', validateMealChoices);
        select.addEventListener('change', validateMealChoices);
    }); 

    validateRsvps();
}