import FooNav from '../vendor/foonav/js/foonav.js';

export function goTo(page, selector, goingBack) {
  // Si no se está volviendo se apila la pantalla
  if (!goingBack && window.navStack[window.navStack.length - 1] !== page) {
    window.navStack.push(page);
  }

  // Si no se quiere navegar a un subapartado se empieza arriba
  if (selector === undefined || selector === null || selector === '') {
    selector = 'body';
  }

  // Si la página a la que se va es la actual navegaremos al subapartado
  if ($('#' + page).hasClass('show') || (page.indexOf('members') > 0 && $('#members').hasClass('show'))) {
    swingTo(selector);

    if (page.indexOf('members') > 0) {
      $('#members').find('#' + page.split('-')[0] + ' .card__image').trigger('click');
    }
  } else { // Navegar a otra pantalla
    bloquearPantalla();

    setTimeout(function () {
      // Descargar el DOM
      dom[$('.page.show').attr('id')] = $('.page.show').detach();
      $('.footer').before(dom[page]);

      // Siempre se vuelve a la primera mision
      firstMission();

      var title;

      if (page === 'main') {
        // Cambiar el historial
        title = 'Silver Force';
        window.history.pushState(null, 'Silver Force', '/');
        document.title = title;

        window.navStack = ['main'];
        window.fooNav.m.set(null, fooNav.nav.hasClass('fon-open'));
        $('#goBack').hide();
        $('.header').show();
        $('body').removeClass('noOverflow-Y');
        $('.footer').show();
      } else if (page.indexOf('members') > 0) {
        var member = page.split('-')[0];
        page = 'members';
        $('.footer').before(dom[page]);
        $('#members').find('#' + member + ' .card__image').trigger('click');
      } else {
        // Cambiar el historial
        title = 'Silver Force - ' + $('#' + page).data('title');
        window.history.pushState(null, title, '#' + page);
        document.title = title;

        $('#goBack').show();
        window.fooNav.m.set('#' + page, fooNav.nav.hasClass('fon-open'));

        if (page === 'missions') {
          $('.header').hide();
          $('body').addClass('noOverflow-Y');
          $('.footer').hide();
        } else {
          $('.header').hide();
          $('body').removeClass('noOverflow-Y');
          $('.footer').show();
        }
      }

      $('.page.show').removeClass('show');
      $('#' + page).addClass('show');

      setTimeout(function () {
        swingTo(selector);

        // Al navegar se cierra el menú si está abierto
        if ($('.fon-nav').hasClass('fon-open')) {
          window.fooNav.toggle();
        }

        desbloquearPantalla();
      }, '400');
    }, '400');
  }
}

export function goBack() {
  var last = window.navStack.pop();
  if (last.indexOf('members') > 0) {
    window.navStack.push('members');
    $('#members').find('#' + last.split('-')[0] + ' .card__btn-close').trigger('click');
  } else {
    goTo(window.navStack[window.navStack.length - 1], 'body', true);
  }
}

export function initNavigation() {
  var fnavOptions = {
    classes: '',
    items: [{
      href: '#reclutamiento',
      onclick: "goTo('main', '#reclutamiento')",
      text: 'Reclutamiento'
    }, {
      href: '#premisas',
      onclick: "goTo('main', '#premisas')",
      text: 'Nuestras premisas',
      children: [{
        href: '#premisa1',
        onclick: "goTo('main', '#premisa1')",
        text: 'Protégete'
      }, {
        href: '#premisa2',
        onclick: "goTo('main', '#premisa2')",
        text: 'Eres parte de un todo'
      }, {
        href: '#premisa3',
        onclick: "goTo('main', '#premisa3')",
        text: 'No pierdas tu ubicación'
      }, {
        href: '#premisa4',
        onclick: "goTo('main', '#premisa4')",
        text: 'Controla el entorno'
      }]
    }, {
      href: '#members',
      onclick: "goTo('members')",
      text: 'Barracones',
      children: [{
        href: '#jatxu',
        onclick: "goTo('jatxu-members')",
        text: 'Jatxu'
      }, {
        href: '#rednall',
        onclick: "goTo('rednall-members')",
        text: 'Rednall'
      }, {
        href: '#martillo',
        onclick: "goTo('martillo-members')",
        text: 'Martillo'
      }, {
        href: '#jose',
        onclick: "goTo('jose-members')",
        text: 'Jose'
      }, {
        href: '#zaba',
        onclick: "goTo('zaba-members')",
        text: 'Zaba'
      }, {
        href: '#dami',
        onclick: "goTo('dami-members')",
        text: 'Dami'
      }, {
        href: '#jesus',
        onclick: "goTo('jesus-members')",
        text: 'Jesus'
      }, {
        href: '#nito',
        onclick: "goTo('nito-members')",
        text: 'Nito'
      }, {
        href: '#menorki',
        onclick: "goTo('menorki-members')",
        text: 'Menorki'
      }, {
        href: '#lea',
        onclick: "goTo('lea-members')",
        text: 'Lea'
      }, {
        href: '#oriol',
        onclick: "goTo('oriol-members')",
        text: 'Oriol'
      }, {
        href: '#riddick',
        onclick: "goTo('riddick-members')",
        text: 'Riddick'
      }, {
        href: '#khuru',
        onclick: "goTo('khuru-members')",
        text: 'Khuru'
      }, {
        href: '#charlie',
        onclick: "goTo('charlie-members')",
        text: 'CharlieGlasgow'
      }, {
        href: '#asasinblack',
        onclick: "goTo('asasinblack-members')",
        text: 'Asasinblack'
      }, {
        href: '#lluis',
        onclick: "goTo('lluis-members')",
        text: 'Lluis'
      }, {
        href: '#rod',
        onclick: "goTo('rod-members')",
        text: 'Rod'
      }, {
        href: '#pitofloro',
        onclick: "goTo('pitofloro-members')",
        text: 'Dani (Pitofloro)'
      }, {
        href: '#jota',
        onclick: "goTo('jota-members')",
        text: 'Jota'
      }, {
        href: '#cristian',
        onclick: "goTo('cristian-members')",
        text: 'Cristian'
      }, {
        href: '#chicho98',
        onclick: "goTo('chicho98-members')",
        text: 'Chicho98'
      }, {
        href: '#tito',
        onclick: "goTo('tito-members')",
        text: 'Tito'
      }, {
        href: '#kiro',
        onclick: "goTo('kiro-members')",
        text: 'Kiro'
      }]
    }, {
      href: '#missions',
      onclick: "goTo('missions', '#missions_init')",
      text: 'Archivo de misiones',
      children: [{
        href: '#oroBlanco',
        onclick: "goTo('oroBlanco')",
        text: 'Oro Blanco',
        children: [{
          href: '#opAtenea',
          onclick: "goTo('opAtenea')",
          text: 'Op. Atenea'
        }, {
          href: '#golpeAlCartel',
          onclick: "goTo('golpeAlCartel')",
          text: 'Golpe al cártel'
        }, {
          href: '#sangrePorSangre',
          onclick: "goTo('sangrePorSangre')",
          text: 'Sangre por sangre'
        }]
      }, {
        href: '#nightRescue',
        onclick: "goTo('nightRescue')",
        text: 'Night rescue'
      }, {
        href: '#sasGodShaveTheQueen',
        onclick: "goTo('sasGodShaveTheQueen')",
        text: 'SAS - God shave the queen'
      }, {
        href: '#silverOrLead',
        onclick: "goTo('silverOrLead')",
        text: 'Silver or lead'
      }, {
        href: '#nightForce',
        onclick: "goTo('nightForce')",
        text: 'Night force'
      }, {
        href: '#cazaDeBrujas',
        onclick: "goTo('cazaDeBrujas')",
        text: 'Caza de brujas'
      }, {
        href: '#cazaAlTerrorista',
        onclick: "goTo('cazaAlTerrorista')",
        text: 'Caza al terrorista'
      }, {
        href: '#opFuerzaLetal',
        onclick: "goTo('opFuerzaLetal')",
        text: 'Op. fuerza letal'
      }, {
        href: '#birdInChains',
        onclick: "goTo('birdInChains')",
        text: 'Bird in chains'
      }, {
        href: '#searchingWeapons',
        onclick: "goTo('searchingWeapons')",
        text: 'Searching weapons'
      }, {
        href: '#bengasiDefense',
        onclick: "goTo('bengasiDefense')",
        text: 'Bengasi defense'
      }, {
        href: '#blueWings',
        onclick: "goTo('blueWings')",
        text: 'Blue wings'
      }, {
        href: '#opPropositosEspeciales',
        onclick: "goTo('opPropositosEspeciales')",
        text: 'Op. propósitos especiales'
      }, {
        href: '#oktoberfest',
        onclick: "goTo('oktoberfest')",
        text: 'Oktoberfest'
      }, {
        href: '#opGarra',
        onclick: "goTo('opGarra')",
        text: 'Op. garra'
      }, {
        href: '#leonesYHienas',
        onclick: "goTo('leonesYHienas')",
        text: 'Leones y hienas'
      }, {
        href: '#badBusiness',
        onclick: "goTo('badBusiness')",
        text: 'Bad business'
      }, {
        href: '#opActuacionDirecta',
        onclick: "goTo('opActuacionDirecta')",
        text: 'Op. actuación directa'
      }, {
        href: '#valleyOfTheDamned',
        onclick: "goTo('valleyOfTheDamned')",
        text: 'Valley of the damned'
      }]
    }, {
      href: '#portfolio',
      onclick: "goTo('main', '#portfolio')",
      text: 'Canales oficiales',
      children: [{
        href: 'https://units.arma3.com/unit/silverforce',
        text: 'Arma Unit'
      }, {
        href: 'https://www.youtube.com/channel/UCXNKuMLxDiy2SUAvclyr6pA',
        text: 'Youtube'
      }, {
        href: 'http://steamcommunity.com/groups/arma3clansilverforce',
        text: 'Steam Group'
      }, {
        href: 'https://www.flickr.com/photos/145043982@N02',
        text: 'Flickr'
      }]
    }, {
      href: '#gallery',
      onclick: "goTo('main', '#gallery')",
      text: 'Galería'
    }, {
      href: '#events',
      onclick: "goTo('main', '#events')",
      text: 'Plan de batallas'
    }, {
      href: '#infoArma3',
      onclick: "goTo('main', '#infoArma3')",
      text: 'Acerca de ArmA III'
    }, {
      href: '#comunidades',
      onclick: "goTo('main', '#comunidades')",
      text: 'Comunidades amigas'
    }],
    position: 'fon-top-right',
    theme: 'fon-dark'
  };

  FooNav.init(fnavOptions).ready(function (nav) {
    window.fooNav = nav;
    nav.buttons.children(':last').before('<a id="goBack" class="fon-button fon-button-top fon-show" href="javascript:goBack();" style="display:none;"><span class="fon-button-icon fon-icon fon-icon-back"></span></a>');
    window.fooNav.m.resize();
  });
}