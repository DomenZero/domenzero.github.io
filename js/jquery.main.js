$(document).ready(function(){
	
	$('.btn').click(function(){
		$('.message').hide();
		$('.feedback-form').show();
		
		
	})//click .btn
	
	$(window).resize(function(){
		$('.section').height($(window).height());
		$('.mobile-menu').height($(document).height());
		$('.video').width($(window).width()+900);
		$('.video').height($(window).height()+600);
	});
	$('.section').height($(window).height());

	$('.btn-mob-menu').click(function(){
		$(this).closest('#nav-mob').addClass('active');
		return false;
	});
	$('.del').click(function(){
		$('#nav-mob').removeClass('active');
		return false;
	});
	$('.mobile-menu').height($(document).height());
	$(document).click(function(event) {
	 	if ($(event.target).closest('.mobile-menu').length) return;
		 $('#nav-mob').removeClass('active');
	 	event.stopPropagation();
	});
	$('.video').width($(window).width()+900);
	$('.video').height($(window).height()+600);

	$('input, textarea').placeholder();
	initPopups ();
	function initPopups (){
		$('body')
			.popup({
				"opener":".btn",
				"popup_holder":"#popup1",
				"popup":".pop-up",
				"close_btn":".close-popup"
			})
	}
	
	initPlayerForm();
});



function initPlayerForm(){
	$('.feedback-form').each(function(){
		var form=$(this),
		input=form.find('input'),
		textarea=form.find('textarea');
		form.submit(function(e){
			input.trigger('blur');
			textarea.trigger('blur');
			values = $(this).serialize();
			console.log();
			$.ajax({
				url: "feedback.php",
				type: "post",
				data: values,
				success: function(){
					form.find('input[type=text], input[type=email], textarea').each(function() {
						$(this).val('');
					});
					$('.feedback-form').hide();
					$('.message').show();

				},
				error:function(){
				
				}
			});
			
			form.find('input[type=text], input[type=email], textarea').each(function() {
				$(this).val('');
			});
			$('.feedback-form').hide();
			$('.message').show();

			return false;
		});
	});
}

function cmeClr () { // clear form
		jQuery(document).find(".feedback-form [type=text]").val("");
		
	} 



$.fn.popup = function(o){
 var o = $.extend({
    "opener":".call-back a",
    "popup_holder":"#call-popup",
    "popup":".popup",
    "close_btn":".btn-close",
    "close":function(){},
    "beforeOpen": function(popup) {
     $(popup).css({
      'left': 0,
      'top': 0
     }).hide();

    }
   },o);
 return this.each(function(){
  var container=$(this),
   opener=$(o.opener,container),
   popup_holder=$(o.popup_holder,container),
   popup=$(o.popup,popup_holder),
   close=$(o.close_btn,popup),
   bg=$('.bg',popup_holder);
   popup.css('margin',0);
   opener.click(function(e){
    o.beforeOpen.apply(this,[popup_holder]);
	popup_holder.css('left',0);
    popup_holder.fadeIn(400);
    alignPopup();
    bgResize();
    e.preventDefault();
   });
  function alignPopup(){
   var deviceAgent = navigator.userAgent.toLowerCase();
   var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/i);
   if(agentID){
    if(popup.outerHeight()>window.innerHeight){
     popup.css({'top':$(window).scrollTop(),'left': ((window.innerWidth - popup.outerWidth())/2) + $(window).scrollLeft()});
     return false;
    }
    popup.css({
     'top': ((window.innerHeight-popup.outerHeight())/2) + $(window).scrollTop(),
     'left': ((window.innerWidth - popup.outerWidth())/2) + $(window).scrollLeft()
    });
   }else{
    if(popup.outerHeight()>$(window).outerHeight()){
     popup.css({'top':$(window).scrollTop(),'left': (($(window).width() - popup.outerWidth())/2) + $(window).scrollLeft()});
     return false;
    }
    popup.css({
     'top': (($(window).height()-popup.outerHeight())/2) + $(window).scrollTop(),
     'left': (($(window).width() - popup.outerWidth())/2) + $(window).scrollLeft()
    });
   }
  }
  function bgResize(){
   var _w=$(window).width(),
    _h=$(document).height();
   bg.css({"height":_h,"width":_w+$(window).scrollLeft()});
  }
  $(window).resize(function(){
   if(popup_holder.is(":visible")){
    bgResize();
    alignPopup();
   }
  });
  if(popup_holder.is(":visible")){
    bgResize();
    alignPopup();
  }
  close.add(bg).click(function(e){
   var closeEl=this;
   popup_holder.fadeOut(400,function(){
    o.close.apply(closeEl,[popup_holder]);
    cmeClr();
   });
   cmeClr();
   e.preventDefault();
   cmeClr();
  });
  $('body').keydown(function(e){
   if(e.keyCode=='27'){
    popup_holder.fadeOut(400);
   }
  })
 });
};