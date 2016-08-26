/**
* Copyright 2000-2020 YGSoft.Inc All Rights Reserved.
* 
* GRC 稽核项目组 上传指令
* 属性说明：
* templateUrl:模版下载的url地址
*
* chenlisi@ygsoft.com 2016-8-10 创建
*
*/
define(["ecp.service","/grm/mas.common/scripts/services/utils/upload.js"], function (ecpService) {
	return {
		name: "nbImport",
		func: function (rs) {
			var obj = {
				restrict: "AE",
				require: "ngModel",
				scope: { singleMode: "@"},
				replace: true,
				templateUrl: "/grm/mas.common/scripts/directives/views/Import.html",
				link: function (scope, elem, attrs, ngModel) {
					scope.templateUrl = attrs.templateUrl;
					scope.modalId = Math.uuid();
					scope.fileId = Math.uuid();
					
					//显示窗口
					scope.showDialog = function(){
						elem.find("input[type='file']").val('');
					}
					
					scope.uploadFile = function () {
//						elem.find("input[type='file']").val();
						if (!elem.find("input[type='file']").val() || elem.find("input[type='file']").val().length == 0) {
							ecpService.MessageBox.show("请选择一个文件。");
							return;
						}
						
						var fileSize = elem.find("input[type='file']")[0].files[0].size;
						var fileName = elem.find("input[type='file']")[0].files[0].name;
						var fileType = fileName.substr(fileName.lastIndexOf('.')+1);
						if (fileType.indexOf('xlsx') == -1 || fileType.indexOf('xls') == -1) {
							ecpService.MessageBox.show("请上传xls、xlsx类型的文件。");
							return;
						}
						var ywKey = Math.uuid();
						var resId = Math.uuid(); 
						$.ajaxFileUpload({
								url : '/grm/ecp/FileAccessServlet',
								secureuri : false,
								fileElementId : scope.fileId,
								businessParams : {
									"beanId" : "com.ygsoft.ecp.app.operator.system.service.context.IUnstructureTransferContext",
									"method" : "saveFile",
									"operParams" : {
										"p1" : {
											"title" : fileName,
											"bsize" : fileSize,
											"resId" : resId,
											"ywkey" : ywKey,
											"remark" : "",
											"modelState" : 4,
											"attachmentDetailVO" : {}
										}
									}
								},
								dataType : 'text',
								success : function(data, status) {
									analyzeFile(ywKey,resId);
								},
								error : function(data, status, e) {
									ecpService.MessageBox.show(data);
								}
							});
					};
					
					//解析上传的文件
					analyzeFile = function(ywKey,resId){
						var scheme = {
							policy : 'valid',
							items : [ {
								sheetIndex : 0,
								startRowIndex : 1,
								items : []
							} ]
						};
						rs.doPostAsync(
							"com.ygsoft.ecp.app.operator.system.service.context.IDocumentImportContext",
							"doImport",[$.parseJSON(ecpService.DataContextUtil.getEcpDataContextJson()), ywKey, scheme]).then(function(result) {
								scope.result = result;
							}).catch(function(errMsg) {
								ecpService.MessageBox.show(errMsg);
							}).finally(function() {
								ngModel.$setViewValue({names: ''+Math.uuid()});
								deleteUploadFile(resId);
								masUtils.closeProgressBar();
							});
					}
					
					//删除上传的文件
					deleteUploadFile = function(resId){
						rs.doPostAsync(
							"com.ygsoft.ecp.service.unstructure.service.context.IEntityAttachmentContext",
							"deleteSummaryAndDetailByResId",[resId]).then(function() {
							}).catch(function(errMsg) {
								ecpService.MessageBox.show(errMsg);
							}).finally(function() {
								masUtils.closeProgressBar();
							});
					};
					
					ngModel.$parsers.push(function (modelValue) {
						return scope.result;
					});
				}
			}

			return obj;
		}
	}

});