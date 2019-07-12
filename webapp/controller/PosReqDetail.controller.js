sap.ui.define(["sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/m/MessageToast",
		'sap/m/MessageBox'
	],
	function (Controller, JSONModel, Filter, FilterOperator, MessageToast, MessageBox) {
		"use strict";
		var index;
		var plant;
		var oController;
		var method;
		var today;
		var zuser;
		return Controller.extend("PosClient.controller.PosReqDetail", {
			/**
			 *@memberOf PosClient.controller.Sales
			 */

			onInit: function () {
				this.getOwnerComponent().getRouter().attachRouteMatched(this._onRouteMatched, this);
			},

			_onRouteMatched: function (oEvent) {
				oController = this;
				if (oEvent.getParameter("name") === "PosReqDetail") {
					var Banfn = oEvent.getParameters().arguments.banfn;
					var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
					var storeUserUrl = oBundle.getText("storeUserUrl");
					today = new Date();
					var day = today.getDate();
					if (day < 9) {
						day = "0" + day;
					}
					var month = today.getMonth() + 1;

					if (month < 9) {
						month = "0" + month;
					}

					var year = today.getUTCFullYear();
					today = year + "-" + month + "-" + day;
					var settingsUrl = oBundle.getText("settingsUrl");
					var incrementData = {};
					//Get Store Information
					$.ajax({
						type: 'GET',
						url: settingsUrl,
						success: function (data) {
							incrementData = data[0];
							var incrementModel = new JSONModel(incrementData);
							oController.getOwnerComponent().setModel(incrementModel, "settingModel");
						}
					});
					if (Banfn === "New") {
						method = 'POST';
						// this.getView().byId("TableModifId").setVisible(false);
						// this.getView().byId("TableCreateId").setVisible(true);
						jQuery.ajax({
							type: 'GET',
							url: storeUserUrl,
							success: function (data) {
								plant = data[0].werks;
								var posRequest = [{
									xblnr_mkpf: "",
									bnfpo: 10,
									matnr: "",
									menge: 0,
									meins: "",
									maktx: "",
									editable: true,
									werks: plant,
									// Doctype: "ZD",
									zuser: data[0].zuser,
									budat_mkpf: today
								}];
								zuser = data[0].zuser;
								oController.getView().byId("Werks").setValue(plant);
								oController.getView().byId("UserId").setValue(data[0].zuser);
								// oController.getView().byId("Xblnr").setValue("");
								oController.getView().byId("Xblnr").setEditable(false);
								oController.getView().byId("UserId").setDescription(data[0].fname + " " + data[0].lname);
								var oPosReqModel = new JSONModel();
								oPosReqModel.setData(posRequest);
								oController.getView().setModel(oPosReqModel, 'posReqModel');
							}
						});
						var configURL = oBundle.getText("configURL");
						jQuery.ajax({
							type: 'GET',
							url: configURL + "?&num_key=in.(GR)",
							success: function (data) {
								oController.getView().byId("Xblnr").setValue(data.num_value);
							}
						});
					} else {
						method = 'PATCH';
						var posRequestUrl = oBundle.getText("posRequestUrl");
						jQuery.ajax({
							type: 'GET',
							url: posRequestUrl + "?&xblnr_mkpf=in.(" + Banfn + ")",
							success: function (data) {
								var oPosReqModel = new JSONModel();
								for (var i = 0; i < data.length; i++) {
									data[i].maktx = data[i].matnr;
									if (data[i].docstatus === "V") {
										data[i].Editable = true;
									} else {
										data[i].Editable = false;
									}
								}
								oPosReqModel.setData(data);
								if (data[0].docstatus === " ") {
									oController.getView().byId("CancelBtnId").setVisible(false);
									oController.getView().byId("DraftBtnId").setVisible(false);
									oController.getView().byId("SaveBtnId").setVisible(false);
									oController.getView().byId("TableCreateId").setMode("None");
								} else {
									oController.getView().byId("CancelBtnId").setVisible(true);
									oController.getView().byId("DraftBtnId").setVisible(true);
									oController.getView().byId("SaveBtnId").setVisible(true);
									oController.getView().byId("TableCreateId").setMode("Delete");
								}
								oController.getView().byId("Werks").setValue(data[0].werks);
								oController.getView().byId("Xblnr").setValue(data[0].xblnr_mkpf);
								oController.getView().byId("Xblnr").setEditable(false);
								oController.getView().byId("UserId").setValue(data[0].zuser);
								oController.getView().byId("UserId").setDescription(data[0].fname + " " + data[0].lname);
								oController.getView().setModel(oPosReqModel, 'posReqModel');
							}
						});
						jQuery.ajax({
							type: 'GET',
							url: storeUserUrl,
							success: function (data) {
								oController.getView().byId("UserId").setDescription(data[0].fname + " " + data[0].lname);

							}
						});
					}
					var materialData = {};
					var initScope = this;

					var materialListUrl = oBundle.getText("materialListUrl");
					//var materialListUrl = "https://api.myjson.com/bins/yl0y8";

					jQuery.ajax({
						type: 'GET',
						url: materialListUrl,
						success: function (data) {
							materialData.items = data;
							var listModel = new JSONModel(materialData);
							initScope.getView().setModel(listModel, "listModel");
						}
					});
				}

			},
			OnSugestionItemSelected: function (oEvent) {
				var id = oEvent.getSource().getId();
				var oItem = oEvent.getParameter("selectedItem");
				//var oContext = oItem.getBindingContext();
				// var description = oItem.getText();
				// description = description.replace(oItem.getKey(), "");
				var MatnrId = id.replace("MaktxId", "MatnrId");
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var materialUoMUrl = oBundle.getText("materialUoMUrl");
				sap.ui.getCore().byId(MatnrId).setText(oItem.getKey());
				// sap.ui.getCore().byId(id).setValue(oItem.getKey());
				jQuery.ajax({
					type: 'GET',
					url: materialUoMUrl + "?&matnr=in.(" + oItem.getKey() + ")",
					success: function (data) {
						var UomId = id.replace("MaktxId", "MeinsId");
						sap.ui.getCore().byId(UomId).setValue(data[0].meins);
					}
				});
				// http://18.191.159.130:3000/material_detail_unit?&matnr=in.(9000022)
			},
			onBackLaunchpad: function () {
				// this.getOwnerComponent().getRouter().navTo("launchPad");
				this.getOwnerComponent().getRouter().navTo("posReqReport");
			},
			OnDraftSave: function () {
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var posRequestUrl = oBundle.getText("posRequestUrl");
				var posData = this.getView().getModel('posReqModel').getData();
				var Payload = [];
				for (var i = 0; i < posData.length; i++) {
					posData[i].xblnr_mkpf = oController.getView().byId("Xblnr").getValue();
					// var dateInst = sap.ui.core.format.DateFormat.getDateInstance({
					// 	pattern: "yyyy-MM-dd"
					// });
					Payload[i] = {};
					Payload[i].docstatus = 'V';
					Payload[i].bnfpo = posData[i].bnfpo;
					Payload[i].matnr = posData[i].matnr;
					Payload[i].werks = posData[i].werks;
					Payload[i].zuser = posData[i].zuser;
					Payload[i].menge = posData[i].menge;
					Payload[i].meins = posData[i].meins;
					Payload[i].budat_mkpf = today;
					Payload[i].zuser = zuser;
					Payload[i].xblnr_mkpf = oController.getView().byId("Xblnr").getValue();
				}
				if (method === "POST") {
					$.ajax({
						type: method,
						url: posRequestUrl,
						data: JSON.stringify(Payload),
						contentType: "application/json; charset=utf-8",
						dataType: "json",
						success: function (oResponse) {
							var message = "Request has been created";
							oController.showSuccess(message);
						},
						error: function (oError) {
							oController.showSuccess(oError);
						}

					});
				} else {
					for (i = 0; i < Payload.length; i++) {
						if (i + 1 === Payload.length) {
							var showMessage = true;
						} else {
							showMessage = false;
						}
						$.ajax({
							type: method,
							url: posRequestUrl + "?&xblnr_mkpf=in.(" + Payload[i].xblnr_mkpf + ")&bnfpo=in.(" + Payload[i].bnfpo + ")",
							data: JSON.stringify(Payload[i]),
							contentType: "application/json; charset=utf-8",
							dataType: "json",
							success: function (oResponse) {
								if (showMessage === true) {
									var message = "POS request has been updated";
									MessageToast.show(message);
								}

							},
							error: function (oError) {
								oController.showSuccess(oError);
							}

						});
					}
				}
			},
			OnSave: function (oEvent) {
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var posRequestUrl = oBundle.getText("posRequestUrl");
				var posData = this.getView().getModel('posReqModel').getData();
				var Payload = [];
				for (var i = 0; i < posData.length; i++) {
					Payload[i] = {};
					Payload[i].docstatus = " ";
					// var dateInst = sap.ui.core.format.DateFormat.getDateInstance({
					// 	pattern: "yyyy-MM-dd"
					// });
					Payload[i].bnfpo = posData[i].bnfpo;
					Payload[i].matnr = posData[i].matnr;
					Payload[i].werks = posData[i].werks;
					Payload[i].zuser = posData[i].zuser;
					Payload[i].menge = posData[i].menge;
					Payload[i].meins = posData[i].meins;
					Payload[i].budat_mkpf = today;
					Payload[i].zuser = zuser;
					Payload[i].xblnr_mkpf = oController.getView().byId("Xblnr").getValue();
				}
				if (method === "POST") {
					$.ajax({
						type: method,
						url: posRequestUrl,
						data: JSON.stringify(Payload),
						contentType: "application/json; charset=utf-8",
						dataType: "json",
						success: function (oResponse) {
							var message = "Request has been created";
							oController.showSuccess(message);
						},
						error: function (oError) {
							oController.showSuccess(oError);
						}

					});
				} else {
					var message = "Are you sure you want to Commit POS document?";
					MessageBox.show(
						message, {
							icon: sap.m.MessageBox.Icon.SUCCESS,
							title: "Commit POS Request",
							actions: [sap.m.MessageBox.Action.CLOSE, sap.m.MessageBox.Action.YES],
							onClose: function (oAction) {
								if (oAction === "YES") {
									for (i = 0; i < Payload.length; i++) {
										if (i + 1 === Payload.length) {
											var showMessage = true;
										} else {
											showMessage = false;
										}
										$.ajax({
											type: method,
											url: posRequestUrl + "?&xblnr_mkpf=in.(" + Payload[i].xblnr_mkpf + ")&bnfpo=in.(" + Payload[i].bnfpo + ")",
											data: JSON.stringify(Payload[i]),
											contentType: "application/json; charset=utf-8",
											dataType: "json",
											success: function (oResponse) {
												if (showMessage === true) {
													var message = "POS request has  been saved";
													MessageToast.show(message);
												}
											},
											error: function (oError) {
												oController.showSuccess(oError);
											}
										});
									}
								}
							}
						});
				}
			},
			showSuccess: function (message) {
				if (message.responseText === "" && message.status === 201) {
					MessageBox.show(
						message.statusText, {
							icon: sap.m.MessageBox.Icon.SUCCESS,
							title: "POS Request",
							actions: [sap.m.MessageBox.Action.CLOSE],
							onClose: function (oAction) {}
						});
					var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
					var posRequestUrl = oBundle.getText("posRequestUrl");
					var storeUserUrl = oBundle.getText("storeUserUrl");
					var posReqModel = oController.getView().getModel("posReqModel");
					posReqModel.setData(null);
					jQuery.ajax({
						type: 'GET',
						url: storeUserUrl,
						success: function (data) {
							jQuery.ajax({
								type: 'GET',
								url: posRequestUrl + "?&docstatus=in.(V)&zuser=in.(" + data[0].zuser + ")",
								success: function (posdata) {
									var duplicateInd;
									var posRequest = [];
									for (var i = 0; i < posdata.length; i++) {
										if (i > 0) {
											duplicateInd = false;
											for (var j = 0; j < posRequest.length; j++) {
												if (posRequest[j].xblnr_mkpf === posdata[i].xblnr_mkpf) {
													duplicateInd = true;
													break;
												}
											}
											if (duplicateInd === false) {
												posRequest[i] = {};
												posRequest[i].xblnr_mkpf = posdata[i].xblnr_mkpf;
												posRequest[i].werks = posdata[i].werks;
												posRequest[i].budat_mkpf = posdata[i].budat_mkpf;
											}
										} else {
											posRequest[i] = {};
											posRequest[i].xblnr_mkpf = posdata[i].xblnr_mkpf;
											posRequest[i].werks = posdata[i].werks;
											posRequest[i].budat_mkpf = posdata[i].budat_mkpf;
										}
									}
									var oPosReqModel = new JSONModel(posRequest);
									MasterController.getView().setModel(oPosReqModel, 'posHdrModel');
								}

							});
						}
					});
				} else {
					MessageBox.show(
						message.responseText, {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "POS Request",
							actions: [sap.m.MessageBox.Action.CLOSE],
							onClose: function (oAction) {}
						});
				}
			},
			showError: function (message) {
				MessageBox.show(
					message.statusText, {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "POS Request",
						actions: [sap.m.MessageBox.Action.CLOSE],
						onClose: function (oAction) {}
					});
			},
			OnCancel: function () {
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var posRequestUrl = oBundle.getText("posRequestUrl");
				var posData = this.getView().getModel('posReqModel').getData();
				var Payload = [];
				// var dateInst = sap.ui.core.format.DateFormat.getDateInstance({
				// 	pattern: "yyyy-MM-dd"
				// });
				for (var i = 0; i < posData.length; i++) {
					Payload[i] = {};
					Payload[i].docstatus = "Z";
					Payload[i].bnfpo = posData[i].bnfpo;
					Payload[i].matnr = posData[i].matnr;
					Payload[i].werks = posData[i].werks;
					Payload[i].zuser = posData[i].zuser;
					Payload[i].menge = posData[i].menge;
					Payload[i].meins = posData[i].meins;
					Payload[i].budat_mkpf = today;
					Payload[i].xblnr_mkpf = oController.getView().byId("Xblnr").getValue();
				}
				for (i = 0; i < Payload.length; i++) {
					$.ajax({
						type: method,
						url: posRequestUrl + "?&xblnr_mkpf=in.(" + Payload[i].xblnr_mkpf + ")&bnfpo=in.(" + Payload[i].bnfpo + ")",
						data: JSON.stringify(Payload),
						contentType: "application/json; charset=utf-8",
						dataType: "json",
						success: function (oResponse) {
							var message = "Request has been Cancelled";
							MessageToast.show(message);
						},
						error: function (oError) {
							oController.showSuccess(oError);
						}
					});
				}
			},
			OnPOSDelete: function (oEvent) {
				var sPath = oEvent.getParameter("listItem").getBindingContextPath().substr(1);
				var data = this.getView().getModel('posReqModel').getData();
				var Payload = data[sPath];
				data.splice(sPath, 1);
				index--;
				for (var i = 0; i < data.length; i++) {
					data[i].bnfpo = ((i + 1) * 10).toString();
				}
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var posRequestUrl = oBundle.getText("posRequestUrl");
				this.getView().getModel("posReqModel").setData(data);
				$.ajax({
					type: 'DELETE',
					url: posRequestUrl + "?&xblnr_mkpf=in.(" + Payload.xblnr_mkpf + ")&bnfpo=in.(" + Payload.bnfpo + ")",
					data: JSON.stringify(Payload),
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					success: function (oResponse) {
						MessageToast.show("Material " + Payload.matnr + " has been deleted");
						if (data.length === 0) {
							var oBundle = oController.getOwnerComponent().getModel("i18n").getResourceBundle();
							var posRequestUrl = oBundle.getText("posRequestUrl");
							var storeUserUrl = oBundle.getText("storeUserUrl");
							var posReqModel = oController.getView().getModel("posReqModel");
							posReqModel.setData(null);
							jQuery.ajax({
								type: 'GET',
								url: storeUserUrl,
								success: function (data) {
									jQuery.ajax({
										type: 'GET',
										url: posRequestUrl + "?&docstatus=in.(V)&zuser=in.(" + data[0].zuser + ")",
										success: function (posdata) {
											var posRequest = posdata;
											var oPosReqModel = new JSONModel();
											oPosReqModel.setData(posRequest);
											MasterController.getView().setModel(oPosReqModel, 'posHdrModel');
										}

									});
								}
							});
						}
					}
				});
			},
			OnAdd: function () {
				var data = this.getView().getModel("posReqModel").getData();
				index = data.length;
				data[index] = {
					xblnr_mkpf: "",
					bnfpo: ((index + 1) * 10).toString(),
					matnr: "",
					menge: 0,
					meins: "",
					maktx: "",
					editable: true,
					werks: plant,
					// Doctype: "ZD",
					zuser: zuser,
					budat_mkpf: today
				};
				this.getView().getModel("posReqModel").setData(data);
				this.getView().getModel("posReqModel").setData(data);
			},

		});
	});