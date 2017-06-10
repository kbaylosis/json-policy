# json-policy

Evaluates expressions/policies that are based on the JSON format. It allows mathematical expressions, conditional operators, and custom operators of your own doing.

## Installing

Install using npm

```
npm i --save json-policy 
```

## Usage

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

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

