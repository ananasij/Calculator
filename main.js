var keys = {
};

function init() {
    initKeyboard();
    var calc = new Calculator();
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

    $('.js-btn').on('click', function(e) {
        e.preventDefault();
        var input = $(e.target).text();
        console.log(input + ': ' + calc.processInput(input) + ' -> new state: ' + calc.state);
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

// CALC

var STATE_START = 'start';
var STATE_NUMBER = 'number input';
var STATE_OPERATOR = 'operator entered';
/* var OPERATOR_SUM = '';
var OPERATOR_SUBSTR = '';
var OPERATOR_MULT = '';
var OPERATOR_DIV = ''; */

function Calculator() {
    this.state = STATE_START;
    this.firstNumber = 0;
    this.secondNumber = null;
    this.operator = null;
}

Calculator.prototype.processInput = function(input) {
    var inputType = getType(input);
    console.log(inputType + ' for ' + this.state);
    switch (this.state) {
        case STATE_START:
            if (inputType === 'number') {
                this.state = STATE_NUMBER;
                return true;
            } else if (inputType === 'dot') {
                this.state = STATE_NUMBER;
                return true;
            } else if (inputType === 'operator') {
                this.state = STATE_OPERATOR;
                return true;
            }
            return false;
        case STATE_NUMBER:
            if (inputType === 'number') {
                this.state = STATE_NUMBER;
                return true;
            } else if (inputType === 'dot') {
                this.state = STATE_NUMBER;
                return true;
            } else if (inputType === 'operator') {
                this.state = STATE_OPERATOR;
                return true;
            } else if (inputType === 'equal') {
                this.state = STATE_START;
                return true;
            } else if (inputType === 'clear') {
                this.state = STATE_START;
                return true;
            }
            return false;
        case STATE_OPERATOR:
            if (inputType === 'number') {
                this.state = STATE_NUMBER;
                return true;
            } else if (inputType === 'dot') {
                this.state = STATE_NUMBER;
                return true;
            } else if (inputType === 'operator') {
                this.state = STATE_OPERATOR;
                return true;
            } else if (inputType === 'clear') {
                this.state = STATE_START;
                return true;
            }
            return false;
        default:
            return false;
    }
};

function getType(input) {
    if (/[0-9]/.test(input)) {
        return 'number';
    }
    if (/÷|×|−|\+/.test(input)) {
        return 'operator';
    }
    if (/\.|,/.test(input)) {
        return 'dot';
    }
    if (/=/.test(input)) {
        return 'equal';
    }
    if (/C/.test(input)) {
        return 'clear';
    }
    return undefined;
}