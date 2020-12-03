class Memory {
    constructor() {
        this.memory = {};
        this.mem_pointer = 0;
    }
    move(steps) {
        this.mem_pointer += steps;
    }
    update(diff) {
        this.memory[this.mem_pointer] = this.get() + diff;
    }
    get() {
        return this.memory[this.mem_pointer] === undefined ?
            0 : this.memory[this.mem_pointer];
    }
}




class TicksLimit {
    constructor(ticks) {
        this.ticks = ticks;
    }
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


// This vm executes byte code (instance of a program built by the compiler)
// Does not support input operation
// Output goes to internal buffer
class VM {
    constructor(compiled_program, ticks_limit) {
        this.bytecode = compiled_program.byte_code();
        this.memory = new Memory();
        this.pc = 0; // program counter
        this.ticks = ticks_limit === undefined ?
            new TicksLimit(-1) : new TicksLimit(ticks_limit);
        this.output_buffer = "";
    }
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