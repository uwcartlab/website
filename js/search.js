(function(){

/////////////GLOBAL VARIABLES////////////
    var searchData, idx;

/////////////CREATE SEARCH INDEX////////////
    function createIndex(){
        $.getJSON("js/search.json", function(data){
            searchData = data;
            idx = lunr(function () {
                this.field('title')
                this.field('content')
                this.field('url')
                
                data.forEach(function (doc) {
                    this.add(doc)
                }, this)
            })     

            var results = idx.search(search);
            newSearch(results);

        })
    }

/////////////INTERPRET SEARCH RESULTS////////////
    function newSearch(results){
        if (results.length > 0 && search){
            results.forEach(function(result){
                var doc = searchData[result.ref],
                    li = buildSearchResult(doc);
                $('#results').append(li);
                    
                var options = {},
                    instance = li.mark(search, options);
            })   
        }
        else{
            noResults();
        }
    }

/////////////NO RESULTS////////////
    function noResults(){
        let p = $('<p>').html("That search returned no results");
        $('#results').append(p);
    }

/////////////RETRIEVE SEARCH STRING////////////
    function getSearch(str) {
        if (str)
            return str.split('?search=')[1];
        else
            return null;
    }
    var search = getSearch(window.location.href);

/////////////POPULATE RESULTS////////////
    var buildSearchResult = function (doc) {
        let content = doc.content,
            length = 500;

        content = content.substr(0,length);

        let li = $('<li>'),
            h2 = $('<h2>'),
            a = $('<a>').prop("href",doc.url).html(doc.title),
            p = $('<p>').html(content + "... "),
            readMore = $('<a>').prop("href",doc.url).html("Read More");

        h2.append(a);
        p.append(readMore);
        li.append(h2,p);
        
        return li;
    }

/////////////ON PAGE SEARCH FUNCTION/////////////
    var newInput = $('#search-page-form').attr("value",search);

    newInput.on("keyup", function(e) {
        if (e.keyCode == 13) {
            $('#results').empty();
            search = newInput.prop("value");
            
            var results = idx.search(search);
            newSearch(results);
        }   
    });


//initial search index
    createIndex();

})();