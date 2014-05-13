/* ===========================================================
 * zepto.onepagescroll.js v1.2.2
 * ===========================================================
 * Copyright 2014 Pete Rojwongsuriya.
 * http://www.thepetedesign.com
 *
 * Create an Apple-like website that let user scroll
 * one page at a time
 *
 * Credit: Eike Send for the awesome swipe event
 * https://github.com/peachananr/zepto-onepage-scroll
 * 
 *
 * Zepto Modules Required:  
 * - touch.js
 * - fx.js
 *
 *
 * License: GPL v3
 *
 * ========================================================== */

;(function($){
  $.extend($.fn, {
    onePageScroll: function(options){
      
      var defaults = {
    		sectionContainer: "section",
    		easing: "ease",
    		animationTime: 1000,
    		pagination: true,
    		updateURL: false,
    		keyboard: true,
    		beforeMove: null,
    		afterMove: null,
    		loop: false,
    		responsiveFallback: false
    	};
    	
    	var settings = $.extend({}, defaults, options),
  			el = $(this),
  			sections = $(settings.sectionContainer),
  		  total = sections.length,
  			status = "off",
  			topPos = 0,
  			lastAnimation = 0,
  			lastAnimation = 0,
  			quietPeriod = 300,
  			paginationList = "",
  			body = $("body");
      
      
      /*------------------------------------------------*/
      /*  Credit: Eike Send for the awesome swipe event */    
      /*------------------------------------------------*/
      
      $.fn.swipeEvents = function() {
        return this.each(function() {
        
          var startX,
              startY,
              $this = $(this);
        
          $this.on('touchstart', touchstart);
        
          function touchstart(event) {
            var touches = event.touches;
            if (touches && touches.length) {
              startX = touches[0].pageX;
              startY = touches[0].pageY;
              $this.on('touchmove', touchmove);
            }
          }
        
          function touchmove(event) {
            var touches = event.touches;
            if (touches && touches.length) {
              event.preventDefault();
              var deltaX = startX - touches[0].pageX;
              var deltaY = startY - touches[0].pageY;
        
              if (deltaX >= 50) {
                $this.trigger("swipeLeft");
              }
              if (deltaX <= -50) {
                $this.trigger("swipeRight");
              }
              if (deltaY >= 50) {
                $this.trigger("swipeUp");
              }
              if (deltaY <= -50) {
                $this.trigger("swipeDown");
              }
              if (Math.abs(deltaX) >= 50 || Math.abs(deltaY) >= 50) {
                $this.off('touchmove', touchmove);
              }
            }
          }
        
        });
      };
      
      /*---------------------------------*/
      /*  Function to transform the page */
      /*---------------------------------*/
      
      $.fn.transformPage = function(settings, pos, index, next_el) {
        var el2 = $(this);
        
      	if (typeof settings.beforeMove == 'function') settings.beforeMove(index, next_el);
        
        el2.animate({
          translate3d: "0, " + pos + "%, 0"
        }, settings.animationTime, settings.easing, function() {
          if (typeof settings.afterMove == 'function') settings.afterMove(index);
        });
      }
      
      /*---------------------------------*/
      /*  Function to move down section  */
      /*---------------------------------*/

      $.fn.moveDown = function() {
        var timeNow = new Date().getTime();
        
        // Cancel scroll if currently animating or within quiet period
  			if(timeNow - lastAnimation < quietPeriod + settings.animationTime) {
  				event.preventDefault();
  				return;
  			}
        
        var index = $(settings.sectionContainer +".active").data("index"),
  			    current = $(settings.sectionContainer + "[data-index='" + index + "']"),
  			    next = $(settings.sectionContainer + "[data-index='" + (parseInt(index) + 1) + "']"),
  			    el3 = $(this);

        
  			if(next.length < 1) {
  				if (settings.loop == true) {
  					pos = 0;
  					next = $(settings.sectionContainer + "[data-index='1']");
  				} else {
  					return
  				}

  			}else {
  				pos = (index * 100) * -1;
  			}
  			var next_index = next.data("index");
  			current.removeClass("active");
  			next.addClass("active");

  			if(settings.pagination == true) {
  			  $(".onepage-pagination li a" + "[data-index='" + index + "']").removeClass("active");
  			  $(".onepage-pagination li a" + "[data-index='" + next_index + "']").addClass("active");
  			}

  			document.body.className = document.body.className.replace(/\bviewing-page-\d.*?\b/g, '');
  			body.addClass("viewing-page-"+ next_index);

  			if (history.replaceState && settings.updateURL == true) {
  				var href = window.location.href.substr(0,window.location.href.indexOf('#')) + "#" + (parseInt(index) + 1);
  				history.pushState( {}, document.title, href );
  			}
  			el3.transformPage(settings, pos, next_index, next);
  			lastAnimation = timeNow;
  		}
      
      /*---------------------------------*/
      /*  Function to move up section    */
      /*---------------------------------*/

  		$.fn.moveUp = function() {
  		  var timeNow = new Date().getTime();

  			// Cancel scroll if currently animating or within quiet period
  			if(timeNow - lastAnimation < quietPeriod + settings.animationTime) {
  				event.preventDefault();
  				return;
  			}
        
  		  var index = $(settings.sectionContainer +".active").data("index"),
  			    current = $(settings.sectionContainer + "[data-index='" + index + "']"),
  			    next = $(settings.sectionContainer + "[data-index='" + (parseInt(index) - 1) + "']"),
  			    el4 = $(this);

  			if(next.length < 1) {
  				if (settings.loop == true) {
  					pos = ((total - 1) * 100) * -1;
  					next = $(settings.sectionContainer + "[data-index='" + total + "']");
  				} else {
  					return
  				}
  			}else {
  				pos = ((next.data("index") - 1) * 100) * -1;
  			}
  			var next_index = next.data("index");
  			current.removeClass("active")
  			next.addClass("active")

  			if(settings.pagination == true) {
  			  $(".onepage-pagination li a" + "[data-index='" + index + "']").removeClass("active");
  			  $(".onepage-pagination li a" + "[data-index='" + next_index + "']").addClass("active");
  			}
  			document.body.className = document.body.className.replace(/\bviewing-page-\d.*?\b/g, '');
  			body.addClass("viewing-page-"+ next_index);

  			if (history.replaceState && settings.updateURL == true) {
  				var href = window.location.href.substr(0,window.location.href.indexOf('#')) + "#" + (parseInt(index) - 1);
  				history.pushState( {}, document.title, href );
  			}
  			el4.transformPage(settings, pos, next_index, next);
  			lastAnimation = timeNow;
  		}
      
      /*-------------------------------------------*/
      /*  Function to move to specified section    */
      /*-------------------------------------------*/

      $.fn.moveTo = function(page_index) {
        var timeNow = new Date().getTime();
        
        // Cancel scroll if currently animating or within quiet period
  			if(timeNow - lastAnimation < quietPeriod + settings.animationTime) {
  				event.preventDefault();
  				return;
  			}
  			var current = $(settings.sectionContainer + ".active"),
  			    next = $(settings.sectionContainer + "[data-index='" + (page_index) + "']"),
  			    el5 = $(this);

  			if(next.length > 0) {
  			  var next_index = next.data("index");
  				current.removeClass("active");
  				next.addClass("active");
  				$(".onepage-pagination li a" + ".active").removeClass("active");
  				$(".onepage-pagination li a" + "[data-index='" + (page_index) + "']").addClass("active");

  				document.body.className = document.body.className.replace(/\bviewing-page-\d.*?\b/g, '');
  				body.addClass("viewing-page-"+ next_index);

  				pos = ((page_index - 1) * 100) * -1;

  				if (history.replaceState && settings.updateURL == true) {
  					var href = window.location.href.substr(0,window.location.href.indexOf('#')) + "#" + (parseInt(page_index) - 1);
  					history.pushState( {}, document.title, href );
  				}
  				el5.transformPage(settings, pos, page_index, next);
  				lastAnimation = timeNow;
  			}
  		}
      
      /*-------------------------------------------*/
      /*  Responsive Fallback trigger              */
      /*-------------------------------------------*/

      var responsive = function() {

  			if ($(document).width() < settings.responsiveFallback) {

  				body.addClass("disabled-onepage-scroll");
  				$(document).off('mousewheel DOMMouseScroll', mouseWheelHandler);
  				$(document).off("swipeDown swipeUp");

  			} else {

  			  if (body.hasClass("disabled-onepage-scroll")) {
  			    bodyremoveClass("disabled-onepage-scroll");
  			    $("html, body, .wrapper").animate({ scrollTop: 0 }, "fast");
  		    }
  		    
  		    $(document).swipeEvents().on("swipeDown",  function(event){ 
            if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
            el.moveUp();
          }).on("swipeUp", function(event){ 
            if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
            el.moveDown();
          });


          $(document).on('mousewheel DOMMouseScroll', mouseWheelHandler);

  			}
  		}
      
      /*-------------------------------------------*/
      /*  Initialize scroll detection              */
      /*-------------------------------------------*/

      function init_scroll(event, delta) {
  			var deltaOfInterest = delta;
  			
  			if (deltaOfInterest < 0) {
  				el.moveDown()
  			} else {
  				el.moveUp()
  			}
  		}
      
      
      /*-------------------------------------------*/
      /*  Prepare Everything                       */
      /*-------------------------------------------*/

  		el.addClass("onepage-wrapper")
  		el.css("position","relative");
  		$.each(sections, function(i, item){
        $(this).addClass("ops-section").data("index", i + 1);
  		  topPos = topPos + 100;

  		  if(settings.pagination == true) {
  				paginationList += "<li><a data-index='" + (i + 1) + "' href='#" + (i + 1) + "'></a></li>";
  			}
      });

  		$(document).swipeEvents().on("swipeDown",  function(event){ 
        if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
        el.moveUp();
      }).on("swipeUp", function(event){ 
        if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
        el.moveDown();
      });

  		// Create Pagination and Display Them
      if(settings.pagination == true) {
        $("<ul class='onepage-pagination'>" + paginationList + "</ul>").prependTo("body");
        posTop = (el.find(".onepage-pagination").height() / 2) * -1;
        el.find(".onepage-pagination").css("margin-top", posTop);
      }

  		if(window.location.hash != "" && window.location.hash != "#1") {
  			var init_index =  window.location.hash.replace("#", ""),
  			    next = $(settings.sectionContainer + "[data-index='" + (init_index) + "']"),
  			    next_index = next.data("index");

  			$(settings.sectionContainer + "[data-index='" + init_index + "']").addClass("active")
  			body.addClass("viewing-page-"+ init_index)
  			if(settings.pagination == true) $(".onepage-pagination li a" + "[data-index='" + init_index + "']").addClass("active");

  			if(next) {
  				next.addClass("active")
  				if(settings.pagination == true) $(".onepage-pagination li a" + "[data-index='" + init_index + "']").addClass("active");

  				document.body.className = document.body.className.replace(/\bviewing-page-\d.*?\b/g, '');
  				
  				body.addClass("viewing-page-" + next_index)
  				if (history.replaceState && settings.updateURL == true) {
  					var href = window.location.href.substr(0,window.location.href.indexOf('#')) + "#" + (init_index);
  					history.pushState( {}, document.title, href );
  				}
  			}
  			var pos = ((init_index - 1) * 100) * -1;
  			el.transformPage(settings, pos, init_index);

  		}else{
  		  $(settings.sectionContainer + "[data-index='1']").addClass("active");
  		  body.addClass("viewing-page-1");
  			if(settings.pagination == true) $(".onepage-pagination li a[data-index='1']").addClass("active");
  		}

  		function paginationHandler() {
        var page_index = this.dataset.index;
  			el.moveTo(page_index);
  		}


  		if(settings.pagination == true)  {
  		  $(".onepage-pagination li a").click(function (){
          var page_index = $(this).data("index");
          el.moveTo(page_index);
        });
  		}

  		function mouseWheelHandler(event) {
  			event.preventDefault();
  			var delta = event.wheelDelta || -event.detail;
        if(!body.hasClass("disabled-onepage-scroll")) init_scroll(event, delta);
  		}

  		$(document).on('mousewheel DOMMouseScroll', mouseWheelHandler);

  		if(settings.responsiveFallback != false) {
  		  window.onresize = function(){
  				responsive();
  			}

  			responsive();
  		}

      function keydownHandler(e) {
  			var tag = e.target.tagName.toLowerCase();

  			if (!body.hasClass("disabled-onepage-scroll")) {
  				switch(e.which) {
  					case 38:
  						if (tag != 'input' && tag != 'textarea') el.moveUp()
  						break;
  					case 40:
  						if (tag != 'input' && tag != 'textarea') el.moveDown()
  						break;
  					default: return;
  				}
  			}
  			return false;
  		}

  		if(settings.keyboard == true) {
  			document.onkeydown = keydownHandler;
  		}
  		return false;
    }
    
    
  })
})(Zepto)