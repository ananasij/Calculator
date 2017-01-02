var keys = {
};

function init() {
    initKeyboard();
    showCurrentInput(0);

    $('.js-inputBtn').on('click', function(e) {
        e.preventDefault();
        var input = $(e.target).text();
        showCurrentInput(input);
        updateHistory(input);
    });

    $('.js-clearBtn').on('click', function(e) {
        e.preventDefault();
        clearInput();
    });

    $('body').on('keyup', function(e) {
        var targetBtn = keys[e.keyCode];
        if (targetBtn) {
            targetBtn.click();
        }
    });
}

function initKeyboard() {
    var buttons = $('.js-btn');
    var buttonsLen = buttons.length;
    for (var i = 0; i < buttonsLen; i++) {
        var keysList = $(buttons[i]).data('key').toString().split(' ');
        var keysListLen = keysList.length;
        for (var j = 0; j < keysListLen; j++) {
            keys[keysList[j]] = buttons[i];
        }
    }
}

function showCurrentInput(input) {
    var inputDisplay = $('.js-display').find('.js-current');
    inputDisplay.text(input);
}

function updateHistory(input) {
    var historyLine = $('.js-display').find('.js-history');
    historyLine.append(input);
}

function clearInput() {
    showCurrentInput(0);
}

$(document).ready(init);

