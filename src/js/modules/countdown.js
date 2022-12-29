export function init() {
    const differenceInDays = Math.ceil((new Date("05/06/2023").getTime() - new Date()) / (1000 * 3600 * 24));
    const countdown = document.querySelector('.js-countdown');
    const countdownDays = document.querySelector('.js-countdown-days');
    countdownDays.innerHTML = differenceInDays;
    countdown.classList.add('is-visible');
}