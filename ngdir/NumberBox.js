
define(["ecp.component.numberBox"], function () {
	var directiveName = "nbNumberbox";
	var deps = ["$parse"];
	var directive = function ($parse) {
		return {
			restrict: "A",
			require: "ngModel",
			priority: 1000,
			link: function (scope, elem, attrs, ngModel) {
				if (!ngModel) {
					return;
				}

				ngModel.$validators.number = function (modelValue, viewValue) {
					var value = modelValue || viewValue;
					if (ngModel.$isEmpty(value))
						return true;
					else {

						var valid = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))([eE][+-]?\d+)?\s*$/.test(value);
						return valid;
					}
				}
				ngModel.$parsers.push(function (viewValue) {
					var modelValue = parseFloat(viewValue)
					if (isNaN(modelValue)) return null;
					return modelValue;
				});

				ngModel.$formatters.push(function (modelValue) {
					if (!ngModel.$isEmpty(modelValue)) {
						modelValue = modelValue.toString();
					}
					return modelValue;
				});
				var defaultOpts = { mask: '*###', min: 0 };
				var options = $.extend(defaultOpts, $parse(attrs[directiveName])());
				elem.numberBox(options);

			}
		};
	};

	directive.$inject = deps;
	return {
		name: directiveName,
		func: directive
	};
});