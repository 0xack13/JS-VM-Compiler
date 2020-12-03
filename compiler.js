/**
 * Represents the Compiled program as an array of byte code.
 *
 * @class CompiledProgram
 */
class CompiledProgram {
    /**
     * Creates an instance of CompiledProgram.
     * @param {*} byte_code_list
     * @memberof CompiledProgram
     */
    constructor(byte_code_list) {
        this._byte_code = byte_code_list;
    }
    /**
     * Returns the byte Code
     *
     * @return {*} 
     * @memberof CompiledProgram
     */
    byte_code() {
        return this._byte_code;
    }
}



/**
 * Contains the method for compiling the program from the AST to ByteCode.
 *
 * @class Compiler
 */
class Compiler {
    /**
     * Creates an instance of Compiler.
     * @memberof Compiler
     */
    constructor() {
        this._bytecode = [];
    }
    /**
     * Self explanatory
     *
     * @param {*} ast
     * @return {*} 
     * @memberof Compiler
     */
    compile(ast) {
        ast.accept(this);
        return new CompiledProgram(this._bytecode);
    }
    /**
     * Take a peek at the AST Node
     *
     * @param {*} astNode
     * @memberof Compiler
     */
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
    /**
     * Handles the While conditions from the AST
     *
     * @param {*} whileNode
     * @memberof Compiler
     */
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
    /**
     * Handles every other condition excluding While
     *
     * @param {*} astNode
     * @memberof Compiler
     */
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