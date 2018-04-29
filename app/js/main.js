$(function() {

  // Sticky Header
  $(window).scroll(function() {

    if ($(window).scrollTop() > 100) {
      $('.main_h').addClass('sticky');
    } else {
      $('.main_h').removeClass('sticky');
    }
  });

  // Mobile Navigation
  $('.mobile-toggle').click(function() {
    if ($('.main_h').hasClass('open-nav')) {
      $('.main_h').removeClass('open-nav');
    } else {
      $('.main_h').addClass('open-nav');
    }
  });

  $('.main_h li a').click(function() {
    if ($('.main_h').hasClass('open-nav')) {
      $('.navigation').removeClass('open-nav');
      $('.main_h').removeClass('open-nav');
    }
  });

  initNavigation();
  
  w3.includeHTML(function() {


    navStack.push('main');

    $(window).scroll(function() {
      $('#main video').each(function() {
        if ($(this).is(":in-viewport")) {
          $(this)[0].play();
        } else {
          $(this)[0].pause();
        }
      });
    });
    $(window).resize(function() {
      $('.fon-nav')
        .removeClass('fon-open')
        .addClass('fon-closed')
        .css('right', -$('.fon-nav').outerWidth());
    });

    $('#imgLogo').on('click', fncNextEvent);

    $('video').on('click', function() {
      $(this)[0].play();
    });
    $('video').prop("volume", 0.002);

    // Scrolls to the selected menu item on the page
    fncProcessLinks2Hash();

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

    initMembers();

    initMissions();

    if (window.location.hash !== undefined &&
      window.location.hash !== null &&
      window.location.hash !== '' &&
      ($(window.location.hash + '.page').length > 0 || dom[window.location.hash.split('#')[1]] || window.location.hash.split('-')[1] === 'members')) {
      goTo(window.location.hash.split('#')[1]);
    }

  });
}(jQuery));
