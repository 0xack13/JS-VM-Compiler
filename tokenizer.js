/**
 * {Represents a Single Token}
 * @class Token
 */
class Token {
    /**
     * Creates an instance of Token.
     * @param {string} value
     * @param {number} line
     * @param {number} position
     * @memberof Token
     */
    constructor(value, line, position) {
        this._value = value;
        this._line = line || -1;
        this._position = position || -1;
    };

    /**
     * Returns the token's value
     * @return {string} 
     * @memberof Token
     */
    value() {
        return this._value;
    };

    /**
     * Returns the token's line number
     * @return {number} 
     * @memberof Token
     */
    line() {
        return this._line;
    };

    /**
     * Returns the token's position
     * @return {number} 
     * @memberof Token
     */
    position() {
        return this._position
    };

    /**
     * Checks if a token is equal to current token.
     * @param {Token} tok
     * @return {*} 
     * @memberof Token
     */
    equals(tok) {
        return (tok instanceof Token) && (tok.value() == this.value())
    }
}


/**
 * Contains method to tokenize the program
 * @class Tokenizer
 */
class Tokenizer {
    /**
     * Creates an instance of Tokenizer.
     * @memberof Tokenizer
     */
    constructor() {
        this._valid_ones = />|<|\+|\-|\.|,|\[|\]/;
        this._white_space = /.|\r|\n/; // Everything other than valid tokens is a whitespace.
    }

    /**
     * Tokenizes the program. Returns an array of Tokens
     * @param {string} source
     * @return {Token[]} 
     * @memberof Tokenizer
     */
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