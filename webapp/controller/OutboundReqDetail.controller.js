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
		return Controller.extend("PosClient.controller.OutboundReqDetail", {
			/**
			 *@memberOf PosClient.controller.Sales
			 */

			onInit: function () {
				this.getOwnerComponent().getRouter().attachRouteMatched(this._onRouteMatched, this);
			},

			_onRouteMatched: function (oEvent) {
				oController = this;
				if (oEvent.getParameter("name") === "OutboundReqDetail") {
					var xblnr_mkpf = oEvent.getParameters().arguments.xblnr_mkpf;
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
					if (xblnr_mkpf === "New") {
						method = 'POST';
						// this.getView().byId("TableModifId").setVisible(false);
						// this.getView().byId("TableCreateId").setVisible(true);
						jQuery.ajax({
							type: 'GET',
							url: storeUserUrl,
							success: function (data) {
								plant = data[0].werks;
								var outboundRequest = [{
									xblnr_mkpf: "",
									zeile: 10,
									matnr: "",
									menge: 0,
									meins: "",
									maktx: "",
									editable: true,
									werks: plant,
									lgort: "1000",
									reclgort: "1000",
									recplant: "",
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
								var oOutboundItemModel = new JSONModel();
								oOutboundItemModel.setData(outboundRequest);
								oController.getView().setModel(oOutboundItemModel, 'OutboundItemModel');
							}
						});
						var configURL = oBundle.getText("configURL");
						jQuery.ajax({
							type: 'GET',
							url: configURL + "?&num_key=in.(GI)",
							success: function (data) {
								oController.getView().byId("Xblnr").setValue(data.num_value);
							}
						});
					} else {
						method = 'PATCH';
						var outboundRequestUrl = oBundle.getText("outboundRequestUrl");
						jQuery.ajax({
							type: 'GET',
							url: outboundRequestUrl + "?&xblnr_mkpf=in.(" + xblnr_mkpf + ")",
							success: function (data) {
								var oOutboundItemModel = new JSONModel();
								for (var i = 0; i < data.length; i++) {
									data[i].maktx = data[i].matnr;
									if (data[i].docstatus === "V") {
										data[i].Editable = true;
									} else {
										data[i].Editable = false;
									}
								}
								oOutboundItemModel.setData(data);
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
								oController.getView().setModel(oOutboundItemModel, 'OutboundItemModel');
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
				this.getOwnerComponent().getRouter().navTo("launchpad");
			},
			OnDraftSave: function () {
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var outboundRequestUrl = oBundle.getText("outboundRequestUrl");
				var OutboundData = this.getView().getModel('OutboundItemModel').getData();
				var Payload = [];
				for (var i = 0; i < OutboundData.length; i++) {
					OutboundData[i].xblnr_mkpf = oController.getView().byId("Xblnr").getValue();
					// var dateInst = sap.ui.core.format.DateFormat.getDateInstance({
					// 	pattern: "yyyy-MM-dd"
					// });
					Payload[i] = {};
					Payload[i].docstatus = 'V';
					Payload[i].zeile = OutboundData[i].zeile;
					Payload[i].matnr = OutboundData[i].matnr;
					Payload[i].werks = OutboundData[i].werks;
					Payload[i].zuser = OutboundData[i].zuser;
					Payload[i].menge = OutboundData[i].menge;
					Payload[i].meins = OutboundData[i].meins;
					Payload[i].lgort = OutboundData[i].lgort;
					Payload[i].reclgort = OutboundData[i].reclgort;
					Payload[i].recplant = OutboundData[i].recplant;
					Payload[i].budat_mkpf = today;
					Payload[i].zuser = zuser;
					Payload[i].xblnr_mkpf = oController.getView().byId("Xblnr").getValue();
				}
				if (method === "POST") {
					$.ajax({
						type: method,
						url: outboundRequestUrl,
						data: JSON.stringify(Payload),
						contentType: "application/json; charset=utf-8",
						dataType: "json",
						success: function (oResponse) {
							var message = "Outbound Request has been created";
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
							url: outboundRequestUrl + "?&xblnr_mkpf=in.(" + Payload[i].xblnr_mkpf + ")&zeile=in.(" + Payload[i].zeile + ")",
							data: JSON.stringify(Payload[i]),
							contentType: "application/json; charset=utf-8",
							dataType: "json",
							success: function (oResponse) {
								if (showMessage === true) {
									var message = "POS Outbound request has been updated";
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
				var outboundRequestUrl = oBundle.getText("outboundRequestUrl");
				var OutboundData = this.getView().getModel('OutboundItemModel').getData();
				var Payload = [];
				for (var i = 0; i < OutboundData.length; i++) {
					Payload[i] = {};
					Payload[i].docstatus = " ";
					// var dateInst = sap.ui.core.format.DateFormat.getDateInstance({
					// 	pattern: "yyyy-MM-dd"
					// });
					Payload[i].zeile = OutboundData[i].zeile;
					Payload[i].matnr = OutboundData[i].matnr;
					Payload[i].werks = OutboundData[i].werks;
					Payload[i].zuser = OutboundData[i].zuser;
					Payload[i].menge = OutboundData[i].menge;
					Payload[i].meins = OutboundData[i].meins;
					Payload[i].lgort = OutboundData[i].lgort;
					Payload[i].reclgort = OutboundData[i].reclgort;
					Payload[i].recplant = OutboundData[i].recplant;
					Payload[i].budat_mkpf = today;
					Payload[i].zuser = zuser;
					Payload[i].xblnr_mkpf = oController.getView().byId("Xblnr").getValue();
				}
				if (method === "POST") {
					$.ajax({
						type: method,
						url: outboundRequestUrl,
						data: JSON.stringify(Payload),
						contentType: "application/json; charset=utf-8",
						dataType: "json",
						success: function (oResponse) {
							var message = "Outbound Request has been created";
							oController.showSuccess(message);
						},
						error: function (oError) {
							oController.showSuccess(oError);
						}

					});
				} else {
					var message = "Are you sure you want to Commit Outbound Request?";
					MessageBox.show(
						message, {
							icon: sap.m.MessageBox.Icon.SUCCESS,
							title: "Commit Outbound Request",
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
											url: outboundRequestUrl + "?&xblnr_mkpf=in.(" + Payload[i].xblnr_mkpf + ")&zeile=in.(" + Payload[i].zeile + ")",
											data: JSON.stringify(Payload[i]),
											contentType: "application/json; charset=utf-8",
											dataType: "json",
											success: function (oResponse) {
												if (showMessage === true) {
													message = "Outbound request has  been saved";
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
							title: "Outbound Request",
							actions: [sap.m.MessageBox.Action.CLOSE],
							onClose: function (oAction) {}
						});
					var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
					var outboundRequestUrl = oBundle.getText("outboundRequestUrl");
					var storeUserUrl = oBundle.getText("storeUserUrl");
					var OutboundItemModel = oController.getView().getModel("OutboundItemModel");
					OutboundItemModel.setData(null);
					jQuery.ajax({
						type: 'GET',
						url: storeUserUrl,
						success: function (data) {
							jQuery.ajax({
								type: 'GET',
								url: outboundRequestUrl + "?&docstatus=in.(V)&zuser=in.(" + data[0].zuser + ")",
								success: function (OutboundData) {
									var duplicateInd;
									var outboundRequest = [];
									for (var i = 0; i < OutboundData.length; i++) {
										if (i > 0) {
											duplicateInd = false;
											for (var j = 0; j < outboundRequest.length; j++) {
												if (outboundRequest[j].xblnr_mkpf === OutboundData[i].xblnr_mkpf) {
													duplicateInd = true;
													break;
												}
											}
											if (duplicateInd === false) {
												outboundRequest[i] = {};
												outboundRequest[i].xblnr_mkpf = OutboundData[i].xblnr_mkpf;
												outboundRequest[i].werks = OutboundData[i].werks;
												outboundRequest[i].budat_mkpf = OutboundData[i].budat_mkpf;
											}
										} else {
											outboundRequest[i] = {};
											outboundRequest[i].xblnr_mkpf = OutboundData[i].xblnr_mkpf;
											outboundRequest[i].werks = OutboundData[i].werks;
											outboundRequest[i].budat_mkpf = OutboundData[i].budat_mkpf;
										}
									}
									var oOutboundItemModel = new JSONModel(outboundRequest);
									MasterController.getView().setModel(oOutboundItemModel, 'OutboundHdrModel');
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
						title: "Outbound Request",
						actions: [sap.m.MessageBox.Action.CLOSE],
						onClose: function (oAction) {}
					});
			},
			OnCancel: function () {
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var outboundRequestUrl = oBundle.getText("outboundRequestUrl");
				var OutboundData = this.getView().getModel('OutboundItemModel').getData();
				var Payload = [];
				// var dateInst = sap.ui.core.format.DateFormat.getDateInstance({
				// 	pattern: "yyyy-MM-dd"
				// });
				for (var i = 0; i < OutboundData.length; i++) {
					Payload[i] = {};
					Payload[i].docstatus = "Z";
					Payload[i].zeile = OutboundData[i].zeile;
					Payload[i].matnr = OutboundData[i].matnr;
					Payload[i].werks = OutboundData[i].werks;
					Payload[i].zuser = OutboundData[i].zuser;
					Payload[i].menge = OutboundData[i].menge;
					Payload[i].meins = OutboundData[i].meins;
					Payload[i].lgort = OutboundData[i].lgort;
					Payload[i].reclgort = OutboundData[i].reclgort;
					Payload[i].recplant = OutboundData[i].recplant;
					Payload[i].budat_mkpf = today;
					Payload[i].xblnr_mkpf = oController.getView().byId("Xblnr").getValue();
				}
				for (i = 0; i < Payload.length; i++) {
					$.ajax({
						type: method,
						url: outboundRequestUrl + "?&xblnr_mkpf=in.(" + Payload[i].xblnr_mkpf + ")&zeile=in.(" + Payload[i].zeile + ")",
						data: JSON.stringify(Payload),
						contentType: "application/json; charset=utf-8",
						dataType: "json",
						success: function (oResponse) {
							var message = "Outbound Request has been Cancelled";
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
				var data = this.getView().getModel('OutboundItemModel').getData();
				var Payload = data[sPath];
				data.splice(sPath, 1);
				index--;
				for (var i = 0; i < data.length; i++) {
					data[i].zeile = ((i + 1) * 10).toString();
				}
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var outboundRequestUrl = oBundle.getText("outboundRequestUrl");
				this.getView().getModel("OutboundItemModel").setData(data);
				$.ajax({
					type: 'DELETE',
					url: outboundRequestUrl + "?&xblnr_mkpf=in.(" + Payload.xblnr_mkpf + ")&zeile=in.(" + Payload.zeile + ")",
					data: JSON.stringify(Payload),
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					success: function (oResponse) {
						MessageToast.show("Material " + Payload.matnr + " has been deleted");
						if (data.length === 0) {
							var oBundle = oController.getOwnerComponent().getModel("i18n").getResourceBundle();
							var outboundRequestUrl = oBundle.getText("outboundRequestUrl");
							var storeUserUrl = oBundle.getText("storeUserUrl");
							var OutboundItemModel = oController.getView().getModel("OutboundItemModel");
							OutboundItemModel.setData(null);
							jQuery.ajax({
								type: 'GET',
								url: storeUserUrl,
								success: function (data) {
									jQuery.ajax({
										type: 'GET',
										url: outboundRequestUrl + "?&docstatus=in.(V)&zuser=in.(" + data[0].zuser + ")",
										success: function (OutboundData) {
											var outboundRequest = OutboundData;
											var oOutboundItemModel = new JSONModel();
											oOutboundItemModel.setData(outboundRequest);
											MasterController.getView().setModel(oOutboundItemModel, 'OutboundHdrModel');
										}

									});
								}
							});
						}
					}
				});
			},
			OnAdd: function () {
				var data = this.getView().getModel("OutboundItemModel").getData();
				index = data.length;
				data[index] = {
					xblnr_mkpf: "",
					zeile: ((index + 1) * 10).toString(),
					matnr: "",
					menge: 0,
					meins: "",
					maktx: "",
					editable: true,
					werks: plant,
					lgort: "1000",
					reclgort: "1000",
					recplant: "",
					// Doctype: "ZD",
					zuser: zuser,
					budat_mkpf: today
				};
				this.getView().getModel("OutboundItemModel").setData(data);
				this.getView().getModel("OutboundItemModel").setData(data);
			}

		});
	});