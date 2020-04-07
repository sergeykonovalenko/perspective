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

    let btnFinish = $('<button type="button"></button>').text('Финиш')
        .addClass('btn my-btn-finish')
        .on('click', function(e) {
            e.preventDefault();
            location.reload();
            element.scrollIntoView(top);
            $('.step-field-list__field').prop('checked', false);
        });

    $('#smartwizard').smartWizard({
        showStepURLhash: false,
        transitionEffect: 'fade',
        lang: {
            next: 'Далее',
            previous: 'Назад'
        },
        toolbarSettings: {
            // toolbarPosition: 'right',
            toolbarExtraButtons: [btnFinish]
        },
    });

    // Initialize the leaveStep event
    $('#smartwizard').on('leaveStep', function (e, anchorObject, stepNumber, stepDirection) {
        stepForm.validate().settings.ignore = ":disabled,:hidden";

        // валидация будет учитываться только при движенее вперед, но не назад
        if (stepDirection === 'forward') {
            return stepForm.valid();
        }

        return true;
    });

    // Initialize the showStep event
    $('#smartwizard').on('showStep', function(e, anchorObject, stepNumber, stepDirection) {
        let totalSteps = anchorObject.prevObject.length;

        // events for the last step
        if ( (stepNumber + 1) === totalSteps ) {
            // общее количество блоков
            let thematicBlocks = $('.thematic-block');
            let totalBlocks = thematicBlocks.length;
            // предел количества отрицательных блоков (больше половины)
            let limitFailedBlocks = Math.floor(totalBlocks / 2) + 1;
            // общее количество отрицательных блоков
            let totalFailedBlocks = 0;
            // идентификатор показываемого блока с результатами теста
            let resultIdentifier = '';

            $('.test-result').hide();

            thematicBlocks.each(function (index) {
                let totalBlockFields = $(this).find('.step-field-list__field:checked');

                // определить общее количество отрицательных ответов блока
                let totalFailedBlockAnswers = 0;
                totalBlockFields.each(function () {
                    if ( $(this).val() === 'no' ) totalFailedBlockAnswers++;
                });

                // если пользователь дал 2 и больше отрицательных ответов на вопросы блока
                if (totalFailedBlockAnswers >= 2) {
                    totalFailedBlocks++;
                    resultIdentifier += (index + 1);
                }
            });

            if (totalFailedBlocks === 0) {
                // если количество отрицательных блоков равно нулю
                $('.test-result--best-result').show();
            } else if (totalFailedBlocks >= limitFailedBlocks) {
                // если количество отрицательных блоков равно или больше допустимого предела
                $('.test-result--worst-result').show();
            } else {
                // если нужно использовать другую доступную комбинацию
                $(`.test-result--${resultIdentifier}`).show();
            }

            // $('.sw-btn-next').text('Финиш');
            $('.sw-btn-next').hide();
            $('.sw-btn-group-extra').show();
        } else {
            $('.sw-btn-next').show();
            $('.sw-btn-group-extra').hide();
            // $('.sw-btn-next').text('Далее');
        }
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
                let doc = new DOMParser().parseFromString(data, 'text/html');
                let jsCardList = document.querySelector('.js-card-list');
                let cardListItems = doc.querySelectorAll('.card-list__item');
                let cardListNoProjects = doc.querySelector('.card-list__no-projects');
                let wpPageNaviCurrent = document.querySelector('.wp-pagenavi');
                let wpPageNaviNew = doc.querySelector('.wp-pagenavi');

                // console.log(data);
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

                if (wpPageNaviCurrent) {
                    if (wpPageNaviNew) {
                        wpPageNaviCurrent.replaceWith(wpPageNaviNew);
                    } else {
                        wpPageNaviCurrent.style.display = 'none';
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
                let doc = new DOMParser().parseFromString(data, 'text/html');
                let jsCardList = document.querySelector('.js-card-list');
                let cardListItems = doc.querySelectorAll('.card-list__item');
                let cardListNoProjects = doc.querySelector('.card-list__no-projects');

                jsCardList.innerHTML = '';

                if (cardListItems) {
                    cardListItems.forEach(function (item, i, arr) {
                        jsCardList.append(item);
                    });
                }

                if (cardListNoProjects) {
                    jsCardList.append(cardListNoProjects);
                }

                //$('.js-card-list').html(data);

                $('.loader').removeClass('loader--show');
            }
        });
        return false;
    });
    /////////////////////////////////////////////////////////////////////////

    // checklist redirect
    let redirectUrl = '';

    $('.check-list-item__btn-download').on('click', function () {
        // get url for redirection
        redirectUrl = $(this).attr('data-redirect-url');

        $('#js-modal-get-checklist').find('#redirect-url').val(redirectUrl);

        let checklistName = $(this).closest('.check-list-item').find('.check-list-item__head').text();
        $('#js-modal-get-checklist').find('#checklist-name').val(checklistName);

        if ( redirectUrl ) { // if need redirect
            document.addEventListener( 'wpcf7mailsent', function( event ) {
                location = redirectUrl;
            }, false );
        }
    });

    // check-lists
    $('.check-list-item__head').on('click', function () {
        let currentCheckListItem = $(this).closest('.check-list-item');

        currentCheckListItem.toggleClass('check-list-item--open');
        currentCheckListItem.find('.check-list-item__body').slideToggle(300);
    });

    // masked input
    $('input[type="tel"]').mask('+7 (999) 999-99-99 ');

    // get the width of the scrollbar
    document.documentElement.style.setProperty('--scrollbar-width', (window.innerWidth - document.documentElement.clientWidth) + "px");

    // is mobile
    function isMobile() {
        return $.browser.device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
    }

}); // end ready
