
# pythonxyc
a simple transpiler for PythonXY, a Python-like syntax that compiles down into JSX.

PythonXY is Python extended with JSX to allow building React apps.

While a Python-to-JavaScript compiler is always fun and all, pythonxyc is best enjoyed fresh when used in the npm module `react-python`, which can be found at https://www.npmjs.com/package/react-python.

# Table of Contents
- [Build and Usage](#build-and-usage)
    + [Paths](#paths)
- [How It Works](#how-it-works)
  * [Overview](#overview)
  * [Lexing Overview](#lexing-overview)
  * [PythonXY and Parsing Overview](#pythonxy-and-parsing-overview)
    + [Indentation and Program Structure](#indentation-and-program-structure)
    + [Variable Declarations](#variable-declarations)
- [Supported Language Features](#supported-language-features)
  * [The Basics](#the-basics)
  * [Operators](#operators)
    + [Order of precedence (from least to most)](#order-of-precedence--from-least-to-most-)
  * [Commands](#commands)
  * [Expressions](#expressions)
  * [React and JSX as Expressions](#react-and-jsx-as-expressions)
  * [What is NOT Supported](#what-is-not-supported)
- [Translation Overview](#translation-overview)
  * [Transformation](#transformation)
    + [Command Transformations](#command-transformations)
    + [Expression Transformations](#expression-transformations)
  * [Translation](#translation)
  * [Coming Soon!](#coming-soon-)
  * [Errors in Implementation](#errors-in-implementation)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>



# Build and Usage
Development and building requires OCaml version 4.09.0 installed according to https://www.cs.cornell.edu/courses/cs3110/2020sp/install.html.

Build an executable binary native to your OS:
`make run`

Run the build executable binary:
`./main.byte <inputFile> <outputFile>`

### Paths
Paths are relative to the current working directory of the executable. Testing shortcuts have been removed, so it is necessary to explicitly use paths relative to the executable, for example:
`tests/parser/parse00.pyx`

# How It Works
## Overview

The lexer is defined in `lexer.mll`, which scans for patterns in the source code and matches them with the tokens defined in `grammar.mly`.

The syntax of the language and how it is parsed is defined in `grammar.mly`, which generates a `grammar.mli` interface file and `grammar.ml` parser, which in turn will generate corresponding object files. The parser associates combinations of tokens and rules (combinations of patterns) with data types specified in `ast.ml` as specified in the production rules in `grammar.mly`.

`transform.ml` takes in parsed expressions or commands (in for form of one of the many variant types as defined in `ast.ml`), carries out some transformations on them, and then writes their output to a buffer.

The `main.ml` file is the main driver of the transpiler and combines all of these together. It scans input with the lexer and passes tokens to the parser, which passes AST constructs to the transformer, which returns a buffer that `main.ml` can write to a file specified in the command-line arguments.

## Lexing Overview
To expand upon what was said above, the lexer associates specific regular expressions with tokens defined in `grammar.mly`. The lexer takes a longest-match approach in the sense that if two regular expressions (starting from the same position in the lexing buffer) match, the longer expression is accepted. The lexer accepts most, if not all, of the various types of language constructs in Python, including symbol tokens, operators, Python primitives and keywords. In addition, For a detailed list of all symbols, please visit the rules in `lexer.mll`.

Comments are simply consumed and do not present any tokens to the parser.

Strings proved difficult to handle if they contained escape sequences. Therefore, our stopgap solution was to simply enumerate a few dozen characters that a string could contain (all alphanumeric characters and simple symbols, with the exception of the backslash). Therefore, strings are theoretically much more limited in our language than in the real Python language, but this would not matter in most real-life use cases. Currently, the only way to delineate strings is with double quotes.

Finally, we borrowed a couple functions of line-counting code and lexing error handling from the provided source code provided in assignment A3 in Cornell CS 4110, which contained a lexer, parser, and ast for the Imp language.


## PythonXY and Parsing Overview
PythonXY is very similar to Python. It is composed of sequences of commands padded with an arbitrary number of newlines in between. Sequences of commands are recursively defined as follows:
* a command
* a sequence of command, followed by at least 1 newline, followed by a command

Commands are your typical imperative language commands, such as if statements, while statements, for statements, assignments, function definitions, function calls, continue commands, and return statements. As such, commands usually also contain expressions. Expressions are primitives (ints, floats, booleans), strings, dictionaries, lists, and functions.

Our recursive definitions of expressions in `grammar.mly` preserve operator precedence - instead of relying on `ocamlyacc`'s built-in operator precedence declarations, we define expressions in terms of `bexp` boolean expressions, which contain comparisons involving `aexp` expressions or are `aexp` expressions themselves, which are either binary expressions of `aexp` expressions or some other primitives such as:
* ints and floats
* strings
* function call expressions
* parenthetical expressions containing other expressions
* dicts and lists

Obviously, this is a type-unsafe definition, as this would allow one to do `[1, 2, 3] + {"key": 0}` (obviously illegal) or `"string" + 12`, which is invalid in Python (but valid in JavaScript oddly enough). However, neither language is typed and we have not added static type checking features to this language, so we leave the responsibility of writing type-safe programs to the programmer ;)

In our parser, we have plenty of variant types for optional newlines. We understand that the ability to have optional tokens automatically makes Menhir vastly superior to ocamlyacc, but we were in too deep and just had to stick with it :')

### Indentation and Program Structure
As you may have inferred, one important difference between Python and PythonXY is how indentation and scope is handled. In Python, scope is enforced by indentation. While this makes regular Python code look clean overall, we believe that enforcing indentation while having to make a decision on whether to enforce this for JSX as well was the wrong approach. Instead, we opted to use the more common approach of using specifc tokens to delineate the "opening" and "closing" of a scope. In our case, tokens that "open" a scope would be declarations for if, while, for, and functions, while the token that "closes" a scope is `@end`. We chose this token to visually match with Python directives.

### Variable Declarations
Python variables and JavaScript variables are handled differently. Python variables are simply declared by name, while nowadays JavaScript developers can use the `let` and `const` keywords in their variable declarations. This poses a problem for us - without an extra layer of static analysis, we would not be able to differentiate variable updates from variable declarations, and then there was the question of deciding whether a variable would be mutable or constant. Instead, we opted to use the keywords `@let` and `@const` to declare mutable and constant variables respectively, in the style of Python decorators.

# Supported Language Features
## The Basics
Comments, commands, and expressions make up a PythonXY program.

## Operators
### Order of precedence (from least to most)
* binary operators: `=`, `+=`, `*=`, `-=`, `/=`, `%=`
* `or`
* `and`
* `not`
* equality check: `==`, `!=`
* numeric comparison: `>=`, `>`, `<`, `<=`
* `%`
* `+`
* `*`, `/`
* `**`
* parentheses


## Commands

**Assignment and Updates**

Variables can be declared and updated as follows:

    # declaring
    @let var1 = 1
    @const var2 = "a"
    # updating
    var1 = str(var) + var2
    # suppose such a variable exists
    items[0].get().head += 10

**while loops**

    while [exp]:
        [exp list]
    @end
where any expression in the body could be a `break` or `return`

**for loops**

    for [var] in [exp]:
        [exp list]
    @end
where any expression in the body could be a `break` or `return`

See the **List of Transformations** section on the various types of accepted for loops.

**if statements**

Simple if statements:

    if [exp]:
	    [exp] list
	@end

If statements with else-ifs:

    if [exp]:
	    [exp list]
	elif [exp2]:
		[exp list]
	elif [exp3]:
		[exp list]
	...
	@end

If statements with else:


    if [exp]:
	    [exp] list
	(...optional elifs...)
	else:
		[exp] list
	@end

**function call commands**

These are defined as a `variable expression` followed by an open parenthesis, an arbitrarily long list of expressions (arguments), and a closing paranthesis. Thus, function calls used as commands are synatically identical to functions used as expressions, except that... the function calls are used where only a command is expected. Please see **variable expressions**.


**function definitions**

simple function:

    def fun():
	    [exp list]
	@end
where any expression inside may be a `return` or `return [exp]` command.

functions with n parameters:

    def fun(param1, param2, ...):
	    [exp list]
	@end

**return statements**

simple return statement:

    return

returning an expression:

    return [exp]

NOTE: Due to the nature of our parser (which discriminates commands with newlines), the first part of the returned expression MUST start on the same line as the return statement (although the returned expression may itself be multiline). For example:

    
	    return <Cust1 className={"class-" + variant}>
	            <Cust2 a="a" b="b">
	                <Cust3  a={variable} onCancel={callback()}>
	                </Cust3>
	            </Cust2>
	            <Cust4  a={"a"} b={"b"}>
	            </Cust4>
	        </Cust1>

**break statements**

    break

**import statements**

To take advantage of npm's immense catalogue of third-party modules, (and since the target language is JavaScript/JSX), we opted to use import syntax that is similar to JavaScript's:


**default imports**

import as `var` from `string` 


    # default imports
    import as React from "react"
    
	# importing from a relative path
	import as MainView from "./components/MainView"


**named imports**

import as `var list` from `string` 

    # importing from an npm module
	import useState, useEffect from "react"
	
	# importing from a relative path
	import useUser, useProvider from "./hooks"

The reasoning for such import syntax is to reach a compromise between the syntax of Python and JavaScript while capturing the semantic meaning (unfortunately, this syntax is identical to neither language imports): in JavaScript default imports, the imported module is automatically aliased to the `var` in the import statement! Hence `import as var` to explicitly capture the semantics of the default import statement.

**exports**

For similar reasons, we support exports in a manner inspired by both JavaScript and Python.

**default exports (ES6)**

export default `exp`

**named exports (ES6)**

export `var1`, `var2`, ...

**exports (CommonJS)**

Exports in the style of CommonJS can arise naturally from `variable updates` and `dicts` in PythonXY.

This is an example of a valid export statement:

`modules.exports = varName`

or even:

    module.exports = {
	    "funcName1": funcName1,
	    "funcName2": funcName2
    }

## Expressions
**`bexp` expressions**

the `bexp` type captures the majority of the value types in PythonXY. It also the deepest value type because it is inductively defined. As mentioned above (and as you may observe), order of operations is explicitly defined by combinations of terms in the language, rather than by operator precedence. The base data types are value primitives, parenthetical expressions, and variable expressions (including function calls). This is because such values are atomic. Note that, just like any other language, order of operations can be forced by wrapping the target expression in parentheses.

There are some quirks. Note that `strings` are treated as `aexp`s! This is because an expression like below is possible in Python:

`let msg = "Messier " + str(31)`

where it would cumbersome to redefine operands types for the "+" operator for strings. But this results in the acceptance of combinations such as:

`"Messier " + [1, 2, 3, 4] + {"messier ": True}`
which will not run when transpiled to JavaScript, and

`"Messier " + 123`

which is technically not supposed to be supported... but works in JavaScript.

Other items to note: unlike most other languages, PythonXY does NOT support negatives or negation. This is simply due to human error and we promise to fix this ASAP. On the other hand, you may use expressions such as `(0 - [aexp])`.

Here is the full definition of `bexp` expressions from `grammar.mly`:

    bexp:
    | or_exp                                                { $1 }
	;

	or_exp:
    | or_exp OR and_exp                                     { Or($1, $3) }
    | and_exp                                               { $1 }
	;

	and_exp:
    | and_exp AND not_exp                                   { And($1, $3) }
    | not_exp                                               { $1 }
	;

	not_exp:
    | NOT comparison                                        { Not($2) }
    | comparison                                            { $1 }
	;

	comparison:
    | bexp_primitive DOUBLE_EQUALS bexp_primitive           { EQ($1, $3) }
    | bexp_primitive NOT_EQUALS bexp_primitive              { NE($1, $3) }
    | bexp_primitive                                        { $1 }
	;


	bexp_primitive:
    | BOOL                                                  { Bool(snd $1) }
    | aexp GE aexp                                          { GE($1, $3) }
    | aexp GT aexp                                          { GT($1, $3) }
    | aexp LE aexp                                          { LE($1, $3) }
    | aexp LT aexp                                          { LT($1, $3) }
    | aexp                                                  { Aexp($1) }
	;

	aexp:
    | modulo_exp                                            { $1 }
	;

	modulo_exp:
    | modulo_exp MODULO add_exp                             { Mod($1, $3) }
    | add_exp                                               { $1 }
	;

	add_exp:
    | add_exp PLUS times_exp                                { Plus($1, $3) }
    | add_exp MINUS times_exp                               { Minus($1, $3) }
    | times_exp                                             { $1 }
	;

	times_exp:
    | times_exp TIMES exponen_exp                           { Times($1, $3) }
    | times_exp DIVIDE exponen_exp                          { Div($1, $3) }
    | exponen_exp                                           { $1 }
	;

	exponen_exp:
    | exponen_exp EXP aexp_primitive                        { Expon($1, $3) }
    | aexp_primitive                                        { $1 }
	;

	aexp_primitive:
    | INT                                                   { Int(snd $1) }
    | FLOAT                                                 { Float(snd $1) }
    | STRING                                                { String(snd $1) }
    | var_access                                            { VarAccess($1) }
    | LPAREN exp RPAREN                                     { Paren($2) }
	;

**variable expressions**

Variable expressions are inductively defined as follows:
* variables
* variable expressions followed by a "." followed by a variable
* variable expressions followed by a "[" followed by an `exp` followed by a "]"
* variable expressions followed by a "(" followed by an arbitrary list of expressions (arguments) followed by a ")" - this is a function call

A demonstration of variable expressions:

    # a regular variable
    @let t = obj
    # a dot property
    @let v = obj.velocity
    # an index into an array or dict
    @let vx = obj.velocity[0]
    # a dot into an index
    @let dx = obj.velocity[0].accumulate(5)
	'''... and so on!'''


   
**dicts**

Newlines are optional here.

    {
	    [exp1]: [exp2],
	    [exp3]: [exp4],
	    ...
    }

**lists**

Again, newlines between entries are optional.

    [1, 2, True, False, "string", variable]

**lambda functions**

    lambda x -> x * x

**ints and floats**

NOTE: similar to as mentioned for negative `aexp` values, negative integers and floats are not supported. Instead, use please `0 - x.xxx...` instead.

**strings**

Any sequence of characters recognized by this regular expression:

    let _string_ = "\""_anything_*"\""
where

    let _anything_ = ['a'-'z' 'A' - 'Z' '0' - '9' '!' '@' '#' '$' '%' '^' '&' '*'
	'(' ')' '[' ']' '-' '_' '=' '+' '{' '}' '|' '\\' ';' ''' ':'
	 ',' '.' '/' '<' '>' '?' '`' '~' ' ' '\t' '\n']
As you can see, despite the name, our string definition is quite limited because we don't support escape sequences, or many other valid Unicode characters for that matter. Please see **String Completeness**.

**function calls**

Same syntax as with function calls as commands above, except that the function call is used as an expression.

basic function call expression:

    @let t = var.potoot.tamoot[0]()

function call expression with arguments:

    # with arguments
    @let t = var.potoot.tamoot[0](banoonoo, spinooch...)
    

## React and JSX as Expressions
Just like in JavaScript JSX, JSX are valid expression types in PythonXY! (We get that the names are confusing. We are confused as to what to call the JSX-looking syntax extensions. Do you have any suggestions?)

**JSX Expression**

Similar to an HTML element, the following makes up a JSX expression:
* an `opening tag`
* a series of child components (separated by an arbitrary number of newlines) padded by an arbitrary number of newlines
* a closing tag

**opening tag**

* "<" followed by a series of `react attributes` of arbitrary length (separated by spaces) followed by ">"

**attributes**

Just like in JSX, a valid attribute can be in one of two forms:

attrib=`string`

attrib={`exp`}

where `exp` is any valid PythonXY expression

**Returning JSX**

Here is an example of JSX being returned by a function (written in the style of React functional components):

    # component with attributes with children that also attributes
	def Nested(props):
	    return <Cust1 className={"class-" + variant}>
	            <Cust2 a="a" b="b">
	                <Cust3  a={variable} onCancel={callback()}>
	                </Cust3>
	            </Cust2>
	            <Cust4  a={"a"} b={"b"}>
	            </Cust4>
	        </Cust1>
	@end




## What is NOT Supported
**String Completeness**

We don't support the set of all possible strings out there, only a tiny (but still a large) subset of strings. This is a result of how we detect strings in the source code. Hopefully, we can replace our string detector with a more complete implementation soon.

**Classes**

Classes are not supported yet, but are coming soon! Hopefully, this should not be a huge problem. We are huge believers in React functional syntax after all ;)

**Tuples**

We opted not to support tuples at the moment simply because the closest equivalent in JavaScript is arrays... which are translated from lists in Python. However, in any instance where a tuple would be used, you may use a list instead.

**Negatives**

We get it, this is super wacky. We just couldn't get this one figured out in time for our homework assignment due date. We promise that this will be rectified soon. For now, as mentioned above, please use `0 - [aexp]`.


# Translation Overview

There are two steps in translation: AST transformation and the translation itself. AST transformation wrangles the AST on some cases. Translation writes the AST to a buffer, which can the be written to a file as the compiled output.

## Transformation
Transformation is necessary to convert certain commands and expressions into a JavaScript-friendly format. Here are some examples:
* `print([exp])` should transform into `console.log([exp])`
* `for i in range(4): ...@end` should transform to `for (let i = 0; i < 4; i++) {...}`


### Command Transformations
Most commands are transformed simply at the top-level that they are detected. This is because few commands recursively need this level of transformation. The exception is `for` loops, which can can occur anywhere in any body of a program (`while` loops don't need to be transformed).

**for loops**

The following types for for loops are supported:
* `for i in range(end):`
* `for i in range(start, end):`
* `for i in range(start, end, skip):`
* `for i in dict.keys():`***
* `for i in dict_or_array:`

Reminder that in the last example above, PythonXY handles iterating through a dictionary as looping through its values to bring its behavior closer to JavaScript. This is different than in Python, which loops through the values of the map.

***NOTE: for above, `dict.keys()` is a misnomer and will be corrected to `dict.entries()` in the next update. See **Errors in Implementation**.

These are translated as follows, respectively:
* `for (let i = 0; i < end; i++)`
* `for (let i = start; i < end; i++)`
* `for (let i = start; i < end; i += skip)`
* `for (i in dict)`
* `for (i in dict_or_array)`

### Expression Transformations
Expression are recursively transformed at every level of translation. This is because expressions can be recursive.

**Q: How do I use functional features like map, filter, and reduce?**

It's a bit of a mess in Python, which offers them in several different formats:
* `map([lambda], [exp: list]`
*  `filter([lambda], [exp: list])`
* `functools.reduce([lambda], [exp: list]`

However, in JavaScript, each of these functions can be obtained simply by calling `.map()`, `.filter()`, and `.reduce()`.  As such, we are currently electing to have the programmer call these methods on a list, unPythonic it may be:

    # map
    arr.map(lambda x -> ....)
    
    # filter
    arr.filter(lambda x -> ....)
    
    # reduce
    arr.reduce(lambda a, b -> ..., init)

**len**

`[[len(exp)]]` -> `[[exp]].length`

**array slicing**

`[[exp[a:b]]]` -> `[[exp]].slice(a, b)`'

Note that this transformation is recursive.

**str**

`[[str(exp)]]` -> `String([[exp]])`

## Translation
The general setup of the translation is as follows:

For every command and expression type in the AST, there exist a function that writes that type to a buffer (aptly named `buf` in our code). This buffer is the one that is used to  write to an output file. At the top-level, there is a translation function that translates a program (a sequence of commands), which passes each individual command to the function that translates commands (`translate_c`), which pattern-matches on the type of command and further passes the pieces of the AST to other translation functions.

Especially for recursive structures types, when the structure is passed to the translation function, the structure is intercepted, then transformed according to our transformation rules as described in **Transformation**, then passed along to be translated.

Simultaneously, the translation keeps track of the indent buffer, named `indbuf`, which increases the indent when in a new block. In this way, if statements, for loops, while statements, function definitions, and nested React components are beautifully indented after transpiled.

## Coming Soon!
This is a peek at what is coming soon!

* classes with constructors and methods
* LSP and syntax highlighting implementation for PythonXY files

## Errors in Implementation
The following are errors in implementation (fortunately, these are easily corrected):
* for loops accepting only `dict.keys()` is a misnomer; should be `dict.entries()`
* string incompleteness