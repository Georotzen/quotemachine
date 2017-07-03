var text;
var author;
var wikiThumb;
var wikiAuthor;
var wikiUrl;
var tweetUrl = "https://twitter.com/intent/tweet?via=BrandonEichler&text=Obviously you're not a golfer. - The Dude";
var wikiThumbPlaceholder = "https://raw.githubusercontent.com/ShaggyTech/quotemachine/master/img/person-placeholder.png";
var animationEnd = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";


// <<< QUOTE FUNCTIONS >>>

// Gets a new quote whenever #newQuote button is clicked
function getQuote() {
    
    var url = "https://api.forismatic.com/api/1.0/?method=getQuote&&lang=en&format=jsonp&jsonp=?";
    
    
    
    $.getJSON(url).done(parseQuote).fail(handleErr);
}

function handleErr(jqxhr, textStatus, err) {
  console.log("Request Failed: " + textStatus + ", " + err);
}

// called from getQuote()
// Extracts the quote text and author from the forismatic API call response
function parseQuote(response) {
    text = response.quoteText;
    author = response.quoteAuthor;

    // due to text overflowing into the author div, we need to skip any quotes longer than 125 characters
    if (text.length > 125) {
        getQuote();
    }

    // if the quote has no author, then the author is unknown
    if (author === "") {
        author = "Unknown Author";
    }

    getWiki(author); // gets wikipedia link and thumbnail image from author's wiki page
    updateQuote(text, author); // adds and animates the new quote onto the page
    tweetQuote(text, author); // updates the twitter share button with the new quote
}

// called from parseQuote()
// animates the removal of the old quote and insertion of the new quote from the page
function updateQuote(t, a) {
    // uses animations provided by animate.css
    $("#text").addClass("animated fadeOutLeft").one(animationEnd, function() {
        $(this).html('<i class="fa fa-quote-left fa-1x"></i>' + t + '<i class="fa fa-quote-right fa-1x"></i>');
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

// uses wikipedia API to retrieve the author's page
// uncomment the console.log to see what is returned
function getWiki(name) {
    // The wikipedia API call we will use with the author's name as the title
    var apiUrl = encodeURI('//en.wikipedia.org/w/api.php?action=query&titles=' + name + '&prop=pageimages|info&piprop=thumbnail&inprop=url&format=jsonty&pithumbsize=500&utf8=&redirects&callback=?')

    // resets the thumbnail and wikipedia URL because we are getting a new quote
    wikiThumb = "";
    wikiUrl = "";

    // the wikipedia API call
    $.ajax({
        url: apiUrl,
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

// called from getWiki()
// parses the response from the wikipedia API and saves only the info we need
function parseWiki(pages) {
    var thumbnail;
    var fullUrl;
    var pageId;

    // there is only 1 id in the API call but we have to iterate through pages to access it
    for (var id in pages) {
        thumbnail = pages[id].thumbnail;
        fullUrl = pages[id].fullurl;
        pageId = pages[id].pageid;
    }

    // if a thumbnail was found in the API call then save it's URL
    if (thumbnail) {
        wikiThumb = thumbnail.source;
    }

    // pageId will be null if there was no valid wikipedia page found for the author
    // otherwise we need to save the author's wikipedia URL
    if (pageId) {
        wikiUrl = fullUrl;
    } else {
        wikiUrl = "";
    }

    updateWiki(); // updates the author's image and menu buttons
}

// called from parseWiki()
// updates the menu buttons and animates/updates the thumbnail image
function updateWiki() {
    // disables the menu buttons 
    $(".nav > li > a").addClass("disabled");

    $("#authorThumb").addClass("animated fadeOutDown").one(animationEnd, function() {

        // these if statements update all of the menu buttons
        if (author === "Unknown Author") {
            $("#authorThumb").html("<img src=" + wikiThumbPlaceholder + ">");
            $("#wikiLink").attr("href", "#").addClass("disabled");
        }

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

        // re-enables all of the menu buttons after their info has been updated
        // the exception is the wikipedia button, .no-disable has been removed from that button if there is no valid URL
        $(".no-disable").removeClass("disabled");
    });
}

// called from parseQuote()
// updates the twitter share button with the new quote information
function tweetQuote(q, a) {
    if (q) {
        tweetUrl = encodeURI("https://twitter.com/intent/tweet?via=BrandonEichler&text=\"" + q + "\" - " + a);
    }
    $("#tweet").attr("href", tweetUrl);
}

function buttonListeners() {
    // the only button on the page we need jQuery to listen for
    $("#newQuote").click(function() {
        getQuote();
    });

    $("#blank").click(function(event){
        event.stopPropagation();
    });
    // these are used to remove the hover styling from the buttons after clicking on them
    $('.nav > li > a').mouseup(function() {
        this.blur()
    });
    $('.nav > li > a').mousedown(function() {
        this.blur()
    });
}

$(document).ready(function() {
    buttonListeners();
});
