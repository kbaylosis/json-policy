/**
 * Built-in operations
 */

var operations = {
	//
	// Boolean
	//
	"not" : function(arg) {
		return !arg;	
	},
	"and" : function() {
		var result = true; 
		for (var i = 0; i < arguments.length; i++) {
			result = result && arguments[i];
		}

		return result;	
	},
	"or" : function() {
		var result = false; 
		for (var i = 0; i < arguments.length; i++) {
			result = result || arguments[i];
		}

		return result;	
	},
	"xor" : function(arg1, arg2) {
		return foo ? !bar : bar;
	},
	// Multiple AND 
	"mand" : function() {
		if (!arguments || arguments.length <= 2) {
			return false;
		}

		var result = false; 
		var arg1 = arguments[0];
		var op = arguments[1];
		for (var i = 2; i < arguments.length; i++) {
			result = result && operations[op].apply({}, [arg1, arguments[i]]);
		}

		return result;	
	},
	// Multiple OR
	"mor" : function() {
		if (!arguments || arguments.length <= 2) {
			return false;
		}

		var result = false; 
		var arg1 = arguments[0];
		var op = arguments[1];
		for (var i = 2; i < arguments.length; i++) {
			result = result || operations[op].apply({}, [arg1, arguments[i]]);
		}

		return result;	
	},

	//
	// Comparison 
	//
	"neq" : function(arg1, arg2) {
		return arg1 !== arg2;
	},
	"lt" : function(arg1, arg2) {
		return arg1 < arg2;
	},
	"lte" : function(arg1, arg2) {
		return arg1 <= arg2;
	},
	"eq" : function(arg1, arg2) {
		return arg1 === arg2;
	},
	"gte" : function(arg1, arg2) {
		return arg1 >= arg2;
	},
	"gt" : function(arg1, arg2) {
		return arg1 > arg2;
	},
	"any" : function() {
		if (!arguments || arguments.length <= 1) {
			return false;
		}

		var result = false; 
		var arg1 = arguments[0];
		for (var i = 1; i < arguments.length; i++) {
			result = result || operations.eq(arg1, arguments[i]);
		}

		return result;	
	},

	//
	// Conditional
	//
	"ifelse" : function(cond, arg1, arg2) {
		if (cond) {
			return arg1;
		}	

		return arg2;
	},
	
	//
	// Misc
	//
	"print" : function(str) {
		console.log(str);
		return true;
	}
};

module.exports = operations;
