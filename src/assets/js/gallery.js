import blueimp from '../vendor/blueimp-gallery/js/blueimp-gallery.min.js';
import '../vendor/blueimp-gallery/js/blueimp-gallery-fullscreen.js';
import '../vendor/blueimp-gallery/js/blueimp-gallery-indicator.js';
import '../vendor/blueimp-gallery/js/blueimp-gallery-video.js';
import '../vendor/blueimp-gallery/js/blueimp-gallery-vimeo.js';
import '../vendor/blueimp-gallery/js/blueimp-gallery-youtube.js';
import '../vendor/blueimp-gallery/js/jquery.blueimp-gallery.min.js';
import '../vendor/blueimp-gallery/js/blueimp-helper.js';

import c1 from '../img/gallery/carousel/0001.jpg';
import c2 from '../img/gallery/carousel/0012.jpg';
import c3 from '../img/gallery/carousel/0013.jpg';
import c4 from '../img/gallery/carousel/0018.jpg';

var carouselLinks = [{
    href: c1,
    title: 'Fight for Ca$h'
}, {
    href: c2,
    title: 'Sangre por sangre'
}, {
    href: c3,
    title: 'Fría noche en Chernarus'
}, {
    href: c4,
    title: 'Todos listos'
}];

function fncCreateGalleryItem(baseUrl, title) {
    return $('<a/>')
        .append($('<img>').prop('src', baseUrl + '_s.jpg'))
        .prop('href', baseUrl + '_b.jpg')
        .prop('title', title)
        .attr('data-gallery', '');
}

function sortByProperty(property) {
    'use strict';
    return function(a, b) {
        var sortStatus = 0;
        if (parseInt(a[property]) > parseInt(b[property])) {
            sortStatus = -1;
        } else if (parseInt(a[property]) < parseInt(b[property])) {
            sortStatus = 1;
        }

        return sortStatus;
    };
}

// Load demo images from flickr:
function fncGetAllPhotosList(photos, page) {
    if (photos == null) {
        photos = [];
    }
    if (page == null) {
        page = 1;
    }

    $.ajax({
        // Flickr API is SSL only:
        // https://code.flickr.net/2014/04/30/flickr-api-going-ssl-only-on-june-27th-2014/
        url: 'https://api.flickr.com/services/rest/',
        data: {
            format: 'json',
            method: 'flickr.photos.search',
            //        method: 'flickr.people.getPublicPhotos',
            api_key: '16b763832ba88bc5af9af82bba0d2d2f', // jshint ignore:line
            user_id: '145043982@N02',
            sort: 'interestingness-desc',
            extras: 'views',
            per_page: 500,
            page: page
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        success: function(result) {
            Array.prototype.push.apply(photos, result.photos.photo);

            if (result.photos.pages == 1 || result.photos.page == result.photos.pages) {
                var linksContainer = $('#links');
                var baseUrl;
                photos.sort(sortByProperty('views'));
                photos = photos.slice(0,55);
                $.each(photos, function(index, photo) {
                    baseUrl = 'https://farm' + photo.farm + '.static.flickr.com/' +
                        photo.server + '/' + photo.id + '_' + photo.secret;
                    fncCreateGalleryItem(baseUrl, photo.title).appendTo(linksContainer);
                });
            } else {
                return fncGetAllPhotosList(photos, ++page);
            }
        }
    });
}

export function initGallery(selector){
    // Inicializar el carrusel
    blueimp(
        carouselLinks, {
            container: selector,
            carousel: true,
            clearSlides: true,
            stretchImages: true
        });

    // Mostrar las más vistas de la galería
    fncGetAllPhotosList();
}