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

    // init modal
    $('.btn-modal').fancybox({
        touch : false,
        backFocus : false,
        btnTpl: {
            smallBtn: `
                <button class="modal-common__close fancybox-button fancybox-close-small" type="button" data-fancybox-close title="Закрыть">
                    <svg width="15" height="15" viewBox="0 0 320 320" fill="#000" xmlns="http://www.w3.org/2000/svg"><path d="M207.6 160L315.3 52.3c6.2-6.2 6.2-16.3 0-22.6l-25-25c-6.2-6.2-16.3-6.2-22.6 0L160 112.4 52.3 4.7c-6.2-6.2-16.3-6.2-22.6 0l-25 25c-6.2 6.2-6.2 16.3 0 22.6L112.4 160 4.7 267.7c-6.2 6.2-6.2 16.3 0 22.6l25 25c6.2 6.2 16.3 6.2 22.6 0L160 207.6l107.7 107.7c6.2 6.2 16.3 6.2 22.6 0l25-25c6.2-6.2 6.2-16.3 0-22.6L207.6 160z"/></svg>
                </button>`
        },
    });

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
    let stepQuestions = $('.step-questions__item');
    let totalNumberOfQuestions = stepQuestions.length;
    let stepsFields = $('.step-field-list__field');
    let rulesObj = {};
    let messagesObj = {};

    stepsFields.each(function ( index ) {
        let nameAttribute = $(this).attr('name');

        rulesObj[nameAttribute] = 'required';
        messagesObj[nameAttribute] = '';
    });

    stepForm.validate({
        // errorLabelContainer: $('.error-holder'),
        // errorPlacement: function errorPlacement(error, element) { element.before(error); },
        rules: rulesObj,
        messages: messagesObj
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
                totalPoints += (this.value === 'yes') ? ( 17 / totalNumberOfQuestions ) : ( 3 / totalNumberOfQuestions );
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
                let doc = new DOMParser().parseFromString(data, 'text/html');
                let jsCardList = document.querySelector('.js-card-list');
                let cardListItems = doc.querySelectorAll('.card-list__item');
                let cardListNoProjects = doc.querySelector('.card-list__no-projects');
                let wpPagenaviCurrent = document.querySelector('.wp-pagenavi');
                let wpPagenaviNew = doc.querySelector('.wp-pagenavi');

                // console.log(doc);

                jsCardList.innerHTML = '';

                if (cardListItems) {
                    cardListItems.forEach(function (item, i, arr) {
                        jsCardList.append(item);
                    });
                }

                if (cardListNoProjects) {
                    jsCardList.append(cardListNoProjects);
                }

                if (wpPagenaviCurrent) {
                    if (wpPagenaviNew) {
                        wpPagenaviCurrent.replaceWith(wpPagenaviNew);
                    } else {
                        wpPagenaviCurrent.style.display = 'none';
                    }
                }

                element.classList.remove('show-filter');
                filter.find('button').text('Показать');

                // $('.js-card-list').html(data);
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

    let redirectUrl;

    $('.checklist__btn-download').on('click', function () {

        // get url for redirection
        redirectUrl = $(this).attr('data-redirect-url');
        $('#js-modal-get-checklist').find('#redirect-url').val(redirectUrl);

        let checklistName = $(this).closest('.checklist').find('.checklist-form__title').text();
        $('#js-modal-get-checklist').find('#checklist-name').val(checklistName);
    });

    if ( redirectUrl ) { // if need redirect
        document.addEventListener( 'wpcf7mailsent', function( event ) {
            location = redirectUrl;
        }, false );
    }

    // masked input
    $('input[type="tel"]').mask('+7 (999) 999-99-99 ');

    // get the width of the scrollbar
    document.documentElement.style.setProperty('--scrollbar-width', (window.innerWidth - document.documentElement.clientWidth) + "px");

    // is mobile
    function isMobile() {
        return $.browser.device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
    }

}); // end ready
