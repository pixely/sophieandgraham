import { hide, show } from '../utils';

const giftParentSelector = '.js-gift[data-gift]';
const giftOptionSelector = '.js-gift-options';
const giftValueSelector = '.js-gift-value';
const giftPaymentSelector = '.js-gift-payment';
const giftSelects = document.querySelectorAll('.js-gift-select');
const giftContributes = document.querySelectorAll('.js-gift-contribute');
const giftOptions = document.querySelectorAll(giftOptionSelector);
const giftValues = document.querySelectorAll(giftValueSelector);
const giftPayments = document.querySelectorAll(giftPaymentSelector);

const numberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
};
const minValue = 1;

const showGiftingOptions = (gift, name, value, contribute = false) => {
    const valueString = `&pound;${value} `;
    resetAll();

    show(gift.querySelector(giftOptionSelector));
    
    console.log('contribute', contribute);
    if (contribute === true) {
        show(gift.querySelector(giftValueSelector));
    } else {
        hide(gift.querySelector(giftValueSelector));
    }

    gift.querySelectorAll(giftPaymentSelector).forEach((giftPaymentOption) => {
        show(giftPaymentOption);
        const formattedText = giftPaymentOption.dataset.original?.replace('#P', valueString).replace('#D', name);
        const formattedUrl = giftPaymentOption.dataset.originalUrl?.replace('#P', value).replace('#D', name);
        giftPaymentOption.innerHTML = formattedText;
        giftPaymentOption.href = formattedUrl;
    });
};

const giftSelect = (event) => {
    console.log('giftSelect', event);
    
    const gift = event.target.closest(giftParentSelector);
    const giftName = gift.dataset.giftName;
    const giftValue = new Intl.NumberFormat("en", numberFormatOptions).format(gift.dataset.giftValue || minValue);

    showGiftingOptions(gift, giftName, giftValue);
}

const giftContributeSelect = (event) => {
    console.log('giftContributeSelect', event);

    const gift = event.target.closest(giftParentSelector);
    const giftName = gift.dataset.giftName;
    const inputValue = new Intl.NumberFormat("en", numberFormatOptions).format(gift.querySelector(giftValueSelector)?.value || minValue);
    
    showGiftingOptions(gift, giftName, inputValue, true);
}

const giftValueChange = (event) => {
    const inputValue = new Intl.NumberFormat("en", numberFormatOptions).format(event.target.value || minValue);
    const gift = event.target.closest(giftParentSelector);
    const giftName = gift.dataset.giftName;
    
    showGiftingOptions(gift, giftName, inputValue, true);
}

const storeOriginalUrls = () => {
    giftPayments.forEach((paymentChoice) => {
        paymentChoice.dataset.originalUrl = paymentChoice.href;
    });
};

const resetAll = () => {
    giftSelects.forEach((select) => {
        show(select);
    });
    
    giftContributes.forEach((select) => {
        show(select);
    });

    giftOptions?.forEach((select) => {
        hide(select);
    });

    giftValues?.forEach((select) => {
        hide(select);
    }); 

    giftPayments?.forEach((select) => {
        hide(select);
    }); 
}

const setEventHandlers = () => {
    
    giftSelects?.forEach((select) => {
        select?.addEventListener('click', giftSelect);
    });
    
    giftContributes?.forEach((select) => {
        select?.addEventListener('click', giftContributeSelect);
    });

    giftValues?.forEach((select) => {
        select?.addEventListener('keyup', giftValueChange);
        select?.addEventListener('change', giftValueChange);
    }); 
};

export function init() {
    storeOriginalUrls();
    setEventHandlers();
    resetAll();
}