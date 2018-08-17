
import QUERY_STRING from 'query-string';


const API_URL = 'https://api.themoviedb.org/3/';
const API_KEY = '2cbd63fe8cd1579bef2fd02178529651';
const API_FUNCTION = {
    config: API_URL + 'configuration',
    search: API_URL + 'search/movie',
    find: API_URL + 'find/movie',
    discover: API_URL + 'discover/movie'
}

let currentQuery = {};
let apiConfig = null;


function buildPaginator(data) {
    let paginator = $('#results .pagination').empty();

    let li;
    let a;

    for (let i = data.page - 2, len = data.page + 2; i <= len; i++) {
        // Don't show extra previous and next buttons...
        if (i < 0 || i > (data.total_pages + 1)) {
            continue;
        }

        li = $('<li />');

        if (i < 1 || i > data.total_pages || i == data.page) {
            li.addClass('btn disabled');
            a = $('<span />');
        }
        else {
            a = $('<a />');
            a.attr('href', '?page=' + i);
            a.addClass('btn');
        }
        li.append(a);

        // Never show "0"
        if (i < data.page - 1 || i < 1) {
            a.html('&#171;');
        }
        // Never show data.total_pages + 1
        else if (i > data.page + 1 || i > data.total_pages) {
            a.html('&#187;');
        }
        else {
            a.text(i);
        }

        if (i == data.page) {
            li.addClass('solid');
        }

        paginator.append(li);
    }

    $('#page-number').text("Page " + data.page 
        + " of " + data.total_pages);
}

function movieLinkElement(movie) {
    let url = 'https://www.themoviedb.org/movie/' + movie.id;
    return $('<a href="' + url + '" target="_blank" />');
}

function displayMovies(movies) {
    let list = $('#movie-list').empty();

    let m;
    let li;

    let img;
    let info;

    let imgBase = apiConfig.images.secure_base_url 
        + apiConfig.images.poster_sizes[0];

    for (let i = 0, len = movies.length; i < len; i++) {
        m = movies[i];
        li = $('<li class="content-box clear" />');

        if (m.poster_path) {
            img = $('<img class="movie-img float-left"'
                + ' src="' + imgBase + m.poster_path + '" />');

            li.append(movieLinkElement(m)
                .append(img));
        }

        info = $('<div class="movie-info" />');

        info.append(movieLinkElement(m)
            .append('<h3>' + m.title + '</h3>'));

        info.append($('<p>' + m.overview + ' </p>')
            .append(movieLinkElement(m).text('Read more.')));

        if (m.release_date) {
            info.append('<small>(' + m.release_date + ')</small>');
        }

        li.append(info);

        list.append(li);        
    }
}

function displaySearchData(data) {

    const q = decodeURIComponent(currentQuery.query);
    $('#search-form input[name="query"]').val(q);

    let resultsContainer = $('#results');
    let noResultsMsg = $('#no-results');

    noResultsMsg.hide();

    if (data.total_results > 0) {
        buildPaginator(data);

        displayMovies(data.results);

        resultsContainer.show();
    }
    else {
        resultsContainer.hide();

        if (q) { // If there was a query, show no results msg
            $('#no-results-query').text(decodeURIComponent(q));
            noResultsMsg.show();
        }
    }
}

function querySearchAPI(term, handler) {
    currentQuery = QUERY_STRING.parse(location.hash);

    let q;
    if (!term) {
        q = currentQuery.query;
    }
    else {
        q = term;
    }

    if (!q) { 
        // If query is falsy, hide result displays 
        // and don't bother with ajax
        $('#no-results').hide()
        $('#results').hide();
        return;
    }

    let page = currentQuery.page;
    if (isNaN(page)) {
        page = 1
    }

    let gotConfig = true;

    // Make sure we have the general config info for TMDb
    if (apiConfig == null) { 
        gotConfig = $.getJSON(API_FUNCTION.config,
            {
                api_key: API_KEY
            },
            function (data) {
                apiConfig = data;
            });
    }

    $.when(gotConfig).done(function() { 
        // If we were not passed an explicit handler then
        // just display the search results.
        handler = handler || displaySearchData;

        $.getJSON(API_FUNCTION.search, 
            {
                api_key: API_KEY,
                // Don't double encode!
                query: decodeURIComponent(q), 
                page: parseInt(page),
                // Make sure we're always family-friendly
                include_adult: false 
            },
            handler);
    });
}


$(function () {
    let mainInput = $('#search-form input[name="query"]');
    let searchBtn = $('#search-form button[type="submit"]');

    searchBtn.click(function(e) {
        e.preventDefault();

        let q = mainInput.val().trim();

        // We need to encode the query so it is safe to put
        // in the hash, but remember to decode before using in 
        // jQuery ajax, otherwise jQuery double-encodes it.
        currentQuery.query = encodeURIComponent(q);

        currentQuery.page = 1;

        // Allows us to use back button in browser, etc.
        // Using # instead of ? also lets us load elements more
        // smoothly via ajax.
        location.hash = QUERY_STRING.stringify(currentQuery)
            .replace('?', '#');
    });

    $('.pagination').on('click', 'a', function(e) {
        e.preventDefault();

        let p = parseInt($(this).attr('href').replace('?page=', ''));

        if (!isNaN(p)) {
            currentQuery.page = p;

            // Allows us to use back button in browser, etc.
            // Using # instead of ? also lets us load elements more
            // smoothly via ajax.
            location.hash = QUERY_STRING.stringify(currentQuery)
                .replace('?', '#');
        }
    });

    $(window).on('hashchange', function(e) {
        querySearchAPI();
    });

    // Autocomplete for searchbar; use ajax to get top 10
    // results from API after at least 3 chars are entered
    mainInput.autocomplete({
        source: function (request, response) {
            querySearchAPI(request.term, function(data) {
                // Make sure we map the results to something
                // that the autocomplete can understand
                response($.map(data.results.slice(0, 10), 
                    function (val) {
                        return {
                            label: val.title,
                            value: val.title
                        }
                    }));
            });
        },
        minLength: 3,
        delay: 100,
        // If the user picks an option, search for it immediately
        select: function(e, ui) {
            mainInput.val(ui.item.label);
            searchBtn.click();
        }
    });


    // Try to display movies, in case we loaded with query params
    // already present in the url
    querySearchAPI();

    // Focus the search bar as soon as the page loads,
    // so the user can immediately begin typing
    mainInput.focus();
});