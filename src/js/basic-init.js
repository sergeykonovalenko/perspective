$(document).ready(function () {
    'use strict';

    // is mobile
    const is_mobile = isMobile();
    if (is_mobile) document.documentElement.classList.add('is-mobile');

    // sticky menu
    let mainHeader = document.querySelector('.main-header');
    let mainHeaderWrapper = document.querySelector('.main-header__wr');
    let waypointOffset = 50;

    if (mainHeaderWrapper) {
        let waypoint = new Waypoint({
            element: mainHeader,
            handler: function (direction) {
                if (direction === 'down') {
                    mainHeader.style.height = mainHeaderWrapper.offsetHeight + 'px';
                    mainHeaderWrapper.classList.add('main-header__wr--sticky');
                    mainHeaderWrapper.classList.remove('main-header__wr--end-sticky');
                    mainHeaderWrapper.style.top = -mainHeaderWrapper.outerHTML + 'px';
                } else {
                    waypointOffset = 0;
                    mainHeader.style.height = 'auto';
                    mainHeaderWrapper.classList.remove('main-header__wr--sticky');
                    mainHeaderWrapper.classList.add('main-header__wr--end-sticky');
                }
            },
            offset: function() {
                return -(this.element.clientHeight + waypointOffset);
            }
        });
    }

    // init tabs
    $('.authors-tabs').tabs();
    $('.tabs-steps').tabs();

    // show / hide filter
    let element = document.documentElement;
    let filterShowButton = document.querySelector('.posts__filter-show-button');
    let filterCloseButton = document.querySelector('.filter__close-button');
    let drawerBackdrop = document.querySelector('.drawer-backdrop');

    if (filterShowButton) {
        filterShowButton.addEventListener('click', function () {
            element.classList.add('show-filter');
        });

        filterCloseButton.addEventListener('click', function () {
            element.classList.remove('show-filter');
        });

        drawerBackdrop.addEventListener('click', function () {
            element.classList.remove('show-filter');
        });
    }


    /////////////////////////////////////////////////////////////////////////
    // CRUSH TEST
    let stepForm = $('.step-form');

    stepForm.validate({
        // errorLabelContainer: $('.error-holder'),
        // errorPlacement: function errorPlacement(error, element) { element.before(error); },
        rules: {
            'number-of-people': 'required',
            'subjects': 'required',
            'platform': 'required',
            'scope': 'required'
        },
        messages: {
            'number-of-people': '',
            'subjects': '',
            'platform': '',
            'scope': '',
        }
    });

    $('#smartwizard').smartWizard({
        transitionEffect: 'fade',
        lang: {
            next: 'Далее',
            previous: 'Назад'
        },
        // toolbarExtraButtons: [
        //     $('<button></button>').text('Finish')
        //         .addClass('btn btn-info')
        //         .on('click', function(){
        //             alert('Finsih button click');
        //         }),
        //     $('<button></button>').text('Cancel')
        //         .addClass('btn btn-danger')
        //         .on('click', function(){
        //             alert('Cancel button click');
        //         })
        // ]
    });

    $('#smartwizard').on('leaveStep', function (e, anchorObject, stepNumber, stepDirection) {

        stepForm.validate().settings.ignore = ":disabled,:hidden";
        return stepForm.valid();
    });

    /*
    * Translated default messages for the jQuery validation plugin.
    * Locale: RU (Russian; русский язык)
    */
    $.extend( $.validator.messages, {
        required: "Это поле необходимо заполнить.",
        remote: "Пожалуйста, введите правильное значение.",
        email: "Пожалуйста, введите корректный адрес электронной почты.",
        url: "Пожалуйста, введите корректный URL.",
        date: "Пожалуйста, введите корректную дату.",
        dateISO: "Пожалуйста, введите корректную дату в формате ISO.",
        number: "Пожалуйста, введите число.",
        digits: "Пожалуйста, вводите только цифры.",
        creditcard: "Пожалуйста, введите правильный номер кредитной карты.",
        equalTo: "Пожалуйста, введите такое же значение ещё раз.",
        extension: "Пожалуйста, выберите файл с правильным расширением.",
        maxlength: $.validator.format( "Пожалуйста, введите не больше {0} символов." ),
        minlength: $.validator.format( "Пожалуйста, введите не меньше {0} символов." ),
        rangelength: $.validator.format( "Пожалуйста, введите значение длиной от {0} до {1} символов." ),
        range: $.validator.format( "Пожалуйста, введите число от {0} до {1}." ),
        max: $.validator.format( "Пожалуйста, введите число, меньшее или равное {0}." ),
        min: $.validator.format( "Пожалуйста, введите число, большее или равное {0}." )
    } );
    /////////////////////////////////////////////////////////////////////////


    // masked input
    $('input[type="tel"]').mask('+7 (999) 999-99-99 ');

    // get the width of the scrollbar
    document.documentElement.style.setProperty('--scrollbar-width', (window.innerWidth - document.documentElement.clientWidth) + "px");

    // is mobile
    function isMobile() {
        return $.browser.device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
    }

}); // end ready
