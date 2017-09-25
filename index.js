/**
 * Evaluates json-based policies
 */
var _ = require("lodash");
var propPath = require("property-path");
var varPrefix = "$"; 

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
	// Arithmetic
	//
	"plus" : function(x, y) {
		return x + y;
	},
	"minus" : function(x, y) {
		return x - y;
	},
	"times" : function(x, y) {
		return x * y;
	},
	"divideby" : function(x, y) {
		return x / y;
	},
	"modulo" : function(x, y) {
		return x % y;
	},
	"power" : function(x, y) {
		return Math.pow(x, y);
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
		return str;
	},
	"echo" : function(str) {
		return str;
	} 
};

function JSONPolicy(ops, vp) {
	//
	// Provide facility to override or add new operations
	//
	if (!_.isNil(ops)) {
		_.merge(operations, ops(_.clone(operations)));
	}

	if (!_.isNil(vp)) {
		varPrefix = vp;
	}
}

function performOp(operator, operands) {
	if (!_.has(operations, operator)) {
		if (_.isArray(operands) && 
			 operands.length === 1) {
			operands = operands[0];
		}

		if (_.isUndefined(operands)) {
			operands = null;
		}

		return operands;
	}

	if (!_.isArray(operands)) {
		operands = [operands];
	}
	
	return operations[operator].apply(this, operands); 
}

//
// Substitute the property variable with the value from the data
//
function subVar(exp, data) {
	if (_.isString(exp)) {
		var exp = exp.trim();
		if (exp.startsWith(varPrefix)) {
			exp = exp.replace(varPrefix, "")
			var matches = exp.match(/\[(.*?)\]/g);
			if (matches && matches.length > 0) {
				var index = matches[matches.length -1].replace("[", "").replace("]", "");
				exp = exp.replace("[" + index + "]", "");
				var value = null;
				if (exp.length > 0) {
					value = propPath.get(data, exp);
					return value[index];
				}

				return data[index];
			}

			return propPath
				.get(data, exp);
		}
	}

	return exp;
}

function evaluate(policy, data, operator) {
	
	//
	// Act on base data types
	//
	if (_.isBoolean(policy) || 
		 _.isDate(policy) || 
		 _.isNumber(policy) || 
		 _.isString(policy) || 
		 _.isNil(policy)) {

		policy = subVar(policy, data); 			
		return performOp(operator, policy);
	}

	//
	// Evaluate each property in the object or array
	//
	var k = Object.keys(policy);
	var results = [];
	var policyIsArray = _.isArray(policy);
	for (var i = 0; i < k.length; i++) {
		results.push(evaluate(policy[k[i]], data, policyIsArray ? null : k[i]));
	};

	//
	// Act on the result set
	//
	return performOp(operator, results);
}

JSONPolicy.prototype = _.create(Object.prototype, {

	constructor : JSONPolicy,

	evaluate : evaluate
		
});

module.exports = JSONPolicy;
