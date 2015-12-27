var quote;
var author;
var wikiThumb;
var wikiThumbPlaceholder = "https://raw.githubusercontent.com/ShaggyTech/quotemachine/master/img/person-placeholder.png";

function parseQuote(response) {
  quote = response.quoteText;
  author = response.quoteAuthor;

  if (author != "") {
    getWikiThumbnail(author);
  } else {
    author = "Unknown Author";
  }

  $("#quote").html(quote);
  $("#author").html(author);
}

function requestQuote() {
  $.ajax({
    dataType: "jsonp",
    url: "http://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=en&jsonp=parseQuote",
  })
}

function getWikiThumbnail(name) {
  wikiThumb = "";

  $.ajax({
    url: '//en.wikipedia.org/w/api.php?action=query&titles=' + name + '&prop=pageimages&piprop=thumbnail&format=jsonty&pithumbsize=100&callback=?',
    data: {
      format: 'json'
    },
    dataType: 'jsonp'
  }).done(function(data) {
    //console.log(JSON.stringify(data, undefined, 2));

    var pages = data.query.pages;

    for (var id in pages) {
      var thumbnail = pages[id].thumbnail;
      if (thumbnail) {
        wikiThumb = thumbnail.source;
      }
    }

    if (wikiThumb) {
      $("#authorThumb").html("<img src=" + wikiThumb + ">");
      console.log(wikiThumb);
    } else {
      $("#authorThumb").html("<img src=" + wikiThumbPlaceholder + ">");
    }

  });
}

function newQuote() {
  $("#newQuote").click(function() {
    requestQuote();
  });
}

$(document).ready(function() {
  newQuote();
  getWikiThumbnail();
});