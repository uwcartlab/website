//get current url level
var url = window.location.pathname,
    level1 = ["research","education","people","production"],
    level2 = ["areas","G370","G572","G575"],
    level = "";

function determineLevel(){
    level1.forEach(function(t){
        let search = url.search(t);
        if (search > 0){
            level = "../"
        }
    })
    level2.forEach(function(t){
        var search = url.search(t);
        if (search > 0){
            level = "../../"
        }
    })
}

determineLevel();

//search function listener
var input = $('#search-form');

input.on("keyup", function(e) {
    if (e.keyCode == 13) {
        var value = input.prop("value");
        window.open(level + "search.html?search=" + value + "","_self");
    }
});

//search bar/spyglass styling listeners
var showSearch = false, 
    searchContainer = $('#search-container'),
    w = $('body').width();;

$(".spyglass").click(function(){
    if (showSearch){
        showSearch = false;
        searchContainer.hide();
    }
    else{
        showSearch = true;
        searchContainer.show();
    }
})

$(window).resize(function(){
    w = $('body').width();
    if (w < 752){
        console.log(w)
        searchContainer.show();
    }
    else{
        searchContainer.hide();
    }
})

$(document).mouseup(function(e) {
    var container = $("#search-form, .spyglass");

    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0 && w > 752) {
        searchContainer.hide();
        showSearch = false;
    }
});