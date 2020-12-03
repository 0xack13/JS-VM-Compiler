/**
 * Represents Emulated Memory
 * @class Memory
 */
class Memory {
    constructor() {
        this.memory = {};
        this.mem_pointer = 0;
    }
    /**
     * Moves the memory pointer by the number of steps supplied
     *
     * @param {*} steps
     * @memberof Memory
     */
    move(steps) {
        this.mem_pointer += steps;
    }
    /**
     * Updates the location of the memory pointer
     *
     * @param {*} diff
     * @memberof Memory
     */
    update(diff) {
        this.memory[this.mem_pointer] = this.get() + diff;
    }
    /**
     * Gets the current memory location
     *
     * @return {*} 
     * @memberof Memory
     */
    get() {
        return this.memory[this.mem_pointer] === undefined ?
            0 : this.memory[this.mem_pointer];
    }
}




/**
 * Contains the Tick related methods.
 * @class TicksLimit
 */
class TicksLimit {
    /**
     * Creates an instance of TicksLimit.
     * @param {number} ticks
     * @memberof TicksLimit
     */
    constructor(ticks) {
        this.ticks = ticks;
    }
    /**
     * Checks if more Ticks are available.
     * @return {boolean} 
     * @memberof TicksLimit
     */
    hasMoreTicks() {
        if (this.ticks === -1) {
            return true;
        } else if (this.ticks === 0) {
            return false;
        } else {
            return this.ticks-- > 0;
        }
    }
}


/**
 * This vm executes byte code (instance of a program built by the compiler)
 * Does not support input operation
 * Output goes to internal buffer
 * 
 * @class VM
 */
class VM {
    /**
     * Creates an instance of VM.
     * @param {*} compiled_program
     * @param {*} ticks_limit
     * @memberof VM
     */
    constructor(compiled_program, ticks_limit) {
        this.bytecode = compiled_program.byte_code();
        this.memory = new Memory();
        this.pc = 0; // program counter
        this.ticks = ticks_limit === undefined ?
            new TicksLimit(-1) : new TicksLimit(ticks_limit);
        this.output_buffer = "";
    }
    /**
     * Runs the program.
     *
     * @memberof VM
     */
    run() {
        var op;
        while ((this.pc < this.bytecode.length) && this.ticks.hasMoreTicks()) {
            op = this.bytecode[this.pc++];

            switch (op.op) {
                case '<>':
                    this.memory.move(op.value);
                    break;
                case '+-':
                    this.memory.update(op.value)
                    break;
                case 'PRINT':
                    this.output_buffer += String.fromCharCode(this.memory.get());
                    break;
                case 'READ':
                    throw {
                        name: "RuntimeError", message: "Not supported in this VM"
                    };
                case 'ifjump':
                    if (this.memory.get() === 0) {
                        this.pc = op.index;
                    }
                    break;
                case 'jump':
                    this.pc = op.index
                    break;
                default:
                    throw {
                        name: "RuntimeError", message: "Should never get here :( unkown byte code"
                    };

            }

        }
    }
}

module.exports = VM