$(function() {
    // chrome.storage.local.clear();
    // chrome.storage.sync.clear();

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
            <input type="file" class="hiddenFile">\
        ');

        // Set height of menu
        $('._2dovB3N').css({
            "height":400,
        });

        $('.imageButton.original').click(function(){
            $('.' + parentCard + ' .ic-DashboardCard__header_image').removeClass('noImage');
            chrome.storage.sync.get(['removedList'], function(result) {
                var i = result.removedList.indexOf(parentCard);
                if (i >= 0) {
                    var value = result.removedList
                    value.splice(i ,1);
                    chrome.storage.sync.set({removedList: value});
                }
            });

            // Remove custom image from localStorage, and remove custom image class from element
            chrome.storage.local.remove([parentCard], function (){
                $('.' + parentCard + ' .ic-DashboardCard__header_image').removeClass(parentCard + 'background');
            });

        });

        $('.imageButton.remove').click(function(){
            $('.' + parentCard + ' .ic-DashboardCard__header_image').addClass('noImage');
            chrome.storage.sync.get(['removedList'], function(result) {
                if (result.removedList == undefined) {
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

            // Remove custom image from localStorage, and remove custom image class from element
            chrome.storage.local.remove([parentCard], function (){
                $('.' + parentCard + ' .ic-DashboardCard__header_image').removeClass(parentCard + 'background');
            });
        });

        $('.imageButton.custom').click(function(){
            $('.hiddenFile').click();
        });

        $('.hiddenFile').on('change',function(){
            if (this.files && this.files[0]) {
                var fileReader= new FileReader();
                fileReader.addEventListener("load", function(e) {
                    var base64 = e.target.result
                    console.log(base64);
                    try {
                        chrome.storage.local.set({[parentCard]: base64});
                        refreshImages();
                    } catch (err) {
                        console.warn('Unable to save image!')
                    }
                }); 
                fileReader.readAsDataURL(this.files[0]);
            }
        });
    }

    function refreshImages() {
        chrome.storage.sync.get(['removedList'], function(result) {
            if (result.removedList != undefined) {
                result.removedList.forEach(function(item) {
                    $('.' + item + ' .ic-DashboardCard__header_image').addClass('noImage');
                });
            }
        });

        chrome.storage.local.get(function(result){
            for (var key in result) {
                $('.' + key + ' .ic-DashboardCard__header_image').removeClass('noImage');
                $("<style>")
                    .prop("type", "text/css")
                    .html("\
                        ." + key + "background {\
                            background-image: url(" + result[key] + ") !important;\
                        }")
                .appendTo("head");

                $('.' + key + ' .ic-DashboardCard__header_image').addClass(key + 'background');
            }
        });
    }
    refreshImages();

    // Popup menu (in Chrome extensions section):
    $('.popup .button#clear').click(function(){
        chrome.storage.local.clear();
        chrome.storage.sync.clear();

        console.log('CDBM: Cleared local and synced storage');
    });
});