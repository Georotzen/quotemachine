function parseQuote(response){
  var quote = response.quoteText;
  var author = response.quoteAuthor;
  $("#quote").html(quote);
  $("#author").html(author);
}

function requestQuote() {
  $.ajax({
      dataType: "jsonp",
      url: "http://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=en&jsonp=parseQuote",
    })
}

function newQuote() {
  $("#newQuote").click(function(){
    requestQuote();
  });
}

$(document).ready(function(){
  newQuote();
});