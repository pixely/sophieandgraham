const isHidden = "is-hidden";

// Utilities for showing/hiding elements based on utility class
export const hide = el => el?.classList.add(isHidden);
export const show = el => el?.classList.remove(isHidden);

// Utllities for disabling/enabling elements based on disabled attribute
export const disable = el => el?.setAttribute('disabled', true);
export const enable = el => el?.removeAttribute('disabled');
