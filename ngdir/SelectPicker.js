/**
* Copyright 2000-2020 YGSoft.Inc All Rights Reserved.
* 
* GRC AngularJS - 下拉选择控件
* 功能：下拉选择控件封装
* 使用说明：
* 	<select nb-selectpicker ng-model="language" multiple>
*		<option>AngularJS</option>
*		<option>ReactJS</option>
*		<option>JQuery</option>
*	</select>
* RequireJS对外发布名称：mas.selectpicker
*
* 变更版本：
* lixiangyang@ygsoft.com 2016-6-21 创建
* lixiangyang@ygsoft.com 2016-6-25 修改
*
*/
define(["bootstrap-select"], function () {
	var directiveName = "nbSelectpicker";
	var deps = ["$parse"];
	var directive = function ($parse) {
		return {
			restrict: "A",
			require: "ngModel",
			link: function (scope, elem, attrs, ngModel) {
				if (!ngModel) {
					return;
				}

				function refresh() {
					elem.selectpicker('refresh');
				};

				var defaultOpts = { noneSelectedText: "请选择..." };
				var options = $.extend(defaultOpts, $parse(attrs[directiveName])());
				elem.selectpicker(options);

				refresh();

				scope.$watch(function () {
					return elem.val();
				}, refresh, true);
			}
		};
	};

	directive.$inject = deps;
    return {
        name: directiveName,
        func: directive
    };
});