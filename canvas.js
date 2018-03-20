$(function() {
    var cardNumber = 0;

    // Gives each Dashboard card a unique identifier
    $('.ic-DashboardCard').each(function(){
        $(this).addClass('imageCard' + cardNumber)
        cardNumber++;
    });

    $('.icon-more').click(function(){
        parentCard = $(this).parents()[4];
        parentCard = $(parentCard).attr("class").split(' ')[1];

        setTimeout(function(){
            showMenu(parentCard)
        }, 100);
    });

    function showMenu(parentCard) {
        // Add Image buttons to menu
        $('.ColorPicker__Container').append('\
            <div class="changeImage _2xB3_kf">Image</div>\
            <div class="imageButton _922amOO _16-3B-L AIqd8V_ remove">Remove Image</div>\
            <div class="imageButton _922amOO _16-3B-L AIqd8V_ original">Set to Original</div>\
            <div class="imageButton _922amOO _16-3B-L AIqd8V_ custom">Custom Image</div>\
        ');

        // Set height of menu
        $('._2dovB3N').css({
            "height":400,
        });

        $('.imageButton.original').click(function(){
            chrome.storage.sync.get(['removedList'], function(result) {
                var i = result.removedList.indexOf(parentCard);
                if (i >= 0) {
                    var value = result.removedList
                    value.splice(i ,1);
                    chrome.storage.sync.set({removedList: value});
                }
            });
        });

        $('.imageButton.remove').click(function(){
            chrome.storage.sync.get(['removedList'], function(result) {
                if (result.removedList == '') {
                    value = [parentCard];
                    chrome.storage.sync.set({removedList: value});

                } else {
                    if (result.removedList.indexOf(parentCard) == -1) {
                        var value = result.removedList
                        value.push(parentCard)
                        chrome.storage.sync.set({removedList: value});
                    }
                }
            });
        });

        $('.imageButton.custom').click(function(){
            chrome.storage.sync.set({removedList: []}, function() {
                console.warn('List is wiped');
            });
        });

        $('.imageButton').click(function(){
            refreshImages();
        });
    }

    function refreshImages() {
        chrome.storage.sync.get(['removedList'], function(result) {
            result.removedList.forEach(function(item) {
                $('.' + item + ' .ic-DashboardCard__header_image').addClass('noImage');
            });
        });
    }

    refreshImages();
});