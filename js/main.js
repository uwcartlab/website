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

var input = $('#search-form');

input.on("keyup", function(e) {
    if (e.keyCode == 13) {
        var value = input.prop("value");
        window.open(level + "search.html?search=" + value + "","_self");
    }
});