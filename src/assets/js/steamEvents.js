export var options = {
  language: 'es-ES',
  events_source: getSteamGroupEvents,
  view: 'month',
  tmpl_path: './assets/bootstrap-calendar/tmpls/',
  tmpl_cache: false,
  // day: '2013-03-12',
  onAfterEventsLoad: function(events) {
    if (!events) {
      return;
    }
    var list = $('#eventlist');
    list.html('');

    $.each(events, function(key, val) {
      $(document.createElement('li'))
        .html('<a href="' + val.url + '">' + val.title + '</a>')
        .appendTo(list);
    });
  },
  onAfterViewLoad: function(view) {
    $('.page-header h3').text(this.getTitle());
    $('.btn-group button').removeClass('active');
    $('button[data-calendar-view="' + view + '"]').addClass('active');
  },
  classes: {
    months: {
      general: 'label'
    }
  }
};

export var calendar;

export function getSteamGroupEvents(from, to) {
  calendarEvents = [];
  var eventsPending = 0;

  // Se recorren los años del intervalo
  for (var year = from.getFullYear(); year <= to.getFullYear(); year++) {
    var endMonth = year == to.getFullYear() ? to.getMonth() : 11;
    // Se recorren los meses del intervalo
    for (var month = from.getMonth(); month <= endMonth; month++) {
      var xmlSource = 'http://steamcommunity.com/gid/103582791440841071/events?xml=1&action=eventFeed&month=' + (month + 1) + '&year=' + year

      // build the yql query. Could be just a string - I think join makes easier reading
      var yqlURL = [
        "http://query.yahooapis.com/v1/public/yql",
        "?q=" + encodeURIComponent("select * from xml where url='" + xmlSource + "'"),
        "&format=xml&callback=?"
      ].join("");

      eventsPending++;

      // Now do the AJAX heavy lifting
      $.getJSON(yqlURL, function(data) {
        xmlContent = $(data.results[0]);
        var arrEvents = $(xmlContent).find("event");
        var arrExpiredEvents = $(xmlContent).find("expiredEvent");
        var month = moment($(data.results[0]).find('monthName').html().split(/[\[\]]/)[2], 'MMMM').format('MM');
        var year = moment($(data.results[0]).find('year').html().split(/[\[\]]/)[2], 'YYYY').format('YYYY');

        arrEvents.each(function(i, e) {
          var day = parseInt($($(e).find('.eventDateBlock').find('span')[0]).text().replace(/[^0-9\.]/g, ''), 10);
          var hours = $($(e).find('.eventDateBlock').find('span')[1]).text().substr(0, 2);
          var minutes = $($(e).find('.eventDateBlock').find('span')[1]).text().substr(3, 2);
          var pm = $($(e).find('.eventDateBlock').find('span')[1]).text().substr(5, 2);

          if (pm === 'pm') {
            if (hours !== '12') {
              var hours24 = parseInt(hours) + 12;
              hours = String("0" + hours24).slice(-2);
            }
          } else if (hours === '12') {
            var hours24 = 0;
          }

          var completa = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
          var time = moment.tz(completa, 'YYYY-MM-DD HH:mm', 'America/Los_Angeles');
          var timeES = time.clone().tz("Europe/Madrid");

          var milliseconds = timeES.valueOf();

          calendarEvents.push({
            "id": $(e).attr('eventid'),
            "content": '<span id="eventBlockIcon">' + $(e).find('.eventBlockIcon a').html() + '</span>' +
              '<span class="eventTitle">' + timeES.format('DD/MM/YYYY HH:mm') + ' - ' + $(e).find('.eventBlockTitle a').html() + '</span>' +
              '<br><span class="eventComments">' + $(e).find('.eventBlockTitle a:last').text() + '</span></a>' +
              '<a>',
            "url": $(e).find('.eventBlockTitle a').attr('href'),
            "class": "event-important",
            "start": milliseconds, // Milliseconds
            "end": milliseconds + 7200000, // Milliseconds
            "title": timeES.format('HH:mm') + ' - ' + $(e).find('.eventBlockTitle a').html()
          });

          // alert('timeLA: ' + time.format('DD/MM/YYYY HH:mm'));
          // alert('timeES: ' + timeES.format('DD/MM/YYYY HH:mm'));
        });

        arrExpiredEvents.each(function(i, e) {
          var day = parseInt($($(e).find('.eventDateBlock').find('span')[0]).text().replace(/[^0-9\.]/g, ''), 10);
          var hours = $($(e).find('.eventDateBlock').find('span')[1]).text().substr(0, 2);
          var minutes = $($(e).find('.eventDateBlock').find('span')[1]).text().substr(3, 2);
          var pm = $($(e).find('.eventDateBlock').find('span')[1]).text().substr(5, 2);

          if (pm === 'pm') {
            if (hours !== '12') {
              var hours24 = parseInt(hours) + 12;
              hours = String("0" + hours24).slice(-2);
            }
          } else if (hours === '12') {
            var hours24 = 0;
          }

          var completa = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
          var time = moment.tz(completa, 'YYYY-MM-DD HH:mm', 'America/Los_Angeles');
          var timeES = time.clone().tz("Europe/Madrid");

          var milliseconds = timeES.valueOf();

          calendarEvents.push({
            "id": $(e).attr('eventid'),
            "content": '<span id="eventBlockIcon">' + $(e).find('.eventBlockIcon a').html() + '</span>' +
              '<span class="eventTitle">' + timeES.format('DD/MM/YYYY HH:mm') + ' - ' + $(e).find('.eventBlockTitle a').html() + '</span>' +
              '<br><span class="eventComments">' + $(e).find('.eventBlockTitle a:last').text() + '</span></a>' +
              '<a>',
            "url": $(e).find('.eventBlockTitle a').attr('href'),
            "class": "event-important",
            "start": milliseconds, // Milliseconds
            "end": milliseconds + 7200000, // Milliseconds
            "title": timeES.format('HH:mm') + ' - ' + $(e).find('.eventBlockTitle a').html()
          });

          // alert('timeLA: ' + time.format('DD/MM/YYYY HH:mm'));
          // alert('timeES: ' + timeES.format('DD/MM/YYYY HH:mm'));
        });

        eventsPending--;

        if (eventsPending == 0) {
          calendar.setOptions({
            events_source: calendarEvents
          });
          calendar.view();
          calendar.setOptions({
            events_source: getSteamGroupEvents
          });
        }

      });
    }
  }
  return calendarEvents;

}

export function fncCalendarButtons() {
  $('.btn-group button[data-calendar-nav]').each(function() {
    var $this = $(this);
    $this.click(function() {
      calendar.navigate($this.data('calendar-nav'));
    });
  });

  $('.btn-group button[data-calendar-view]').each(function() {
    var $this = $(this);
    $this.click(function() {
      calendar.view($this.data('calendar-view'));
    });
  });

  $('#first_day').change(function() {
    var value = $(this).val();
    value = value.length ? parseInt(value) : null;
    calendar.setOptions({
      first_day: value
    });
    calendar.view();
  });

  $('#language').change(function() {
    calendar.setLanguage($(this).val());
    calendar.view();
  });

  $('#events-in-modal').change(function() {
    var val = $(this).is(':checked') ? $(this).val() : null;
    calendar.setOptions({
      modal: val
    });
  });
  $('#format-12-hours').change(function() {
    var val = $(this).is(':checked') ? true : false;
    calendar.setOptions({
      format12: val
    });
    calendar.view();
  });
  $('#show_wbn').change(function() {
    var val = $(this).is(':checked') ? true : false;
    calendar.setOptions({
      display_week_numbers: val
    });
    calendar.view();
  });
  $('#show_wb').change(function() {
    var val = $(this).is(':checked') ? true : false;
    calendar.setOptions({
      weekbox: val
    });
    calendar.view();
  });
  $('#events-modal .modal-header, #events-modal .modal-footer').click(function(e) {
    //e.preventDefault();
    //e.stopPropagation();
  });
}

export function fncNextEvent(event, date, end) {
  if (date == null) {
    date = new Date;
  }
  if (end == null) {
    end = 11;
  } else if (end == 0) {
    return null;
  }

  var xmlSource = 'http://steamcommunity.com/gid/103582791440841071/events?xml=1&action=eventFeed&month=' + (date.getMonth() + 1) + '&year=' + date.getFullYear();

  // build the yql query. Could be just a string - I think join makes easier reading
  var yqlURL = [
    "http://query.yahooapis.com/v1/public/yql",
    "?q=" + encodeURIComponent("select * from xml where url='" + xmlSource + "'"),
    "&format=xml&callback=?"
  ].join("");

  // Now do the AJAX heavy lifting
  $.getJSON(yqlURL, function(data) {
    xmlContent = $(data.results[0]);
    var nextEvent = $(xmlContent).find("event:first");
    var month = moment($(data.results[0]).find('monthName').html().split(/[\[\]]/)[2], 'MMMM').format('MM');
    var year = moment($(data.results[0]).find('year').html().split(/[\[\]]/)[2], 'YYYY').format('YYYY');

    // Si en el mes actual no hay eventos se mira al siguiente mes
    if (nextEvent.length == 0) {
      var next = new Date(year, month, 1);
      next.setMonth(date.getMonth() + 1);
      return fncNextEvent(event, next, --end);
    }

    var day = parseInt($(nextEvent.find('.eventDateBlock').find('span')[0]).text().replace(/[^0-9\.]/g, ''), 10);
    var hours = $(nextEvent.find('.eventDateBlock').find('span')[1]).text().substr(0, 2);
    var minutes = $(nextEvent.find('.eventDateBlock').find('span')[1]).text().substr(3, 2);
    var pm = $(nextEvent.find('.eventDateBlock').find('span')[1]).text().substr(5, 2);

    if (pm === 'pm') {
      if (hours !== '12') {
        var hours24 = parseInt(hours) + 12;
        hours = String("0" + hours24).slice(-2);
      }
    } else if (hours === '12') {
      var hours24 = 0;
    }

    var completa = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
    var time = moment.tz(completa, 'YYYY-MM-DD HH:mm', 'America/Los_Angeles');
    var timeES = time.clone().tz("Europe/Madrid");

    var timeEsTxt = timeES.format('DD/MM/YYYY HH:mm');

    swal({
      title: '<img src="./app/img/soldierR.png"/>PRÓXIMA BATALLA<img src="./app/img/soldierL.png"/><hr/>',
      text: '<h4><strong>' + timeEsTxt + ' - </strong><small>' + nextEvent.find('.eventBlockTitle a').html() + '</small></h4>' +
        '<a id="lnkVerPlan" href="#events">Ver el plan de batallas</a>',
      html: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: 'Anotarlo',
      cancelButtonText: 'Cerrar',
    }, function() {
      var time = moment.tz(completa, 'YYYY-MM-DD HH:mm', 'America/Los_Angeles');
      var timeES = time.clone().tz("Europe/Madrid");
      var hoursEs = timeES.format('HH');
      window.location.href = encodeURI('https://calendar.google.com/calendar/r/eventedit?text=Silver Force&dates=' + year + month + day + 'T' + (Number(hoursEs) - 1) + minutes + '00Z/' + year + month + day + 'T' + (Number(hoursEs) + 1) + minutes + '00Z' + '&details=' + nextEvent.find('.eventBlockTitle a').html() + '&location=&sf=true&output=xml');
    });

    fncProcessLinks2Hash('#lnkVerPlan');
  });
}
