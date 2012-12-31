/**
 * @author Bartosz Maciaszek <bartosz.maciaszek@gmail.com>
 * Inspired by http://qlocktwo.com
 * Some code borrowed from http://code.google.com/p/js-fuzzy-clock/
 */
var wordclock = function(element, options) {
    
    /**
     * Clock object
     */
    var wordclock = {
            
        /**
         * The date to operate on
         * @var Date
         */
        date: null,
        
        /**
         * The element to draw the clock to
         * @var HTMLElement
         */
        element: null,
        
        /**
         * Interval function id
         * @var int
         */
        interval: 0,
        
        /**
         * Options and their default values
         * @var object
         */
        options: {
            interval: 5000
        },
        
        /**
         * Matrix of clock letters
         * @var array
         */
        letters: [
           [ 'I', 'T', 'L', 'I', 'S', 'A', 'S', 'T', 'I', 'M', 'E' ],
           [ 'A', 'C', 'Q', 'U', 'A', 'R', 'T', 'E', 'R', 'D', 'C' ],
           [ 'T', 'W', 'E', 'N', 'T', 'Y', 'F', 'I', 'V', 'E', 'X' ],
           [ 'H', 'A', 'L', 'F', 'B', 'T', 'E', 'N', 'F', 'T', 'O' ],
           [ 'P', 'A', 'S', 'T', 'E', 'R', 'U', 'N', 'I', 'N', 'E' ],
           [ 'O', 'N', 'E', 'S', 'I', 'X', 'T', 'H', 'R', 'E', 'E' ],
           [ 'F', 'O', 'U', 'R', 'F', 'I', 'V', 'E', 'T', 'W', 'O' ],
           [ 'E', 'I', 'G', 'H', 'T', 'E', 'L', 'E', 'V', 'E', 'N' ],
           [ 'S', 'E', 'V', 'E', 'N', 'T', 'W', 'E', 'L', 'V', 'E' ],
           [ 'T', 'E', 'N', 'S', 'E', 'O\'', 'C', 'L', 'O', 'C', 'K' ]
        ],
        
        /**
         * Word representations of hours
         * @var array
         */
        hours: [
            'twelve', 'one', 'two', 'three', 'four', 'five', 'six',
            'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'
        ],
        
        /**
         * Word representation of minutes
         * @var object
         */
        minutes: {
            '5' : 'five',
            '10': 'ten',
            '15': 'quarter',
            '20': 'twenty',
            '30': 'half'
        },
        
        /**
         * The map of words on the clock
         * @var object
         */
        wordMap: {
            'it'     : [ [0, 0], [0, 1] ],
            'is'     : [ [0, 3], [0, 4] ],
            'to'     : [ [3, 9], [3, 10] ],
            'past'   : [ [4, 0], [4, 1], [4, 2], [4, 3] ],
            'oclock' : [ [9, 5], [9, 6], [9, 7], [9, 8], [9, 9], [9, 10] ],
            
            'minutes_five'    : [ [2, 6], [2, 7], [2, 8], [2, 9] ],
            'minutes_ten'     : [ [3, 5], [3, 6], [3, 7] ],
            'minutes_quarter' : [ [1, 0], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8] ],
            'minutes_twenty'  : [ [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5] ],
            'minutes_half'    : [ [3, 0], [3, 1], [3, 2], [3, 3] ],
            
            'hours_one'    : [ [5, 0], [5, 1], [5, 2] ],
            'hours_two'    : [ [6, 8], [6, 9], [6, 10] ],
            'hours_three'  : [ [5, 6], [5, 7], [5, 8], [5, 9], [5, 10] ],
            'hours_four'   : [ [6, 0], [6, 1], [6, 2], [6, 3] ],
            'hours_five'   : [ [6, 4], [6, 5], [6, 6], [6, 7] ],
            'hours_six'    : [ [5, 3], [5, 4], [5, 5] ],
            'hours_seven'  : [ [8, 0], [8, 1], [8, 2], [8, 3], [8, 4] ],
            'hours_eight'  : [ [7, 0], [7, 1], [7, 2], [7, 3], [7, 4] ],
            'hours_nine'   : [ [4, 7], [4, 8], [4, 9], [4, 10] ],
            'hours_ten'    : [ [9, 0], [9, 1], [9, 2] ],
            'hours_eleven' : [ [7, 5], [7, 6], [7, 7], [7, 8], [7, 9], [7, 10] ],
            'hours_twelve' : [ [8, 5], [8, 6], [8, 7], [8, 8], [8, 9], [8, 10] ],
        },
        
        init: function(element, options) {
            for(var opt in options) {
                this.options[opt] = options[opt];
            }
            
            this.element = element;
            
            return this.start();
        },
        
        start: function() {
            this.interval = window.setInterval((function(scope) {
                return function(){
                    scope.update.call(scope);
                };
            })(this), this.options.interval);
            
            return this.update();
        },
        
        stop: function() {
            window.clearInterval(this.interval);
            return this;
        },
        
        highlight: function(word) {
            if(typeof this.wordMap[word] != undefined) {
                $.each(this.wordMap[word], function(key, item) {
                    $('div.row div[x="' + item[0] + '"][y="' + item[1] + '"]').addClass('active');
                });
            }
        },
        
        draw: function() {
            var self = this;
            $(this.element).empty();
            $.each(this.letters, function(x, letterRow) {
                var row = $('<div class="row" />');
                $.each(letterRow, function(y, letter) {
                    console.log(letter);
                    row.append($('<div>').attr('x', x).attr('y', y).html(letter));
                });
                $(self.element).append(row);
            });
            
            $(this.element).append('<div style="clear: both;"></div>');
        },
        
        update: function() {
            
            this.draw();
            
            this.date = this.options.date || new Date();
            
            var hours = this.date.getHours();
            var minutes = this.date.getMinutes();
            var infix;
            
            if(hours >= 12) {
                hours -= 12;
            }
            
            this.highlight('it');
            this.highlight('is');
            
            if(minutes <= 30) {
                infix = 'past';
            } else {
                infix = 'to';
                minutes = 60 - minutes;
                hours++;
            }
            
            if(minutes < 2) {
                this.highlight('oclock');
            } else if(minutes < 8) {
                this.highlight('minutes_five');
            } else if(minutes < 13) {
                this.highlight('minutes_ten');
            } else if(minutes < 18) {
                this.highlight('minutes_quarter');
            } else if(minutes < 25) {
                this.highlight('minutes_twenty');
            } else if(minutes < 31) {
                this.highlight('minutes_half');
            }
            
            if(minutes >= 2) {
                this.highlight(infix);
            }
            
            this.highlight('hours_' + this.hours[hours]);
        }
    };
    
    return wordclock.init(element, options)
}

if('undefined' != typeof jQuery) {
    jQuery.fn.wordclock= function(options) {
        return this.each(function() {
            $(this).data('wordclock', new wordclock(this, options));
        });
    }
}