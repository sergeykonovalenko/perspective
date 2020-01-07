$(document).ready(function () {
    'use strict';

    const element = document.documentElement;

    // is mobile
    const is_mobile = isMobile();
    if (is_mobile) element.classList.add('is-mobile');

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

    // show/hide mobile menu
    let hamburger = document.querySelector('.main-header__hamburger');
    hamburger.addEventListener('click', function () {
        if ( element.classList.contains('show-main-nav') ) {
            element.classList.remove('show-main-nav');
        } else {
            element.classList.add('show-main-nav');
        }
    });

    $('.main-header__hamburger').on('click', function () {
        $('body:not(.show-internal-nav)').toggleClass('show-main-nav');
        $('body').removeClass('show-internal-nav');
    });

    // init tabs
    $('.authors-tabs').tabs();
    $('.tabs-steps').tabs();

    // show / hide filter
    let filterShowButton = document.querySelector('.posts__filter-show-button');
    let filterShowButtonMobile = document.querySelector('.actions-posts__filter-show-button');
    let filterCloseButton = document.querySelector('.filter__close-button');
    let drawerBackdrop = document.querySelector('.drawer-backdrop');

    if (filterShowButton || filterShowButtonMobile) {
        filterShowButton.addEventListener('click', function () {
            element.classList.add('show-filter');
        });

        filterShowButtonMobile.addEventListener('click', function () {
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
            'question-1': 'required',
            'question-2': 'required',
            'question-3': 'required',
            'question-4': 'required',
            'question-5': 'required',
            'question-6': 'required',
            'question-7': 'required',
            'question-8': 'required',
        },
        messages: {
            'question-1': '',
            'question-2': '',
            'question-3': '',
            'question-4': '',
            'question-5': '',
            'question-6': '',
            'question-7': '',
            'question-8': '',
        }
    });

    $('#smartwizard').smartWizard({
        showStepURLhash: false,
        transitionEffect: 'fade',
        lang: {
            next: 'Далее',
            previous: 'Назад'
        },
    });

    // Initialize the showStep event
    $('#smartwizard').on('showStep', function(e, anchorObject, stepNumber, stepDirection) {
        let totalSteps = anchorObject.prevObject.length;

        // events for the last step
        if ( (stepNumber + 1) === totalSteps ) {
            let data = $('.step-form').serializeArray();
            let totalPoints = 0;

            $.each(data,function() {
                totalPoints += (this.value === 'yes') ? 3.4 : 0.6;
            });

            if (totalPoints >= 17) {
                showResults(1);
            } else if (totalPoints >=12 && totalPoints < 17) {
                showResults(2);
            } else if (totalPoints >=9 && totalPoints < 12) {
                showResults(3);
            } else if (totalPoints >=4 && totalPoints < 9) {
                showResults(4);
            } else {
                showResults(5);
            }

            function showResults(index) {
                let resultModifier = `.test-result--${index}`;
                $('.test-result').hide();
                $(resultModifier).show();
            }

            $('.sw-btn-next').text('Финиш');
        } else {
            $('.sw-btn-next').text('Далее');
        }
    });

    // Initialize the leaveStep event
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

    /////////////////////////////////////////////////////////////////////////
    // Post Filter. jQuery script to Send a Request and to Receive Result Data
    $('.js-filter-form').submit(function(){
        let filter = $(this);
        $.ajax({
            url: filter.attr('action'),
            data: filter.serialize(),
            type: filter.attr('method'),
            beforeSend:function(xhr){
                filter.find('button').text('Загружаю...');
            },
            success:function(data){
                //console.log(data);
                element.classList.remove('show-filter');
                filter.find('button').text('Показать');
                $('.js-card-list').html(data);
            }
        });
        return false;
    });

    // Post Filter Index. jQuery script to Send a Request and to Receive Result Data
    $('.filter-row .filter-field-box__field').on('change', function () {
        let filter = $('.js-implemented-cases-form');
        $.ajax({
            url: filter.attr('action'),
            data: filter.serialize(),
            type: filter.attr('method'),
            beforeSend:function(xhr){
                $('.loader').addClass('loader--show');
            },
            success:function(data){
                //console.log(data);
                $('.js-card-list').html(data);
                $('.loader').removeClass('loader--show');
            }
        });
        return false;
    });
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
