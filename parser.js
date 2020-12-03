var { Token } = require('./tokenizer')

class AstNode {
    constructor(name) {
        this._name = this._validated_name(name);
    }
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

    setNext(next) {
        this._next = next;
    }

    next() {
        return this._next || null;
    }

    isMoveLeftNode() {
        return this._name === 'MoveLeft';
    }

    isMoveRightNode() {
        return this._name === 'MoveRight';
    }

    isIncrementNode() {
        return this._name === 'Increment';
    }

    isDecrementNode() {
        return this._name === 'Decrement';
    }

    isOutputNode() {
        return this._name === 'Output';
    }

    isInputNode() {
        return this._name === 'Input';
    }

    isWhileNode() {
        return this._name === 'While';
    }

    accept(visitor) {
        visitor.visit(this);
    }

}




class ListWalker {
    constructor(tokens_list) {
        this.tokens = tokens_list;
        this.index = 0;
        this.tokens.push(new Token('EOP')); // end of program marker
    }
    next_token() {
        if (this.index < this.tokens.length) {
            var t = this.tokens[this.index];
            this.index++;
            return t;
        } else {
            return null;
        }
    }
    look_ahead_token() {
        if (this.index < this.tokens.length) {
            return this.tokens[this.index];
        } else {
            return null;
        }
    }
}




class Parser {
    constructor() {
        this.parse_program = (walker) => {
            var statements = this.parse_statements(walker);
            return statements;
        };
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