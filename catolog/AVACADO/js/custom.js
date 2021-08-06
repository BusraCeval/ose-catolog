

$( window ).load(function() {		

	// add the animation to the modal
	$( ".modal" ).each(function(index) {
        var self = $(this);
		$(this).on('show.bs.modal', function (e) {
			$(this).addClass('in');
        	$(this).find('.modal-dialog').velocity('transition.fadeIn');
       		$(this).show();	    	      
		}); 
		$(this).on('hide.bs.modal', function (e) {
			$(this).find('.modal-dialog').velocity('transition.fadeOut');
			$(this).removeClass('in');
			var self = this;
			$(this).delay(500).queue(function() {
		     	$(self).hide();	    	
				$(this).dequeue();
		  	});
			$('body').removeClass('modal-open');
            $('iframe').each(function(){
                var leg=$(this).attr("src");
                $(this).attr("src",leg);
            });
			e.stopPropagation();
	    	e.preventDefault();
	    	return false;
		});
        if(self.hasClass('ose_popup')&&self.attr('data-wait')&&self.attr('data-wait')!=''){
            var wait_time = self.attr('data-wait')*1000;
            setTimeout(
                function(){
                    self.modal('show');
                }, wait_time);
        }
	});




	$("form.osefort-form").on( "submit", function( event ) {
        event.preventDefault();
        var values = {};
        var temp_str = "";
        var theform = this;
        var proceed = true;
        var is_confirm = false;
        var confirm_pop = "";
        var is_redirect = false;
        var redirect_link = "";
        var have_type = false;
        var the_type = "";
        var the_list = "";
        var have_list = false;
        $('.alert').slideUp();
        if($(theform).attr('ose-popup')){
            confirm_pop = $(theform).attr('ose-popup');
            is_confirm = true;
        }
        if($(theform).attr('ose-redirect')){
            redirect_link = $(theform).attr('ose-redirect');
            is_redirect = true;
        }
        if($(theform).attr('ose-form-type')){
            if(($(theform).attr('ose-form-type')!='') && ($(theform).attr('ose-form-type')!='#' )){
                the_type = $(theform).attr('ose-form-type');
                have_type = true;    
            }
        }
        if($(theform).attr('ose-list-id')){
            if($(theform).attr('ose-list-id')!=''){
                the_list = $(theform).attr('ose-list-id');
                have_list = true;    
            }
        }
        $("input, textarea, select").css('border-color',''); 
        $.each($(theform).serializeArray(), function(i, field) {
            values[ose_replace_chars(field.name)] = field.value;
            temp_str += ose_replace_chars(field.name) + ": " + field.value + "\n";
            if(field.value=="" && $(field).attr('required')){
            	field.css('border-color','red');
                proceed = false;
            }
        });
        if(proceed){   
            if(have_type){ values['osefort_form_type'] = the_type; }
            if(have_list){ values['osefort_form_list'] = the_list; }
            var post_data;
            var output;
            $.post('ose_mail/new_contact.php', values, function(response){
                $(theform).find('.alert').remove();
                setTimeout(
                    function(){
                        if(response.type == 'error'){
                            var alert_msg = '<div class="alert alert-danger" role="alert" style="display:none;">'+response.text+'</div>';
                            $(theform).prepend(alert_msg);
                            $('.alert').slideDown();
                        }else{
                            if(is_confirm){ $(confirm_pop).modal('show'); }
                            if(is_redirect){ window.location.href = redirect_link; }
                            var alert_msg = '<div class="alert alert-success" role="alert" style="display:none;">'+response.text+'</div>';
                            $(theform).prepend(alert_msg);
                            $('.alert').slideDown();
                            $(theform).find('input').val('');
                            $(theform).find('input').css('border-color','');
                            $(theform).find('textarea').val('');
                        }
                    }, 500);
            }, 'json');
        }
    });
	$("input, textarea, select").keyup(function() { 
		$(this).css('border-color',''); 
        $('.alert').slideUp();
    });



    $('.ose-countdown').each(function(){
        var self = $(this);
        var endDate = $(this).attr('data-date');
        self.countdown({
            date: endDate,
            render: function(data) {
                $.each(data, function(key, value) {
                    self.find('.ose-count-'+key).html(value);
                });
            },
            onEnd: function(){
                if($(this.el).attr('data-redirect')){
                    window.location.href = $(this.el).attr('data-redirect');
                }
                if($(this.el).attr('data-popup')){
                    $($(this.el).attr('data-popup')).modal('show');
                }
            }
        });
    });


	
	var width = $(window).width();
	if(($('.ose_scroll_menu').length==0)&&(width>768)){
		ose_scroll_menu();
	}
	
	ose_mobile_bg();
	
	

	$(window).on('resize', function(){
		if($(this).width() != width){
			width = $(this).width();
       		if(width>768){
       			if($('.ose_scroll_menu').length==0){
       				ose_scroll_menu();
       			}
       		}else{
       			if($('.ose_scroll_header').length>0){
					$('.ose_scroll_menu').remove();
				}
       		}
       		$('.ose_scroll_menu, .ose_nav_menu').find(".dropdown, .btn-group").removeClass('hover_open');
       		$('.ose_scroll_menu, .ose_nav_menu').find(".dropdown, .btn-group").removeClass('open');
		}
	});

	$(document).on({
        mouseenter: function () {
        	if(width>768){
	        	$('.ose_scroll_menu').find(".dropdown, .btn-group").removeClass('hover_open');
	            var dropdownMenu = $(this).children(".dropdown-menu");
	            if(dropdownMenu.is(":visible")){
	                dropdownMenu.parent().toggleClass("hover_open");
	            }
        	}
        },
        mouseleave: function () {
            if(width>768){
	            var dropdownMenu = $(this).children(".dropdown-menu");
	            if(dropdownMenu.is(":visible")){
	                dropdownMenu.parent().toggleClass("hover_open");
	            }
	            $('.ose_scroll_menu').find(".dropdown, .btn-group").removeClass('hover_open');
	        }
        }
    }, ".dropdown, .btn-group");

	$(window).scroll(function() {
		if (jQuery(window).scrollTop() >= 400) {
			$('.ose_scroll_menu').css({
				'top' : '0px',
				'visibility': 'visible',
			});
			$('.ose_scroll_menu').find(".dropdown, .btn-group").children(".dropdown-menu").css({
				'display': 'block'
			});
			$('.ose_scroll_menu').find(".dropdown, .btn-group").removeClass('open');
		} else {
			$('.ose_scroll_menu').css({
				'top' : '-80px',
				'visibility': 'hidden'
			});
			$('.ose_scroll_menu').find(".dropdown, .btn-group").removeClass('hover_open');
			$('.ose_scroll_menu').find(".dropdown, .btn-group").children(".dropdown-menu").css({
				'display': 'none'
			});
			$('.ose_nav_menu').find(".dropdown, .btn-group").removeClass('open');
		}	
	});


    if($('body').find('.ose_nav_menu')){
        var header_sec = $('body').find('.ose_section.ose_nav_menu');
        if(header_sec.hasClass('ose-over-header')||header_sec.hasClass('ose-fixed-top')){
            var sec_index = header_sec.index();
            var header_h = header_sec.outerHeight();
            sec_index++;
            // $('[data-ose-offset]').each(function(){
            //     var el_padding = $(this).css('padding-top').replace("px", "");
            //     var el_offset = $(this).attr('data-ose-offset');
            //     var new_padding = el_padding - el_offset;
            //     $(this).css('padding-top', new_padding);
            //     $(this).removeAttr('data-ose-offset');
            // });
            var sec = $('body > .ose_section').eq(sec_index);
            if(sec.length){
                if(!sec.attr('data-ose-offset')){
                    sec.attr('data-ose-offset', header_h);
                    var sec_padding = sec.css('padding-top').replace("px", "");
                    sec_padding=Number(sec_padding)+Number(header_h);
                    //sec.css('padding-top', sec_padding);
                }
            }
        }
    }

    $('a[href*=#]:not(.carousel-control,.collapsed)').on("click", function(){
        if($(this).attr('data-toggle')!='collapse' && $(this).attr('data-toggle')!='tab'){
            if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
                var $target = $(this.hash);
                $target = $target.length && $target;
                if ($target.length) {
                    var targetOffset = $target.offset().top;
                    $('html,body').animate({scrollTop: targetOffset}, 1000);
                    return false;
                }
            }
        }
    });

});


// ===========================================================
// Functions
// ===========================================================

function ose_scroll_menu(){
    if($('.ose_scroll_header').length>0){
        var logo_img = 'images/showcase/logo-thin.png';
        var logo_text = false;
        if($('.ose-logo-img').length>0){
            logo_img = $('.ose-logo-img')[0].src;
            ose_fix_heights();
        }else{
            logo_text = $('.logo-img.logo-img-a').html();
        }
        var scroll_bg = 'background: #fff;';
        if($('.ose_scroll_header').attr('data-scroll-bg')){
            scroll_bg = 'background: '+$('.ose_scroll_header').attr('data-scroll-bg')+';';
        }
        var nav_menu = '';
        if($('#ose-header-nav').length>0){
            nav_menu = $('<div>').append($('#ose-header-nav').clone().attr('id', 'ose-scroll-nav').addClass('navbar-right').addClass('ose-adjust-scroll').css('margin-top', 0)).html();
        }
        var header_btn = false;
        var header_btn_div = "";
        if($('#ose-header-btn').length>0){
            header_btn_div = '<div class="col-md-2"><div class="ose-content ose-adjust-scroll text-right">';
            var btns = $('#ose-header-btn').clone();
            btns.find('a').css('margin-top',0);
            header_btn_div += btns.html();
            header_btn_div += '</div></div>';
            header_btn=true;
        }

        var scroll_col = "col-md-12";
        if(header_btn){
            scroll_col = "col-md-10";
        }

        var sh2 = '<div class="ose_scroll_menu ose_menu_hidden" style="padding-top: 10px; padding-bottom: 10px; '+scroll_bg+'">'+
            '<div class="container">'+
            '<div class="row">'+
            '<div class="ose-inner-col '+scroll_col+'">'+
            '<div class="ose-content">'+
            '<nav class="navbar navbar-default ose-no-margin-bottom ose-navbar-default">'+
            '<div class="container-fluid">'+
            '<div class="navbar-header">'+
            '<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">'+
            '<span class="sr-only">Toggle navigation</span>'+
            '<span class="icon-bar"></span>'+
            '<span class="icon-bar"></span>'+
            '<span class="icon-bar"></span>'+
            '</button>';
        if(!logo_text){
            sh2 += '<a class="navbar-brand logo-img ose-adjust-scroll" href="#"><img src="'+logo_img+'" alt="" class="img-responsive scroll_logo_img"></a>';
        }else{
            sh2 += '<a class="navbar-brand logo-img logo-text ose-adjust-scroll" href="#">'+logo_text+'</a>';
        }
        sh2 += '</div>'+
            '<div class="collapse navbar-collapse">'+
            nav_menu+
            '</div>'+
            '</div>'+
            '</nav>'+
            '</div>'+
            '</div>';
        if(header_btn){
            sh2 += header_btn_div;
        }
        sh2+='</div>'+
            '</div>'+
            '</div>'+
            '</div>';
        $('body').append(sh2);
        ose_fix_scroll_heights();
    }
}

function ose_mobile_bg(){
	$('.ose_nav_menu').each(function(){
		$(this).attr('data-main-bg',$(this).css('background'));
	});
	var width = $(window).width();
	if(width<768){
		$('.ose_nav_menu').each(function(){
	        if($(this).attr('data-scroll-bg')){
	        	var bg = $(this).attr('data-scroll-bg');

	        	$(this).css('background',bg);
	        }
		});
	}
	$(window).on('resize', function(){
		if($(this).width() != width){
			width = $(this).width();
			if(width<768){
				$('.ose_nav_menu').each(function(){
			        if($(this).attr('data-scroll-bg')){
			        	var bg = $(this).attr('data-scroll-bg');
			        	$(this).css('background-color',bg);
			        }
				});
			}else{
				$('.ose_nav_menu').each(function(){
					$(this).css('background-color',$(this).attr('data-main-bg'));
				});
			}
		}
	});
}
function ose_fix_heights(){
    $('.ose_nav_menu').each(function(){
        var max_h = 0;
        $(this).find('.ose-adjust-height').each(function(item){
            if($(this).outerHeight()>max_h){max_h=$(this).outerHeight();}
        });
        if(max_h>0){
            $(this).find('.ose-adjust-height').each(function(item){
                var item_h = +$(this).outerHeight();
                if(item_h<max_h){
                    var diff = max_h - item_h;
                    diff /=2;
                    $(this).css('margin-top', diff);
                }
            });
        }
	});
}
function ose_fix_scroll_heights(){
	var max_h = 0;
	$('.ose-adjust-scroll').each(function(item){
		if($(this).outerHeight()>max_h){max_h=$(this).outerHeight();}
	});
	if(max_h>0){
		var logo_h = $('.logo-img-a').outerHeight();
		$('.ose-adjust-scroll').each(function(item){
			var item_h = $(this).outerHeight();
			if(item_h<max_h){
				var diff = max_h - item_h;
				diff /=2;
				$(this).css('margin-top', diff);
			}
		});
	}
}


function ose_disable_nav_click(){
	$('.ose_scroll_menu, .ose_nav_menu').find(".dropdown, .btn-group").on('click', function(e){
		if($(window).width()>768){
			e.stopPropagation();
	    	e.preventDefault();
	    	return false;
    	}
	});
}

function ose_replace_chars(string){
	return string.replace(/[^a-zA-Z0-9]/g,'_');
}