var quote;
var author;
var wikiThumb;
var wikiAuthor;
var wikiUrl;
var tweetUrl = "https://twitter.com/intent/tweet?via=BrandonEichler&text=Obviously you're not a golfer. - The Dude";
var wikiThumbPlaceholder = "https://raw.githubusercontent.com/ShaggyTech/quotemachine/master/img/person-placeholder.png";
var animationEnd = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";

function addQuote(q, a) {
    $("#quote").addClass("animated fadeOutLeft").one(animationEnd, function() {
        $(this).html('<i class="fa fa-quote-left fa-1x"></i>' + q + '<i class="fa fa-quote-right fa-1x"></i>');
        $(this).removeClass("animated fadeOutLeft").addClass("animated fadeInRight").one(animationEnd, function() {
            $(this).removeClass("animated fadeInRight");
        });
    });

    $("#author").addClass("animated fadeOutRight").one(animationEnd, function() {
        $(this).html(a);
        $(this).removeClass("animated fadeOutRight").addClass("animated fadeInLeft").one(animationEnd, function() {
            $(this).removeClass("animated fadeInLeft");
        });
    });
}

function parseQuote(response) {
    quote = response.quoteText;
    author = response.quoteAuthor;
    $("#wikiLink").removeClass("disabled")

    if (author === "") {
        author = "Unknown Author";
        $("#authorThumb").html("<img src=" + wikiThumbPlaceholder + ">");
        $("#wikiLink").attr("href", "#").addClass("disabled");
    }

    getWiki(author);
    addQuote(quote, author);
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

    $(".nav > li > a").addClass("disabled");

    $("#authorThumb").addClass("animated fadeOutDown").one(animationEnd, function() {

        if (wikiThumb) {
            $(this).html("<a href=" + wikiUrl + " target='_blank'><img src=" + wikiThumb + "></a>");
        } else {
            $(this).html("<img src=" + wikiThumbPlaceholder + ">");
        }

        if (wikiUrl) {
            $("#wikiLink").attr("href", wikiUrl).addClass("no-disable");
        } else {
    
            $("#wikiLink").attr("href", "#").removeClass("no-disable").addClass("disabled");
        }

        $(this).removeClass("animated fadeOutDown").addClass("animated fadeInUp").one(animationEnd, function() {
            $(this).removeClass("animated fadeInUp");
        });

        $(".no-disable").removeClass("disabled");

    });
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
    if (quote) {
        tweetUrl = encodeURI("https://twitter.com/intent/tweet?via=BrandonEichler&text=\"" + quote + "\" - " + author);
    }
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
