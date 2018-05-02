export var currentSlideNumber = 0;
export var missionCards = {};

export function firstMission() {
  currentSlideNumber = 0;
  $("#missions_init .background").detach();
  $(missionCards).each(function (i, e) {
    $(e).removeClass('down-scroll');
    $(e).removeClass('up-scroll');
  });
  $('#missions_init').append(missionCards[0]);
  $('#missions_init').append(missionCards[1]);
}

export function initMissions() {
  var delta = 0;
  var ticking = false;
  var isFirefox = (/Firefox/i.test(navigator.userAgent));
  var isIe = (/MSIE/i.test(navigator.userAgent)) || (/Trident.*rv\:11\./i.test(navigator.userAgent));
  var scrollSensitivitySetting = 30; //Increase/decrease this number to change sensitivity to trackpad gestures (up = less sensitive; down = more sensitive)
  var slideDurationSetting = 600; //Amount of time for which slide is "locked"
  var totalSlideNumber = $("#missions .background").length;
  missionCards = $("#missions_init .background").detach();

  $('#missions_init').append(missionCards[0]);
  $('#missions_init').append(missionCards[1]);

  // ------------- DETERMINE DELTA/SCROLL DIRECTION ------------- //
  function parallaxScroll(evt) {
    if ($('#missions').length > 0) {
      if (isFirefox) {
        //Set delta for Firefox
        delta = evt.detail * (-120);
      } else if (isIe) {
        //Set delta for IE
        delta = -evt.deltaY;
      } else {
        //Set delta for all other browsers
        if (evt.wheelDelta !== undefined) {
          delta = evt.wheelDelta;
        } else if (evt.type === 'pandown' || evt.type === 'panright') {
          delta = scrollSensitivitySetting + 1;
        } else if (evt.type === 'panup' || evt.type === 'panleft') {
          delta = -scrollSensitivitySetting - 1;
        }
      }

      if (evt.keyCode) {
        if (evt.keyCode === 13) {
          eval($('#missions_init .background:eq(1) a').attr('href').split(':')[1]);
        } else if (event.keyCode === 38) {
          delta = 101;
        } else if (event.keyCode === 40) {
          delta = -101;
        } else {
          delta = 0;
        }
      }

      if (ticking != true) {
        if (delta <= -scrollSensitivitySetting) {
          //Down scroll
          ticking = true;
          if (currentSlideNumber !== totalSlideNumber - 1) {
            currentSlideNumber++;
            nextItem();
          }
          slideDurationTimeout(slideDurationSetting);
        }
        if (delta >= scrollSensitivitySetting) {
          //Up scroll
          ticking = true;
          if (currentSlideNumber !== 0) {
            currentSlideNumber--;
          }
          previousItem();
          slideDurationTimeout(slideDurationSetting);
        }
      }
    }
  }

  // ------------- SET TIMEOUT TO TEMPORARILY "LOCK" SLIDES ------------- //
  function slideDurationTimeout(slideDuration) {
    setTimeout(function () {
      ticking = false;
    }, slideDuration);
  }

  // ------------- ADD EVENT LISTENER ------------- //
  var mousewheelEvent = isFirefox ? "DOMMouseScroll" : "wheel";
  document.getElementById('missions').addEventListener(mousewheelEvent, _.throttle(parallaxScroll, 60), false);
  var hammertime = new Hammer(document.getElementById('missions'));
  hammertime.get('pan').set({
    enable: true,
    direction: Hammer.DIRECTION_ALL
  });
  hammertime.on('panup', parallaxScroll);
  hammertime.on('pandown', parallaxScroll);
  $(window).on('keyup', parallaxScroll);

  // ------------- SLIDE MOTION ------------- //
  function nextItem() {
    var $previousSlide;
    if ($("#missions_init .background").length > 2) {
      $previousSlide = $(".background").eq(1);
    } else {
      $previousSlide = $(".background").eq(0);
    }
    $previousSlide.removeClass("up-scroll").addClass("down-scroll");

    if ($("#missions_init .background").length > 2) {
      $("#missions_init .background").eq(0).detach();
    }
    $('#missions_init').append(missionCards[currentSlideNumber + 1]);

    if ($('.background video').length > 0) {
      $('.background video')[0].play();
    }
  }

  function previousItem() {
    var $currentSlide = $(".background").eq(0);
    $currentSlide.removeClass("down-scroll").addClass("up-scroll");

    if ($("#missions_init .background").length > 2) {
      $("#missions_init .background:last").detach();
    }
    $('#missions_init').prepend(missionCards[currentSlideNumber - 1]);

    if ($('.background video').length > 0) {
      $('.background video')[0].play();
    }
  }

  // ----------- BG Carousels -------------- //
  $('.missions .carousel').carousel({
    interval: 5000
  });

  // Sacar del DOM las misiones
  $('.page.missions').each(function (i, e) {
    dom[$(e).attr('id')] = $(e).detach();
  });

  // Sacar del DOM el índice de misiones
  dom.missions = $('#missions').detach();
}