function getRandomSize(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

jQuery(document ).ready(function( $ ) {
var allImages = "";

for (var i = 1; i < 3; i++) {
  // var width = getRandomSize(200, 400);
  // var height =  getRandomSize(200, 400);
 
  // allImages += '<img src="https://placekitten.com/'+width+'/'+height+'" alt="">';
  // allImages += '<img src="http://localhost/wordpress/wp-content/themes/chronicle/gallery/'+'photo_'+i+'.jpg'+'">';
  // allImages += '<a class="example-image-link" href="http://localhost/wordpress/wp-content/themes/chronicle/gallery/'+'photo_'+i+'.jpg'+'" data-lightbox="example-set" > <img  src="http://localhost/wordpress/wp-content/themes/chronicle/gallery/'+'photo_'+i+'.jpg'+'" alt=""/></a>';
    // allImages += '<a class="example-image-link" href="http://localhost/wordpress/wp-content/themes/chronicle/gallery/'+'photo_'+i+'.jpg'+'" data-lightbox="example-set" > <img  src="http://localhost/wordpress/wp-content/themes/chronicle/gallery/'+'photo_'+i+'.jpg'+'" ></a>';
   // allImages += '<a class="example-image-link" href="http://localhost/wordpress/wp-content/themes/chronicle/gallery/'+'photo_'+i+'.jpg'+'" data-lightbox="example-set" > <img src="http://localhost/wordpress/wp-content/themes/chronicle/gallery/'+'photo_'+i+'.jpg'+'" alt=""/></a>';
allImages += '<img src="gallery/'+'photo_'+i+'.jpg'+'" data-big="gallery/'+'photo_'+i+'.jpg'+'" class="fancybox" >';

  }

$('#photos').append(allImages);
	});

jQuery(document ).ready(function( $ ) {

			$('.pictures').jMosaic({min_row_height: 200, margin: 3, is_first_little: true});
		});

$(function($){
        var addToAll = true;
        var gallery = true;
        var titlePosition = 'inside';
        $(addToAll ? 'img.fancybox' : 'img.fancybox').each(function(){
            var $this = $(this);
            var title = $this.attr('title');
            var src = $this.attr('data-big') || $this.attr('src');
            var a = $('<a href="#" class="fancybox"></a>').attr('href', src).attr('title', title);
            $this.wrap(a);
        });
        if (gallery)
            $('a.fancybox').attr('rel', 'fancyboxgallery');
        $('a.fancybox').fancybox({
            titlePosition: titlePosition
        });
    });
    $.noConflict();


jQuery(document ).ready(function( $ ) {

$('.scrollable').enscroll({
    showOnHover: true,
    verticalTrackClass: 'track3',
    verticalHandleClass: 'handle3'
});
});