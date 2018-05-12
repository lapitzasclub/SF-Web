import * as Trianglify from '../vendor/trianglify.min.js';
import '../vendor/ScrollToPlugin.min.js';
import * as cardCircle from '../vendor/Card-circle.js';

export var logros = {};

/**
 * Enum of CSS selectors.
 */
export var SELECTORS = {
  pattern: '.pattern',
  card: '.member',
  cardImage: '.card__image',
  cardClose: '.card__btn-close',
};

/**
 * Enum of CSS classes.
 */
export var CLASSES = {
  patternHidden: 'pattern--hidden',
  polygon: 'polygon',
  polygonHidden: 'polygon--hidden'
};

/**
 * Map of svg paths and points.
 */
export var polygonMap = {
  paths: null,
  points: null
};

/**
 * Container of Card instances.
 */
export var layout = {};

/**
 * Store path elements, map coordinates and sizes.
 * @param {Element} pattern The SVG Element generated with Trianglify.
 * @private
 */
export function _mapPolygons(pattern) {

  // Append SVG to pattern container.
  $(SELECTORS.pattern).append(pattern);

  // Convert nodelist to array,
  // Used `.childNodes` because IE doesn't support `.children` on SVG.
  polygonMap.paths = [].slice.call(pattern.childNodes);

  polygonMap.points = [];

  polygonMap.paths.forEach(function (polygon) {

    // Hide polygons by adding CSS classes to each svg path (used attrs because of IE).
    $(polygon).attr('class', CLASSES.polygon + ' ' + CLASSES.polygonHidden);

    var rect = polygon.getBoundingClientRect();

    var point = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    polygonMap.points.push(point);
  });

  // All polygons are hidden now, display the pattern container.
  $(SELECTORS.pattern).removeClass(CLASSES.patternHidden);
}

/**
 * Bind Card elements.
 * @private
 */
export function _bindCards() {

  var elements = $(SELECTORS.card);

  $.each(elements, function (i, card) {

    var instance = new cardCircle.Card(i, card);

    layout[i] = {
      card: instance
    };

    var cardImage = $(card).find(SELECTORS.cardImage);
    var cardClose = $(card).find(SELECTORS.cardClose);

    $(cardImage).on('click', _playSequence.bind(this, true, i));
    $(cardClose).on('click', _playSequence.bind(this, false, i));
  });
}

/**
 * Create a sequence for the open or close animation and play.
 * @param {boolean} isOpenClick Flag to detect when it's a click to open.
 * @param {number} id The id of the clicked card.
 * @param {Event} e The event object.
 * @private
 *
 */
export function _playSequence(isOpenClick, id, e) {

  var card = layout[id].card;

  // Prevent when card already open and user click on image.
  if (card.isOpen && isOpenClick) return;

  // Create timeline for the whole sequence.
  var sequence = new TimelineLite({
    paused: true
  });

  var tweenOtherCards = _showHideOtherCards(id);
  var title;

  if (!card.isOpen) {
    // Open sequence.
    sequence.add(tweenOtherCards);
    sequence.add(card.openCard(_onCardMove), 0);

    // Cambiar el historial
    title = 'Silver Force - ' + $('#members').data('title') + ' - ' + $('#members').find('#' + card._el.id).data('title');
    window.history.pushState(null, title, '#' + card._el.id + '-members');
    document.title = title;
    window.navStack = ['main', card._el.id + '-members'];

    $('#goBack').show();
    window.fooNav.m.set('#members', fooNav.nav.hasClass('fon-open'));
    $('.header').hide();
    $('body').removeClass('noOverflow-Y');
    $('.footer').show();

  } else {
    // Close sequence.

    var closeCard = card.closeCard();
    var position = closeCard.duration() * 0.8; // 80% of close card tween.

    sequence.add(closeCard);
    sequence.add(tweenOtherCards, position);

    // Cambiar el historial
    title = 'Silver Force - ' + $('#members').data('title');
    window.history.pushState(null, title, '#members');
    document.title = title;
    window.navStack = ['main', 'members'];
  }

  sequence.play();
}

/**
 * Show/Hide all other cards.
 * @param {number} id The id of the clcked card to be avoided.
 * @private
 */
export function _showHideOtherCards(id) {

  var TL = new TimelineLite();

  var selectedCard = layout[id].card;

  for (var i in layout) {

    var card = layout[i].card;

    // When called with `openCard`.
    if (card.id !== id && !selectedCard.isOpen) {
      TL.add(card.hideCard(), 0);
    }

    // When called with `closeCard`.
    if (card.id !== id && selectedCard.isOpen) {
      TL.add(card.showCard(), 0);
    }
  }

  return TL;
}

/**
 * Callback to be executed on Tween update, whatever a polygon
 * falls into a circular area defined by the card width the path's
 * CSS class will change accordingly.
 * @param {Object} track The card sizes and position during the floating.
 * @private
 */
export function _onCardMove(track) {

  var radius = track.width / 2;

  var center = {
    x: track.x,
    y: track.y
  };

  polygonMap.points.forEach(function (point, i) {

    if (_detectPointInCircle(point, radius, center)) {
      $(polygonMap.paths[i]).attr('class', CLASSES.polygon);
    } else {
      $(polygonMap.paths[i]).attr('class', CLASSES.polygon + ' ' + CLASSES.polygonHidden);
    }
  });
}

/**
 * Detect if a point is inside a circle area.
 * @private
 */
export function _detectPointInCircle(point, radius, center) {

  var xp = point.x;
  var yp = point.y;

  var xc = center.x;
  var yc = center.y;

  var d = radius * radius;

  var isInside = Math.pow(xp - xc, 2) + Math.pow(yp - yc, 2) <= d;

  return isInside;
}

/**
 * Initialise demo.
 */
export function initMembers() {

  // For options see: https://github.com/qrohlf/Trianglify
  var pattern = Trianglify({
    width: window.innerWidth,
    height: window.innerHeight,
    cell_size: 90,
    variance: 1,
    stroke_width: 0.6,
    color_function: function (x, y) {
      return '#de6551';
    }
  }).svg(); // Render as SVG.

  _mapPolygons(pattern);

  _bindCards();

  // Objeto con el html de cada logro
  $('#logros').children().each(function () {
    logros[$(this).attr('id')] = '<div>' + $(this).html() + '</div>';
  });

  // Logros de cada miembro
  var miembros = {
    jatxu: {
      logros: ['2y', 'inteligencia', 'propaganda', 'mando_exp', 'medico_exp', 'cqb_exp']
    },
    rednall: {
      logros: ['2y', 'inteligencia', 'propaganda', 'tirador_exp', 'medico', 'cqb']
    },
    martillo: {
      logros: ['2y']
    },
    jose: {
      logros: ['2y']
    },
    zaba: {
      logros: ['2y', 'inteligencia', 'mando', 'medico', 'cqb']
    },
    oriol: {
      logros: ['2y']
    },
    dami: {
      logros: ['2y', 'medico', 'cqb', 'mecanizada']
    },
    jesus: {
      logros: ['2y', 'medico', 'cqb', 'mecanizada_exp']
    },
    nito: {
      logros: ['1y', 'inteligencia', 'propaganda', 'mando_exp', 'tirador_exp', 'mecanizada_exp', 'orientacion', 'cqb_exp', 'medico_exp']
    },
    menorki: {
      logros: ['1y', 'inteligencia', 'mando_exp', 'medico_exp', 'cqb_exp', 'orientacion', 'rto']
    },
    lea: {
      logros: ['1y', 'medico']
    },
    riddick: {
      logros: ['6m', 'propaganda', 'medico_exp', 'cqb', 'orientacion']
    },
    charlie: {
      logros: ['6m', 'medico']
    },
    asasinblack: {
      logros: []
    },
    rod: {
      logros: ['cqb']
    },
    pitofloro: {
      logros: []
    },
    jota: {
      logros: ['medico_exp', 'cqb', 'rto']
    },
    cristian: {
      logros: []
    },
    chicho98: {
      logros: ['medico']
    },
    tito: {
      logros: ['mando_exp', 'cqb']
    },
    kiro: {
      logros: ['cqb']
    },
    joe: {
      logros: ['']
    }
  };

  jQuery.each(miembros, function (iMember, member) {
    jQuery.each(member, function (iLogro, logro) {
      jQuery.each(logro, function (iLogro, logro) {
        $('#' + iMember + '_meritos').append(logros[logro]);
      });
    });
  });

  dom.members = $('#members').detach();
}