var quote;
var author;
var wikiThumb;
var wikiAuthor;
var wikiUrl;
var wikiThumbPlaceholder = "https://raw.githubusercontent.com/ShaggyTech/quotemachine/master/img/person-placeholder.png";

function parseQuote(response) {
    quote = response.quoteText;
    author = response.quoteAuthor;

    $("#wikiLink").removeClass("disabled")

    if (author != "") {
        getWiki(author);
    } else {
        author = "Unknown Author";
        $("#authorThumb").html("<img src=" + wikiThumbPlaceholder + ">");
        $("#wikiLink").attr("href", "#").addClass("disabled");
    }

    $("#quote").html('<i class="fa fa-quote-right fa-1x"></i>' + quote + '<i class="fa fa-quote-right fa-1x"></i>');
    $("#author").html(author);
}

function getQuote() {
    $.ajax({
        dataType: "jsonp",
        url: "http://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=en&jsonp=parseQuote",
    })
}

function parseWiki(pages) {
    for (var id in pages) {
        var thumbnail = pages[id].thumbnail;
        var fullUrl = pages[id].fullurl;
        if (thumbnail) {
            wikiThumb = thumbnail.source;
            wikiUrl = fullUrl;
        }
    }

    if (wikiThumb && wikiUrl) {
        $("#authorThumb").html("<a href=" + wikiUrl + " target='_blank'><img src=" + wikiThumb + "></a>");
        $("#wikiLink").attr("href", wikiUrl);
    } else if (wikiUrl) {
        $("wikiLink").attr("href", wikiUrl);
    } else {
        $("#authorThumb").html("<img src=" + wikiThumbPlaceholder + ">");
        $("#wikiLink").attr("href", "#").addClass("disabled");
    }
}

function getWiki(name) {
    wikiThumb = "";
    wikiUrl = "";

    $.ajax({
        url: '//en.wikipedia.org/w/api.php?action=query&titles=' + name + '&prop=pageimages|info&piprop=thumbnail&inprop=url&format=jsonty&pithumbsize=100&callback=?',
        data: {
            format: 'json'
        },
        dataType: 'jsonp'
    }).done(function(data) {
        //console.log(JSON.stringify(data, undefined, 2));
        var pages = data.query.pages;
        parseWiki(pages);
    });
}

function tweetQuote() {
    tweetUrl = encodeURI("https://twitter.com/intent/tweet?via=BrandonEichler&text=\"" + quote + "\" - " + author);
    $("#tweet").attr("href", tweetUrl);
}

function buttonListeners() {
    $("#newQuote").click(function() {
        getQuote();
    });
    $("#tweet").click(function() {
        tweetQuote();
    });
    $('.btn').mouseup(function() {
        this.blur()
    });
    $('.btn').mousedown(function() {
        this.blur()
    });
}

$(document).ready(function() {
    buttonListeners();
});
