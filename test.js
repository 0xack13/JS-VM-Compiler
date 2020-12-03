var { Tokenizer } = require('./tokenizer')
var Parser = require('./parser')
var Compiler = require('./compiler')
var VM = require('./vm')

var input = '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.';

var tokenizer = new Tokenizer();
var parser = new Parser();
var compiler = new Compiler();

var tokens = tokenizer.tokenize(input);
var ast = parser.parse(tokens);
var program = compiler.compile(ast);

var vm = new VM(program);
vm.run();
console.log(vm.output_buffer)