**Our project’s goal is to create a transpiler from a Python-like language to React JSX.**\
There are a few reasons why pure Python wasn’t chosen:
- Variables in Python do not have any identifiers to indicate this is the first time the variable is being declared unlike in Javascript which uses `let`, `const`, and `var`. The modified language requires `@let` and `@const` before first time variable declarations. While it is possible to have a list tracking variable names, determining whether to use let or const would make translation more complicated. 
- Whitespace and tab indentation determines scope in Python whereas JSX uses curly braces. We could find no other way but to require `@end` to signify the end of an if statement or loop or function declaration.

The first step was determining what syntax to support. It seemed obvious at first but there are tricky instances of common Python functions like range and len. In the end, the lexer supports basic Python syntax like variables, lists, functions, and comments. We choose not to support classes, list notation, ternary operators, lambdas and Python specific syntactic sugar and features. Then, we built the lexer using OCamlLex and defined the AST. Currently, we are able to run the lexer on a valid Python-esque file and generate a series of tokens representing it.
```
# function declaration
def func(a, b):
    if a == b and b != True or a == False:
        return a + b
    @end
    return b - 2
@end

@let i = 0
while (i < len(lst)):
    i += 1
    if i == len(lst) - 2:
        break
    elif i % 2 == 0:
        i = i
    else:
        i = i
    @end
    continue
@end
```

```
# function declaration ##
DEF var(func) ·(·var(a) , var(b) ·)·::  (\n)
IF var(a) (==) var(b) (&&) var(b) (!=) TRUE (||) var(a) (==) FALSE ::  (\n)
RETURN var(a) (+) var(b)  (\n)
END  (\n)
RETURN var(b) (-) int(2)  (\n)
END  (\n)
 (\n)
LET var(i) (=) int(0)  (\n)
WHILE ·(·var(i) < var(len) ·(·var(lst) ·)··)·::  (\n)
var(i) (+=) int(1)  (\n)
IF var(i) (==) var(len) ·(·var(lst) ·)·(-) int(2) ::  (\n)
BREAK  (\n)
ELIF var(i) (MOD) int(2) (==) int(0) ::  (\n)
var(i) (=) var(i)  (\n)
ELSE ::  (\n)
var(i) (=) var(i)  (\n)
END  (\n)
CONTINUE  (\n)
END  (\n)
 (\n)
Fatal error: exception End_of_file
```

**What’s next?** With the lexer completed, the AST can be built and converted into JSX like below:
```
@let s = 0
for i in range(10, 2):
	s = s + i
	@end
```
```
let s = 0;
for(let i = 0; i < 10; i = i + 2){
	s = s + i;
}
```

This requires converting all the nodes in the AST into valid JSX syntax with semicolons, curly braces and whatever else is required. 
