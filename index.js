/**
 * Evaluates json-based policies
 */
var _ = require("lodash");
var propPath = require("property-path");
var operations = require("./operations"); 
var varPrefix = "$"; 

function JSONPolicy(ops, vp) {
	//
	// Provide facility to override or add new operations
	//
	if (!_.isNil(ops)) {
		_.merge(operations, ops);
	}

	if (!_.isNil(vp)) {
		varPrefix = vp;
	}
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

		//
		// Substitute the property variable with the value from the data
		//
		if (_.isString(policy) && policy.trim().startsWith(varPrefix)) {
			policy = policy.replace(varPrefix, "");
			policy = propPath.get(data, policy);
		}

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
	// Act on result sets
	//
	return performOp(operator, results);
}

function performOp(operator, operands) {
	if (!_.has(operations, operator)) {
		if (_.isArray(operands) && 
			 operands.length === 1) {
			return operands[0];
		}

		return operands;
	}

	if (!_.isArray(operands)) {
		operands = [operands];
	}
	
	return operations[operator].apply(this, operands); 
}

JSONPolicy.prototype = _.create(Object.prototype, {

	constructor : JSONPolicy,

	evaluate : function(policy, data) {
		return evaluate(policy, data);
	}
		
});

module.exports = JSONPolicy;
