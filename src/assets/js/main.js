/* jslint browser: true, node: true, jquery: true */
/* global window */
'use strict';

//check the environment
// if (process.env.NODE_ENV !== 'production') {
//     console.log('Looks like we are in development mode!');
// }

// import CSS
import scss from '../css/sass.scss';

// import Js Plugins/Entities
import 'bootstrap';
import * as underscore from '../vendor/underscore-min.js';
import '../vendor/hammerjs/hammer.min.js';
import '../vendor/hammerjs/hammer-time.min.js';
import '../vendor/TweenMax.min.js';
import '../vendor/CSSRulePlugin.min.js';
import '../vendor/sweetalert/sweetalert.min.js';
import FooNav from '../vendor/foonav/js/foonav.js';
import '../vendor/isInViewport.js';
import '../vendor/tether/tether.min.js';
import '../vendor/bootstrap-calendar/js/calendar.js';
import '../vendor/bootstrap-calendar/js/calendar-language_es-ES.js';
import '../vendor/blueimp-gallery/js/blueimp-helper.js';
import * as trianglify from '../vendor/trianglify.min.js';
import '../vendor/ScrollToPlugin.min.js';
import * as cardCircle from '../vendor/Card-circle.js';

import * as silverForce from './silverForce.js';
import * as navOptions from './nav.js';
import * as gallery from './gallery.js';
import * as steamEvents from './steamEvents.js';
import * as members from './members.js';
import * as missions from './missions.js';

window.tmpls = {
    'day': require('html-loader!../vendor/bootstrap-calendar/tmpls/day.html'),
    'week': require('html-loader!../vendor/bootstrap-calendar/tmpls/week.html'),
    'week-days': require('html-loader!../vendor/bootstrap-calendar/tmpls/week-days.html'),
    'month': require('html-loader!../vendor/bootstrap-calendar/tmpls/month.html'),
    'month-day': require('html-loader!../vendor/bootstrap-calendar/tmpls/month-day.html'),
    'year': require('html-loader!../vendor/bootstrap-calendar/tmpls/year.html'),
    'year-month': require('html-loader!../vendor/bootstrap-calendar/tmpls/year-month.html'),
    'events-list': require('html-loader!../vendor/bootstrap-calendar/tmpls/events-list.html'),
    'modal': require('html-loader!../vendor/bootstrap-calendar/tmpls/modal.html')
};

window.Trianglify = trianglify;
window.Card = cardCircle.Card;
window._ = underscore;

window.bloquearPantalla = silverForce.bloquearPantalla;
window.desbloquearPantalla = silverForce.desbloquearPantalla;
window.swingTo = silverForce.swingTo;
window.FooNav = FooNav;
window.goTo = navOptions.goTo;
window.goBack = navOptions.goBack;
window.dom = {
    main: null,
    members: null,
    missions: null
};
window.firstMission = missions.firstMission;
window.currentSlideNumber = missions.currentSlideNumber;
window.missionCards = missions.missionCards;

$(function () {

    // Sticky Header
    $(window).scroll(function () {

        if ($(window).scrollTop() > 100) {
            $('.main_h').addClass('sticky');
        } else {
            $('.main_h').removeClass('sticky');
        }
    });

    // Mobile Navigation
    $('.mobile-toggle').click(function () {
        if ($('.main_h').hasClass('open-nav')) {
            $('.main_h').removeClass('open-nav');
        } else {
            $('.main_h').addClass('open-nav');
        }
    });

    $('.main_h li a').click(function () {
        if ($('.main_h').hasClass('open-nav')) {
            $('.navigation').removeClass('open-nav');
            $('.main_h').removeClass('open-nav');
        }
    });

    navOptions.initNavigation();
    navOptions.navStack.push('main');

    $(window).scroll(function () {
        $('#main video').each(function () {
            if ($(this).is(":in-viewport")) {
                $(this)[0].play();
            } else {
                $(this)[0].pause();
            }
        });
    });
    $(window).resize(function () {
        $('.fon-nav')
            .removeClass('fon-open')
            .addClass('fon-closed')
            .css('right', -$('.fon-nav').outerWidth());
    });

    $('#imgLogo').on('click', steamEvents.fncNextEvent);

    $('video').on('click', function () {
        $(this)[0].play();
    });
    $('video').prop("volume", 0.002);

    // Scrolls to the selected menu item on the page
    silverForce.fncProcessLinks2Hash();

    gallery.initGallery('#blueimp-image-carousel');
    steamEvents.initSteamEvents();
    members.initMembers();
    missions.initMissions();

    if (window.location.hash !== undefined &&
        window.location.hash !== null &&
        window.location.hash !== '' &&
        ($(window.location.hash + '.page').length > 0 || window.dom[window.location.hash.split('#')[1]] || window.location.hash.split('-')[1] === 'members')) {
        navOptions.goTo(window.location.hash.split('#')[1]);
    }

}(jQuery));