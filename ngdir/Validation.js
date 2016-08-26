/**
* Copyright 2000-2020 YGSoft.Inc All Rights Reserved.
* 
* GRC AngularJS - 自定义验证控件
* 功能：用于自定义验证，比如校验名称唯一性等
* 使用说明：<input type='text' name='xxx' ng-model='name' nb-validation="{method:'xxx',key:'unique',async:'true'}" />
*
* 变更版本：
* hulihua@ygsoft.com 2016-7-12 创建
*
*/
define([], function () {
	var directiveName = "nbValidation";
	var deps = ["$q", "$parse"];
	var directive = function ($q, $parse) {

		return {
			require: 'ngModel',
			restrict: "A",
			priority: 1001,
			link: function (scope, elem, attrs, ngModel) {
				scope.$$loopValidateQueue = "";

				if (attrs[directiveName]) {
					var json = $parse(attrs[directiveName])(scope);
					var method = json.method;
					var key = json.key;
					var deps = json.deps;
					var max = json.max;
					var min = json.min;

					var validDepend = function (deps) {
						if (ngModel.$$parentForm[deps] && ngModel.$$parentForm[deps].$invalid && scope.$$loopValidateQueue.indexOf("\r\n" + deps + "\r\n") == -1) {
							scope.$$loopValidateQueue = scope.$$loopValidateQueue + "\r\n" + deps + "\r\n";
							ngModel.$$parentForm[deps].$$parseAndValidate();
						}
						else
							scope.$$loopValidateQueue = "";

					};

					if (angular.isString(max)) {
						ngModel.$validators.max = function (modelValue, viewValue) {
							var value = modelValue || viewValue;
							var maxCtrl = ngModel.$$parentForm[max];

							if (ngModel.$isEmpty(value) || !maxCtrl || ngModel.$isEmpty(maxCtrl.$viewValue))
								return true;
							var valid = value <= maxCtrl.$viewValue;
							if (valid)
								validDepend(max);
							return valid;
						}
					} else if (angular.isNumber(max)) {
						ngModel.$validators.max = function (modelValue, viewValue) {
							var value = modelValue || viewValue;


							if (ngModel.$isEmpty(value) || ngModel.$isEmpty(max))
								return true;

							var valid = value <= max;
							return valid;
						}
					}
					if (angular.isString(min)) {
						ngModel.$validators.min = function (modelValue, viewValue) {
							var value = modelValue || viewValue;
							var minCtrl = ngModel.$$parentForm[min];
							if (ngModel.$isEmpty(value) || !minCtrl || ngModel.$isEmpty(minCtrl.$viewValue))
								return true;

							var valid = value >= minCtrl.$viewValue;;
							if (valid)
								validDepend(min);
							return valid;
						}
					}
					else if (angular.isNumber(min)) {
						ngModel.$validators.min = function (modelValue, viewValue) {
							var value = modelValue || viewValue;

							if (ngModel.$isEmpty(value) || ngModel.$isEmpty(min))
								return true;

							var valid = value >= min;
							return valid;
						}
					}

					if (method && key && angular.isFunction(scope[method]) && angular.isString(key)) {

						var async = json.async != undefined ? true : false
						if (!async) {
							ngModel.$validators[key] = function (modelValue, viewValue) {
								var fn = scope[method];
								var valid = fn(modelValue || viewValue);
								if (valid)
									validDepend(deps);
								return valid;
							};
						}
						else {
							//新增异步验证器				

							ngModel.$asyncValidators[key] = function (modelValue, viewValue) {
								var promise = scope[method](modelValue || viewValue);

								try {
									if (promise)
										return promise.then(function (valid) {
											if (valid === true) {
												return true;
											}
											else {
												return $q.reject();
											}
										}, function () {
											return $q.reject();
										});
									else
										return $q.reject();
								}
								catch (e) {
									return $q.reject();
								}

							}
						}
					}
				}
			}
		}

	};
	directive.$inject = deps;
	return {
		name: directiveName,
		func: directive
	};
});