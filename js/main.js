var input = $('#search-form');

input.on("keyup", function(e) {
    if (e.keyCode == 13) {
        var value = input.prop("value");
        window.open("search.html?search=" + value + "","_self");
    }
});