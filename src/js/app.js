import '../sass/app.scss';

const dynamicModules = [...document.querySelectorAll('[data-module]')].map((module) => module.dataset.module);

if (dynamicModules.includes('rsvp')) {
    import("./modules/rsvp").then(function (rsvp) {
        rsvp.init();
    });
}