var carouselUrl = './app/img/gallery/carousel/';
var collageUrl = './app/img/gallery/collage/';

var carouselLinks = [{
    href: carouselUrl + '0001.jpg',
    title: 'Fight for Ca$h'
}, {
    href: carouselUrl + '0012.jpg',
    title: 'Sangre por sangre'
}, {
    href: carouselUrl + '0013.jpg',
    title: 'Fría noche en Chernarus'
}, {
    href: carouselUrl + '0018.jpg',
    title: 'Todos listos'
}]

function fncCreateGalleryItem(baseUrl, title) {
    return $('<a/>')
        .append($('<img>').prop('src', baseUrl + '_s.jpg'))
        .prop('href', baseUrl + '_b.jpg')
        .prop('title', title)
        .attr('data-gallery', '')
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
                var linksContainer = $('#links')
                var baseUrl;
                photos.sort(sortByProperty('views'));
                photos = photos.slice(0,150);
                $.each(photos, function(index, photo) {
                    baseUrl = 'https://farm' + photo.farm + '.static.flickr.com/' +
                        photo.server + '/' + photo.id + '_' + photo.secret
                    fncCreateGalleryItem(baseUrl, photo.title).appendTo(linksContainer);
                });
            } else {
                return fncGetAllPhotosList(photos, ++page);
            }
        }
    });
}
