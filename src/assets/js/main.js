/* jslint browser: true, node: true, jquery: true */
/* global window */
'use strict';

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
import '../vendor/isInViewport.js';
import '../vendor/tether/tether.min.js';

import * as silverForce from './silverForce.js';
import * as navOptions from './nav.js';
import * as gallery from './gallery.js';
// import * as steamEvents from './steamEvents.js';
import * as members from './members.js';
import * as missions from './missions.js';

import fontawesome from '@fortawesome/fontawesome';
import farEnvelope from '@fortawesome/fontawesome-free-regular/faEnvelope';
import farCircle from '@fortawesome/fontawesome-free-regular/faCircle';
import fabDiscord from '@fortawesome/fontawesome-free-brands/faDiscord';
import fabGooglePlus from '@fortawesome/fontawesome-free-brands/faGooglePlus';
import fabSteam from '@fortawesome/fontawesome-free-brands/faSteam';
import fabYoutube from '@fortawesome/fontawesome-free-brands/faYoutube';
import faTwitter from '@fortawesome/fontawesome-free-brands/faTwitter';
import fasCircle from '@fortawesome/fontawesome-free-solid/faCircle';
import fasUser from '@fortawesome/fontawesome-free-solid/faUser';
import fasUsers from '@fortawesome/fontawesome-free-solid/faUsers';
import fasCompass from '@fortawesome/fontawesome-free-solid/faCompass';
import fasBinoculars from '@fortawesome/fontawesome-free-solid/faBinoculars';
import fasSitemap from '@fortawesome/fontawesome-free-solid/faSitemap';
import fasArrowLeft from '@fortawesome/fontawesome-free-solid/faArrowLeft';
import fasArrowRight from '@fortawesome/fontawesome-free-solid/faArrowRight';
import fasEnvelope from '@fortawesome/fontawesome-free-solid/faEnvelope';
import fasTimes from '@fortawesome/fontawesome-free-solid/faTimes';

fontawesome.library.add(
    farEnvelope, farCircle, fabSteam, fabYoutube, fabDiscord, fabGooglePlus,
    faTwitter, fasUser, fasUsers, fasCompass, fasBinoculars, fasSitemap,
    fasArrowLeft, fasArrowRight, fasEnvelope, fasTimes);

window._ = underscore;

window.bloquearPantalla = silverForce.bloquearPantalla;
window.desbloquearPantalla = silverForce.desbloquearPantalla;
window.swingTo = silverForce.swingTo;
window.fooNav = null;
window.navStack = [];
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
    window.navStack.push('main');

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

    // $('#imgLogo').on('click', steamEvents.fncNextEvent);

    $('video').on('click', function () {
        $(this)[0].play();
    });
    $('video').prop("volume", 0.002);

    // Scrolls to the selected menu item on the page
    silverForce.fncProcessLinks2Hash();

    gallery.initGallery('#blueimp-image-carousel');
    // steamEvents.initSteamEvents();
    members.initMembers();
    missions.initMissions();

    if (window.location.hash !== undefined &&
        window.location.hash !== null &&
        window.location.hash !== '' &&
        ($(window.location.hash + '.page').length > 0 || window.dom[window.location.hash.split('#')[1]] || window.location.hash.split('-')[1] === 'members')) {
        navOptions.goTo(window.location.hash.split('#')[1]);
    }

}(jQuery));