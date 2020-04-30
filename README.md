# json-policy

[![GitHub package.json version](https://img.shields.io/github/package-json/v/kbaylosis/json-policy)](https://www.npmjs.com/package/json-policy)
[![Build Status](https://travis-ci.org/kbaylosis/json-policy.svg?branch=master)](https://travis-ci.org/kbaylosis/json-policy)

Evaluates expressions/policies that are based on the JSON format. It allows mathematical expressions, conditional operators, and custom operators of your own doing.

## Installing

Install using npm

```
npm i --save json-policy 
```

## Usage

**evaluate(*{expression}*, *{attributes}*, *{custom operator definitions}*)** Substitutes attributes (when specified) to the given expression and returns the result. The result is not bound to a pure boolean value but a truthy or falsey. It could return a string.

**{expression}** has the following format:
```
{
	"<operator>" : [ ...<args> ],
	...
}
```

**{attributes}** is simply a regular json object that is used to substitute variables in the expression

**{custom operator definitions }** is an optional parameter for you to define your own set of operators. It has the following format:
```
{
	"not" : function(arg) {
		return !arg;	
	}
}
```

## Default operators

| Operator  |  Description |     |
|-----------|:------------:|:---:|
| **not(value)** | Logical not. | *NOT value* |
| **and(arg1, arg2)** | Logical and. | *arg1 AND arg2* | 
| **or(arg1, arg2)** | Logical not. | *arg1 OR arg2* | 
| **xor(arg1, arg2)** | Logical exclusive or. | *arg1 XOR arg2* | 
| **or(arg1, arg2)** | Logical not. | *arg1 OR arg2* | 
| **mand(arg1, arg2, ... argN)** | Multiple logical and. | *arg1 AND arg2 AND ... AND argN* | 
| **mor(arg1, arg2, ... argN)** | Multiple logical or. | *arg1 OR arg2 OR ... OR argN* | 
| **neq(arg1, arg2)** | Not equal. | *arg1 <> arg2* | 
| **lt(arg1, arg2)** | Less than. | *arg1 < arg2* | 
| **lte(arg1, arg2)** | Less than or equal to. | *arg1 <= arg2* | 
| **eq(arg1, arg2)** | Equal to. | *arg1 == arg2*| 
| **gte(arg1, arg2)** | Greater than or equal to. | *arg1 >= arg2* | 
| **gt(arg1, arg2)** | Greater than. | *arg1 > arg2* | 
| **any(item, ...args)** | Returns true if *item* matches with any of the values of the rest of the arguments. |
| **plus(arg1, arg2)** | Mathematical addition or concatenate operator depending on the argument datatypes. *arg1 + arg2* | 
| **minus(arg1, arg2)** | Mathematical subtraction. | *arg1 - arg2* | 
| **times(arg1, arg2)** | Mathematical multiplication. | *arg1 x arg2* | 
| **divideby(arg1, arg2)** | Mathematical division. | *arg1 / arg2* | 
| **modulo(arg1, arg2)** | Mathematical modulo. | *arg1 % arg2* | 
| **power(arg1, arg2)** | Mathematical power function. | *arg1 ^ arg2* | 
| **ifelse(condition, true_arg, false_arg)** | If else conditional operator. | *if (**condition**) then **true_arg** else **false_arg*** | 
| **print(string)** | Prints a string to the console and also returns the printed string. | *print("Hello, world!")* | 
| **echo(string)** | Simply returns the inputted. | *string.echo("Hello, world!") // Returns "Hello, world!"* | 


## Examples
```
var JSONPolicy = require("json-policy");

var jsonPolicy = new JSONPolicy();

//
// Evaluate mathematical expressions
//
jsonPolicy.evaluate({ "plus" : [1, 2] });    // Equal to 3

//
// Evaluate boolean expressions
//
jsonPolicy.evaluate({ 
  "and" : [
    {"not" : {"eq" : [5, 1]}},
    {"neq" : [5, 1]},
    {"eq" : [1, 1]}
]});    // Equal to true

//
// Value substitution
//
jsonPolicy.evaluate({"gt" : [25, "$a"]}, { a : 18});    // Equal to true

//
// Property access
//
jsonPolicy.evaluate({"gt" : [25, "$user.age"]}, { user : { age : 18}});   // Equal to true

//
// Sample application for evaluating policies
//
jsonPolicy.evaluate({
  "and" : [ 
    {"eq" : ["$resource.sensitivity", "classified"]},
    {"or" : [
      {"eq" : ["$user.clearance", "topsecret"]},
      {"eq" : ["$user.clearance", "secret"]},
      {"eq" : ["$user.clearance", "classified"]},
    ]}
  ]}, { 
    resource : {
      sensitivity : "classified"
    },
    user : {
      clearance : "topsecret"
  }
});         // Equal to true

```

## Custom operators
```
var operations = {
	"!" : function(arg) {
		return !arg;	
	},
	"&&" : function() {
		var result = true; 
		for (var i = 0; i < arguments.length; i++) {
			result = result && arguments[i];
		}

		return result;	
	},
	"||" : function() {
		var result = false; 
		for (var i = 0; i < arguments.length; i++) {
			result = result || arguments[i];
		}

		return result;	
};

jsonPolicy.evaluate({ 
  "and" : [
    {"!" : {"eq" : [5, 1]}},
    {"&&" : [5, 1]},
    {"||" : [1, 1]}
]}, {}, operators); 

```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/kbaylosis/json-policy/tags). 

## Building and Testing

Make use of grunt.

To build, perform the command below. The output will be in the build directory.
```
grunt build
```

To run the test fixtures:
```
grunt test
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

