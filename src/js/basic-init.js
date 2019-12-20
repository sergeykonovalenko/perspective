$(document).ready(function () {
    'use strict';

    // is mobile
    const is_mobile = isMobile();
    if (is_mobile) document.documentElement.classList.add('is-mobile');

    // masked input
    $('input[type="tel"]').mask('+7 (999) 999-99-99 ');

    // is mobile
    function isMobile() {
        return $.browser.device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
    }

}); // end ready
