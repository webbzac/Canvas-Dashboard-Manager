$(function() {
    $('.icon-more').click(function(){
        setTimeout(showButton, 100);
    });

    function showButton() {
        $('.ColorPicker__Container').append('\
            <div class="changeImage _2xB3_kf">Image</div>\
            <div class="imageButton _922amOO _16-3B-L AIqd8V_ remove">Remove Image</div>\
            <div class="imageButton _922amOO _16-3B-L AIqd8V_ original">Set to Original</div>\
            <div class="imageButton _922amOO _16-3B-L AIqd8V_ custom">Custom Image</div>\
        ');

        $('._2dovB3N').css({
            "height":400,
        });

        $('.imageButton.remove').click(function(){
            alert('re')
        });
    }
});