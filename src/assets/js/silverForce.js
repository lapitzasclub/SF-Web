export function swingTo(selector) {
  $('html,body').animate({
    scrollTop: $(selector).offset().top - $('.main_h').outerHeight()
  }, 1000);
}

export function fncProcessLinks2Hash(selector) {
  if (selector == null) {
    selector = 'a[href*="#"]:not([href="#"],[data-toggle],[data-target],[data-slide])';
  }

  $(selector).click(function() {
    swal.close();

    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') ||
      location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
}

export function bloquearPantalla() {
  var tl = new TimelineMax();

  tl.to(CSSRulePlugin.getRule('body:before'), 0.2, {
      cssRule: {
        top: '50%'
      },
      ease: Power2.easeOut
    }, 'close')
    .to(CSSRulePlugin.getRule('body:after'), 0.2, {
      cssRule: {
        bottom: '50%'
      },
      ease: Power2.easeOut
    }, 'close')
    .to($('.loading'), 0.2, {
      opacity: 1
    });
}

export function desbloquearPantalla() {
  var tl = new TimelineMax();

  tl.to(CSSRulePlugin.getRule('body:before'), 0.2, {
      cssRule: {
        top: '0%'
      },
      ease: Power2.easeOut
    }, 'open')
    .to(CSSRulePlugin.getRule('body:after'), 0.2, {
      cssRule: {
        bottom: '0%'
      },
      ease: Power2.easeOut
    }, '-=0.2', 'open')
    .to($('.loading'), 0.2, {
      opacity: 0
    }, '-=0.2');
}
