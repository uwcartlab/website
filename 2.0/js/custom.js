
/* #BOOTSTRAP
================================================== */

!function ($) {

  $(function(){

    var $window = $(window)

    // Disable certain links in docs
    $('section [href^=#]').click(function (e) {
      e.preventDefault()
    })
        
    $('#myTab a').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
    })

    // make code pretty
    window.prettyPrint && prettyPrint()

    // add-ons
    $('.add-on :checkbox').on('click', function () {
      var $this = $(this)
        , method = $this.attr('checked') ? 'addClass' : 'removeClass'
      $(this).parents('.add-on')[method]('active')
    })

    // tooltip 
    $('.tooltip').tooltip({
      selector: "a[rel=tooltip]"
    })
    $("[rel=tooltip]").tooltip();
        
    // alert boxes
    $(".alert").alert()    
    
    // popover
    $('.popover').popover()

    // popover 
    $("a[rel=popover]")
      .popover()
      .click(function(e) {
        e.preventDefault()
      })

    // carousel         
    $('#myCarousel').carousel({
        pause: "false"
    });

    // parallax         
    $('#parallax').carousel();
})

}(window.jQuery)
    
/* #FIXED HEADER
================================================== */

$(function($){
    
    function is_touch_device() {
        return !!('ontouchstart' in window) // works on most browsers 
        || !!(window.navigator.msMaxTouchPoints); // works on ie10
    };
    
    var window_y = 0;
    var header_height = $("#header").height() + 0;
    var scroll_position = parseInt(header_height + header_height/2);    	
    window_y = $(window).scrollTop();
	
    if ( (window_y > scroll_position) && !(is_touch_device()) ) 
        set_static_header();
	
    function set_static_header(){
        window_y = $(window).scrollTop();
        if (window_y > scroll_position) {
            if (!($("#header").hasClass("static"))){
                $("#header").hide();               
                $("#header").addClass("static").css("top", '0');
                $("#header").fadeIn(500);
            }
				
        } else {
            if (($("#header").hasClass("static"))){
                $("#header").fadeOut(500, function(){
                    $("#header").removeClass("static");
                    
                    $("#header").fadeIn(300);
                });
            }
        }
    }
	
    $(window).scroll(function(){
        if (!(is_touch_device())) 
            set_static_header();
    });
    
});

/* #QUICKSAND
================================================== */

$(document).ready(function(){
    
    $("a[rel^='prettyPhoto']").prettyPhoto();
    
    /* Pretty photo */ 
    if(jQuery().prettyPhoto) {
        piPrettyphoto(); 
    }
    
    function piPrettyphoto(){
        $("a[data-gal^='prettyPhoto']").prettyPhoto();
    }    
    	
    // get the action filter option item on page load
    var $filterType = $('#portfolio-filter li.active a').attr('class');

    // get and assign the holder element to the
    // $holder varible for use later
    var $holder = $('ul#filter-item');

    // clone all items within the pre-assigned $holder element
    var $data = $holder.clone();

    // attempt to call Quicksand when a filter option
    // item is clicked
    $('#portfolio-filter li a').click(function(e) {
        // reset the active class on all the buttons
        $('#portfolio-filter li').removeClass('active');

        // assign the class of the clicked filter option
        // element to our $filterType variable
        var $filterType = $(this).attr('class');
        // IE7 fix - Selectivizr brakes quicksand animation
        $filterType = $filterType.replace(/slvzr-hover|slvzr-focus/gi, '');
        $filterType = $filterType.replace(/^\s+|\s+/g, '');
        $(this).parent().addClass('active');
        if ($filterType == 'all') {
            // assign all li items to the $filteredData var when
            // the 'All' filter option is clicked
                       
            var $filteredData = $data.children('li');
        }
        else {
            // find all li elements that have our required $filterType
            // values for the data-type element
            var $filteredData = $data.find('li[data-type=' + $filterType + ']');
        }

        // call quicksand and assign transition parameters
        $holder.quicksand($filteredData, {
            duration: 800,
            easing: 'swing'
        },function() {
            // reload other plugins
            piPrettyphoto();
        });
        return false;
    });
    
             
});

    
/* BACK TO TOP
================================================== */
$(window).bind('scroll', function(){
    if ($(this).scrollTop() > 200) { $('.scrollTop').fadeIn(); } else { $('.scrollTop').fadeOut(); }
});

$('.scrollTop').click(function(e){
    e.stopPropagation();
    $('body,html').animate({scrollTop: 0}, 800);
    return false;
});

/* #DROP-DOWN NAVIGATION
================================================== */
$("<select />").appendTo(".navigation");

// Create default option "Go to..."
$("<option />", {
   "selected": "selected",
   "value"   : "",
   "text"    : "Go to..."
}).appendTo(".navigation select");

// Populate dropdown with menu items
$(".navigation a").each(function() {
 var el = $(this);
 $("<option />", {
     "value"   : el.attr("href"),
     "text"    : el.text()
 }).appendTo(".navigation select");
});
$(".navigation select").change(function() {
  window.location = $(this).find("option:selected").val();
});

(function ($) {
  // hash change handler
  function hashchange () {
    var hash = window.location.hash
      , el = $('ul.tabs [href*="' + hash + '"]')
      , content = $(hash)

    if (el.length && !el.hasClass('active') && content.length) {
      el.closest('.tabs').find('.active').removeClass('active');
      el.addClass('active');
      content.show().addClass('active').siblings().hide().removeClass('active');
    }
  }

  // listen on event and fire right away
  $(window).on('hashchange.skeleton', hashchange);
  hashchange();
  $(hashchange);
})(jQuery);

/* #Main Slider
================================================== */

$(function() {
    var Page = (function() {
        var $nav = $( '#nav-dots > span' ),
            slitslider = $( '#slider' ).slitslider( {
                onBeforeChange : function( slide, pos ) {
                    $nav.removeClass( 'nav-dot-current' );
                    $nav.eq( pos ).addClass( 'nav-dot-current' );
                }
            } ),
            init = function() {
                initEvents();
            },
            initEvents = function() {
                $nav.each( function( i ) {
                    $( this ).on( 'click', function( event ) {
                        var $dot = $( this );
                        if( !slitslider.isActive() ) {
                            $nav.removeClass( 'nav-dot-current' );
                            $dot.addClass( 'nav-dot-current' );
                        }
                        slitslider.jump( i + 1 );
                        return false;
                    } );
                } );
            };
            return { init : init };
    })();
    Page.init();

});


				   
