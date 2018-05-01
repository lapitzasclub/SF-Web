'use strict';

//check the environment
// if (process.env.NODE_ENV !== 'production') {
//     console.log('Looks like we are in development mode!');
// }

// import CSS
import scss from '../css/sass.scss';

// import Js Plugins/Entities
import 'bootstrap';

import '../vendor/underscore-min.js';
import '../vendor/hammerjs/hammer.min.js';
import '../vendor/hammerjs/hammer-time.min.js';
import '../vendor/TweenMax.min.js';
import '../vendor/CSSRulePlugin.min.js';
import '../vendor/sweetalert/sweetalert.min.js';
import FooNav from '../vendor/foonav/js/foonav.js';
import '../vendor/isInViewport.js';
import '../vendor/tether/tether.min.js';
/*
import '../vendor/momentjs/global.js';
import '../vendor/momentjs/moment-with-locales.min.js';
import '../vendor/momentjs/moment-timezone-with-data.min.js';
*/
import '../vendor/bootstrap-calendar/js/calendar.js';
import '../vendor/bootstrap-calendar/js/calendar-language_es-ES.js';
import '../vendor/blueimp-gallery/js/blueimp-helper.js';
import '../vendor/blueimp-gallery/js/blueimp-gallery.min.js';
import '../vendor/blueimp-gallery/js/blueimp-gallery-fullscreen.js';
import '../vendor/blueimp-gallery/js/blueimp-gallery-indicator.js';
import '../vendor/blueimp-gallery/js/blueimp-gallery-video.js';
import '../vendor/blueimp-gallery/js/blueimp-gallery-vimeo.js';
import '../vendor/blueimp-gallery/js/blueimp-gallery-youtube.js';
import '../vendor/blueimp-gallery/js/jquery.blueimp-gallery.min.js';
import Trianglify from '../vendor/trianglify.min.js';
import '../vendor/ScrollToPlugin.min.js';
import '../vendor/Card-circle.js';

import './gallery.js';


import * as silverForce from './silverForce.js';
import * as navOptions from './nav.js';
import * as steamEvents from './steamEvents.js';
import * as members from './members.js';
import * as missions from './missions.js';

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

//ES6 Module
import Bar1 from './entities/Bar1';
//CommonJS
var Bar2 = require('./entities/Bar2');


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

    /*
    // Inicializar el carrusel
    blueimp.Gallery(
        carouselLinks, {
            container: '#blueimp-image-carousel',
            carousel: true,
            clearSlides: true,
            stretchImages: true
        });

    // Mostrar las más vistas de la galería
    fncGetAllPhotosList();

    // Inicializar el calendario de eventos de steam
    calendar = $('#calendar').calendar(options);

    fncCalendarButtons();
    */

    members.initMembers();

    missions.initMissions();

    if (window.location.hash !== undefined &&
        window.location.hash !== null &&
        window.location.hash !== '' &&
        ($(window.location.hash + '.page').length > 0 || dom[window.location.hash.split('#')[1]] || window.location.hash.split('-')[1] === 'members')) {
        goTo(window.location.hash.split('#')[1]);
    }

}(jQuery));