class Token {
    constructor(value, line, position) {
        this._value = value;
        this._line = line || -1;
        this._position = position || -1;
    };

    value() {
        return this._value;
    };

    line() {
        return this._line;
    };

    position() {
        return this._position
    };

    equals(tok) {
        return (tok instanceof Token) && (tok.value() == this.value())
    }
}


class Tokenizer {
    constructor() {
        this._valid_ones = />|<|\+|\-|\.|,|\[|\]/;
        this._white_space = /.|\r|\n/; // Everything is a whitespace, other than valid ones
    }

    tokenize(source) {
        var line_count = 1;
        var pos_count = 1;
        var token_list = [];
        var symbol;
        for (var i = 0; i < source.length; i++) {
            symbol = source[i];
            if (symbol.match(this._valid_ones)) {
                token_list.push(new Token(symbol, line_count, pos_count));
            } else if (!symbol.match(this._white_space)) {
                throw {
                    name: 'SyntaxError',
                    message: 'Unexpected symbol in input'
                };
            }
            if (symbol === "\n") {
                line_count++;
                pos_count = 1;
            } else {
                pos_count++;
            }
        }
        return token_list;
    }
}

module.exports = {
    Tokenizer,
    Token
}