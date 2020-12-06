**Our project’s goal is to create a transpiler from a Python-like language to React JSX.**\
Last time, we were working on successfully generating an AST. This time, we have essentially finished the lexer, grammar/parser/AST.
```
# The first line will is intentionally a newline 

@let t = t

t = t + 1
t += 1
@let x = 5 % t
@const y = 1

t -= x + x
```
This is an example of the AST generated from the above file:
```
[ValUpdate
  (Update (Var "t", MinusEquals,
    Bexp (Aexp (Plus (VarAccess (Var "x"), VarAccess (Var "x"))))));
 ValUpdate (JConst ("y", Bexp (Aexp (Int 1))));
 ValUpdate (JLet ("x", Bexp (Aexp (Mod (Int 5, VarAccess (Var "t"))))));
 ValUpdate (Update (Var "t", PlusEquals, Bexp (Aexp (Int 1))));
 ValUpdate
  (Update (Var "t", Equals, Bexp (Aexp (Plus (VarAccess (Var "t"), Int 1)))));
 ValUpdate (JLet ("t", Bexp (Aexp (VarAccess (Var "t")))))]
```
We are currently working on translation and transformation. There are Python specific functions/syntax that need to be transformed like `len()` and `str()`. The above can be translated into: 
```
let t = t;
let y = "Hello world";
const x = 7.6;
t += 1;
t = 5 % t + 1;
t = "!" + "Hello world";
```
A more complicated example:
```
# second function: some params
def fun2(arg1, arg2):
    # some commands
    print(arg1)
    print(arg2)
    return
@end

@let add = lambda a, b: a + c
```

```
const fun2 = (arg1, arg2) => {
    console.log(arg1);
    console.log(arg2);
    return;
}

let add = (a, b) => a + c;
```

**What’s next?** For our next steps, we want to finish up translation of control flow (while/for/if) and React and improve the formatting like spacing and newlines. 
