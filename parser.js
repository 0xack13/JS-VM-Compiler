var { Token } = require('./tokenizer')

/**
 * Represents One AST Node
 * @class AstNode
 */
class AstNode {
    /**
     * Creates an instance of AstNode.
     * @param {string} name
     * @memberof AstNode
     */
    constructor(name) {
        this._name = this._validated_name(name);
    }
    /**
     * Checks if the name of the Node is Valid
     * @param {string} name
     * @return {string} 
     * @memberof AstNode
     */
    _validated_name(name) {
        this._valid_names_list = ['MoveLeft', 'MoveRight',
            'Increment', 'Decrement',
            'Output', 'Input',
            'While'
        ];
        if (this._valid_names_list.indexOf(name) === -1) {
            throw {
                name: 'Error',
                message: 'Attempted to create ast node with unsupported name'
            };
        }
        return name;
    }

    /**
     * Sets the next node
     *
     * @param {AstNode} next
     * @memberof AstNode
     */
    setNext(next) {
        this._next = next;
    }

    /**
     * Returns the Next AST Node
     *
     * @return {AstNode} 
     * @memberof AstNode
     */
    next() {
        return this._next || null;
    }

    /**
     * Checks if the next node is Move Left
     *
     * @return {*} 
     * @memberof AstNode
     */
    isMoveLeftNode() {
        return this._name === 'MoveLeft';
    }

    /**
     * Checks if the next node is Move Right
     *
     * @return {*} 
     * @memberof AstNode
     */
    isMoveRightNode() {
        return this._name === 'MoveRight';
    }

    /**
     * Checks if the next node is Increment
     *
     * @return {*} 
     * @memberof AstNode
     */
    isIncrementNode() {
        return this._name === 'Increment';
    }

    /**
     * Checks if the next node is Decrement
     *
     * @return {*} 
     * @memberof AstNode
     */
    isDecrementNode() {
        return this._name === 'Decrement';
    }

    /**
     * Checks if the next node is Output
     *
     * @return {*} 
     * @memberof AstNode
     */
    isOutputNode() {
        return this._name === 'Output';
    }

    /**
     * Checks if the next node is Input Node
     *
     * @return {*} 
     * @memberof AstNode
     */
    isInputNode() {
        return this._name === 'Input';
    }

    /**
     * Checks if the next node is While Node
     *
     * @return {*} 
     * @memberof AstNode
     */
    isWhileNode() {
        return this._name === 'While';
    }

    /**
     * Used by the compiler to Visit the Node
     *
     * @param {*} visitor
     * @memberof AstNode
     */
    accept(visitor) {
        visitor.visit(this);
    }

}




/**
 * Represents a list Walker
 *
 * @class ListWalker
 */
class ListWalker {
    /**
     * Creates an instance of ListWalker.
     * @param {*} tokens_list
     * @memberof ListWalker
     */
    constructor(tokens_list) {
        this.tokens = tokens_list;
        this.index = 0;
        this.tokens.push(new Token('EOP')); // end of program marker
    }
    /**
     * Moves to next token from the list of tokens
     *
     * @return {*} 
     * @memberof ListWalker
     */
    next_token() {
        if (this.index < this.tokens.length) {
            var t = this.tokens[this.index];
            this.index++;
            return t;
        } else {
            return null;
        }
    }
    /**
     * Doesnt move to next token, but used to take a peek at the next token
     *
     * @return {*} 
     * @memberof ListWalker
     */
    look_ahead_token() {
        if (this.index < this.tokens.length) {
            return this.tokens[this.index];
        } else {
            return null;
        }
    }
}




/**
 * Contains method to parse the Tokens and build an AST (Abstract Syntax Tree)
 *
 * @class Parser
 */
class Parser {
    /**
     * Creates an instance of Parser.
     * @memberof Parser
     */
    constructor() {
        /**
         * Parses the Program
         *
         * @param {*} walker
         * @return {*} 
         */
        this.parse_program = (walker) => {
            var statements = this.parse_statements(walker);
            return statements;
        };
        /**
         * Parses a Statement
         *
         * @param {*} walker
         * @return {*} 
         */
        this.parse_statements = (walker) => {
            if (walker.look_ahead_token().value() == ']') {
                return null;
            }
            var statement = this.parse_single_statement(walker);
            if (statement != null) {
                statement.setNext(this.parse_statements(walker));
            }
            return statement;
        };
        /**
         * Parses a single statement
         *
         * @param {*} walker
         * @return {*} 
         */
        this.parse_single_statement = (walker) => {
            var token = walker.next_token();
            if (token === null) {
                throw {
                    name: 'ParsingError',
                    message: 'Unexpected end of program'
                };
            }
            switch (token.value()) {
                case 'EOP':
                    return null;
                case '>':
                    return new AstNode('MoveRight');
                case '<':
                    return new AstNode('MoveLeft');
                case '+':
                    return new AstNode('Increment');
                case '-':
                    return new AstNode('Decrement');
                case '.':
                    return new AstNode('Output');
                case ',':
                    return new AstNode('Input');
                case '[':
                    return this.parse_while(walker);
                case ']':
                    throw {
                        name: 'ParsingError', message: 'Unexpected ]'
                    };
                default:
                    throw {
                        name: 'ParsingError', message: 'Unknown token in input'
                    };
            }
        };
        /**
         * Parses a While Statement
         *
         * @param {*} walker
         * @return {*} 
         */
        this.parse_while = (walker) => {
            var while_stmt = new AstNode('While');
            while_stmt.statements = this.parse_statements(walker);
            var token = walker.next_token();
            if (!token || (token.value() !== ']')) {
                throw {
                    name: 'ParsingError',
                    message: 'Expected ] not found'
                };
            }
            return while_stmt;
        };
    }

    /**
     * Takes a List of Tokens, and returns the AST
     *
     * @param {*} tokens_list
     * @return {*} 
     * @memberof Parser
     */
    parse(tokens_list) {
        var walker = new ListWalker(tokens_list);
        var ast = this.parse_program(walker);
        if (walker.next_token() !== null) {
            throw {
                name: 'ParsingError',
                message: 'Missing ['
            };
        };
        return ast;
    }
}

module.exports = Parser