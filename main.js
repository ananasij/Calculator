var keys = {};
var calc;

function init() {
    initKeyboard();
    calc = new Calculator();
    showCurrentInput(0);

    $('body').on('keyup', function(e) {
        var targetBtn = keys[e.keyCode];
        if (targetBtn) {
            targetBtn.click();
        }
    });

    $('.js-btn').on('click', function(e) {
        e.preventDefault();
        var input = $(e.target).text();

        calc.processInput(input);
        var currentInput = calc.getCurrentInput();
        if (currentInput !== false) {
            showCurrentInput(currentInput);
            updateHistory();
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

function updateHistory() {
    var historyLine = $('.js-display').find('.js-history');
    historyLine.text(calc.writeCalculation());
}

$(document).ready(init);

// CALC

var STATE_START = 'STATE_START';
var STATE_NUMBER = 'STATE_NUMBER';
var STATE_OPERATOR = 'STATE_OPERATOR';
var STATE_ERROR = 'STATE_ERROR';
var OPERATOR_SUM = '+';
var OPERATOR_SUBSTR = '−';
var OPERATOR_MULT = '×';
var OPERATOR_DIV = '÷';
var INPUT_NUMBER = 'INPUT_NUMBER';
var INPUT_OPERATOR = 'INPUT_OPERATOR';
var INPUT_DOT = 'INPUT_DOT';
var INPUT_EQUAL = 'INPUT_EQUAL';
var INPUT_CLEAR = 'INPUT-CLEAR';
var NUM_LIMIT = 14;


function Calculator() {
    this.state = STATE_START;
    this.clear();
}

Calculator.prototype.processInput = function(input) {
    var inputType = this.getType(input);
    var currentNumber = this.getNumberToModify();
    switch (inputType) {
        case INPUT_NUMBER:
            if ([STATE_START, STATE_NUMBER, STATE_OPERATOR, STATE_ERROR].includes(this.state)) {
                if ([STATE_START, STATE_ERROR].includes(this.state)) {
                    this.clear();
                }
                this.state = STATE_NUMBER;
                this[currentNumber] = this.addDigit(input, this[currentNumber]);
            }
            break;
        case INPUT_DOT:
            if ([STATE_START, STATE_NUMBER, STATE_OPERATOR, STATE_ERROR].includes(this.state)) {
                if ([STATE_START, STATE_ERROR].includes(this.state)) {
                    this.clear();
                }
                this.state = STATE_NUMBER;
                this[currentNumber] = this.addDot(this[currentNumber]);
            }
            break;
        case INPUT_OPERATOR:
            if ([STATE_START, STATE_NUMBER, STATE_OPERATOR].includes(this.state)) {
                this.state = STATE_OPERATOR;
                this.setOperation(input);
            }
            break;
        case INPUT_EQUAL:
            if (this.state === STATE_NUMBER) {
                this.state = STATE_START;
                this.calculate();
            }
            break;
        case INPUT_CLEAR:
            this.state = STATE_START;
            this.clear();
            break;
        default:
            break;
    }
};

Calculator.prototype.getType = function(input) {
    if (/[0-9]/.test(input)) {
        return INPUT_NUMBER;
    }
    if (/÷|×|−|\+/.test(input)) {
        return INPUT_OPERATOR;
    }
    if (/,/.test(input)) {
        return INPUT_DOT;
    }
    if (/=/.test(input)) {
        return INPUT_EQUAL;
    }
    if (/C/.test(input)) {
        return INPUT_CLEAR;
    }
    return undefined;
};

Calculator.prototype.addDigit = function(digit, number) {
    if (number.toString().length >= NUM_LIMIT) {
        return number;
    }
    if (number.toString() === '0') {
        return digit;
    }
    return '' + number + digit;
};

Calculator.prototype.addDot = function(number) {
    if (('' + number).includes('.')) {
        return number;
    }
    if (!number) {
        return '0.';
    }
    return number + '.';
};

Calculator.prototype.clear = function() {
    this.firstNumber = '';
    this.secondNumber = '';
    this.operator = null;
};

Calculator.prototype.setOperation = function(operator) {
    if (!this.firstNumber) {
        this.firstNumber = '0';
    }
    if (this.secondNumber) {
        this.calculate();
        if (this.state === STATE_ERROR) {
            return;
        }
    }
    this.operator = operator;
};

Calculator.prototype.writeCalculation = function() {
    var calculation = '';
    calculation += this.firstNumber;
    if (this.operator) {
        calculation += this.operator;
    }
    if (this.secondNumber) {
        calculation += this.secondNumber;
    }
    return calculation;
};

Calculator.prototype.getNumberToModify = function() {
    if (this.operator) {
        return 'secondNumber';
    }
    return 'firstNumber';
};

Calculator.prototype.calculate = function() {
    if (!this.secondNumber) {
        return;
    }
    var result = 0;
    var a = parseFloat(this.firstNumber);
    var b = parseFloat(this.secondNumber);
    switch (this.operator) {
        case OPERATOR_SUM:
            result = a + b;
            break;
        case OPERATOR_SUBSTR:
            result = a - b;
            break;
        case OPERATOR_MULT:
            result = a * b;
            break;
        case OPERATOR_DIV:
            result = a / b;
            break;
        default:
            break;
    }

    this.secondNumber = '0';
    this.operator = null;
    if (!Number.isFinite(result) || (result.toFixed(0)).toString().length > NUM_LIMIT) {
        this.state = STATE_ERROR;
        this.firstNumber = '0';
    } else {
        this.firstNumber = this.formatNumber(result.toString());
    }
};

Calculator.prototype.getCurrentInput = function() {
    switch (this.state) {
        case STATE_START:
        case STATE_NUMBER:
            var currentNumber = this.getNumberToModify();
            if (this[currentNumber]) {
                return this[currentNumber];
            }
            return '0';
        case STATE_OPERATOR:
            return this.operator;
        case STATE_ERROR:
            return 'ERROR!';
        default:
            return false;
    }
};

Calculator.prototype.formatNumber = function(number) {
    var prettyNumber = number.toString();
    if (prettyNumber.includes('.')) {
        return parseFloat(prettyNumber).toFixed(6).toString().replace(/0+$/, '');
    }
    return prettyNumber;
};
