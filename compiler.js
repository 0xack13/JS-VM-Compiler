class CompiledProgram {
    constructor(byte_code_list) {
        this._byte_code = byte_code_list;
    }
    byte_code() {
        return this._byte_code;
    }
}



class Compiler {
    constructor() {
        this._bytecode = [];
    }
    compile(ast) {
        ast.accept(this);
        return new CompiledProgram(this._bytecode);
    }
    visit(astNode) {
        if (astNode.isWhileNode()) {
            this._visitWhile(astNode);
        } else {
            this._visitNonWhile(astNode);
        }
        if (astNode.next() !== null) {
            astNode.next().accept(this);
        }
    }
    _visitWhile(whileNode) {
        var current_op_index = this._bytecode.length;
        this._bytecode.push({
            op: 'ifjump'
        });
        if (whileNode.statements !== null) {
            whileNode.statements.accept(this);
        }
        this._bytecode.push({
            op: 'jump',
            index: current_op_index
        });
        this._bytecode[current_op_index].index = this._bytecode.length;
    }
    _visitNonWhile(astNode) {
        if (astNode.isMoveRightNode()) {
            this._bytecode.push({
                op: '<>',
                value: 1
            });
        } else if (astNode.isMoveLeftNode()) {
            this._bytecode.push({
                op: '<>',
                value: -1
            });
        } else if (astNode.isIncrementNode()) {
            this._bytecode.push({
                op: '+-',
                value: 1
            });
        } else if (astNode.isDecrementNode()) {
            this._bytecode.push({
                op: '+-',
                value: -1
            });
        } else if (astNode.isOutputNode()) {
            this._bytecode.push({
                op: 'PRINT'
            });
        } else if (astNode.isInputNode()) {
            this._bytecode.push({
                op: 'READ'
            });
        } else if (astNode.isWhileNode()) {
            throw {
                name: "RuntimeError",
                message: "While node must be processed via visitor"
            };
        } else {
            throw {
                name: "RuntimeError",
                message: "Should never get here :( unknown node in ast"
            };
        }
    }
}

module.exports = Compiler