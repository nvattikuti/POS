sap.ui.define(["sap/ui/core/mvc/Controller",
		"sap/m/MessageToast"
	],
	function (Controller, MessageToast) {
		"use strict";
		return Controller.extend("PosClient.controller.PosReq", {
			/**
			 *@memberOf PosClient.controller.Sales
			 */

			onInit: function () {
				this.getOwnerComponent().getRouter().attachRouteMatched(this._onRouteMatched, this);
			},

			_onRouteMatched: function (oEvent) {
				if (oEvent.getParameter("name") === "PosReq") {

				}
			},

			onBackLaunchpad: function () {
				this.getOwnerComponent().getRouter().navTo("launchPad");
			}

		});
	});
// sap.ui.define(["sap/ui/core/mvc/Controller",
// 		"sap/ui/model/json/JSONModel",
// 		"sap/ui/model/Filter",
// 		"sap/ui/model/FilterOperator",
// 		"sap/m/MessageToast"
// 	],
// 	function (Controller, JSONModel, Filter, FilterOperator, MessageToast) {
// 		"use strict";
// 		var index;
// 		var plant;
// 		var oController;
// 		return Controller.extend("PosClient.controller.PosReq", {
// 			/**
// 			 *@memberOf PosClient.controller.Sales
// 			 */

// 			onInit: function () {
// 				this.getOwnerComponent().getRouter().attachRouteMatched(this._onRouteMatched, this);
// 			},

// 			_onRouteMatched: function (oEvent) {
// 				oController = this;
// 				if (oEvent.getParameter("name") === "posReq") {
// 					var Banfn = oEvent.getParameters().arguments.Banfn;
// 					var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
// 					var storeUserUrl = oBundle.getText("storeUserUrl");
// 					if (Banfn === "New") {
// 						// this.getView().byId("TableModifId").setVisible(false);
// 						// this.getView().byId("TableCreateId").setVisible(true);
// 						jQuery.ajax({
// 							type: 'GET',
// 							url: storeUserUrl,
// 							success: function (data) {
// 								plant = data[0].werks;
// 								var posRequest = [{
// 									xblnrmkpf: "",
// 									bnfpo: 10,
// 									matnr: "",
// 									menge: 0,
// 									meins: "",
// 									werks: plant,
// 									// Doctype: "ZD",
// 									zuser: data[0].zuser,
// 									budatmkpf: new Date()
// 								}];
// 								oController.getView().byId("Werks").setValue(plant);
// 								oController.getView().byId("UserId").setValue(data[0].zuser);
// 								oController.getView().byId("UserId").setDescription(data[0].fname + " " + data[0].lname);
// 								var oPosReqModel = new JSONModel();
// 								oPosReqModel.setData(posRequest);
// 								oController.getView().setModel(oPosReqModel, 'posReqModel');
// 							}
// 						});
// 					} else {
// 						// this.getView().byId("TableModifId").setVisible(true);
// 						// this.getView().byId("TableCreateId").setVisible(false);
// 						// jQuery.ajax({
// 						// 	type: 'GET',
// 						// 	url: settingsDataUrl,
// 						// 	success: function (data) {
// 						// 		for (var i = 0; i < data.length; i++) {
// 						// 			if (data[i].setting_key === "Plant") {
// 						// 				plant = data[i].setting_value;
// 						// 				break;
// 						// 			}
// 						// 		}
// 						// 	}
// 						// });
// 						var posRequestUrl = oBundle.getText("posRequestUrl");
// 						jQuery.ajax({
// 							type: 'GET',
// 							url: posRequestUrl + "?&XblnrMkpf=in.(" + Banfn + ")",
// 							success: function (data) {
// 								var oPosReqModel = new JSONModel();
// 								oPosReqModel.setData(data);
// 								oController.getView().setModel(oPosReqModel, 'posReqModel');
// 							}
// 						});
// 					}
// 					var materialData = {};
// 					var initScope = this;

// 					var materialListUrl = oBundle.getText("materialListUrl");
// 					//var materialListUrl = "https://api.myjson.com/bins/yl0y8";

// 					jQuery.ajax({
// 						type: 'GET',
// 						url: materialListUrl,
// 						success: function (data) {
// 							materialData.items = data;
// 							var listModel = new JSONModel(materialData);
// 							initScope.getView().setModel(listModel, "listModel");
// 						}
// 					});
// 				}

// 			},
// 			OnSugestionItemSelected: function (oEvent) {
// 				var id = oEvent.getSource().getId();
// 				var oItem = oEvent.getParameter("selectedItem");
// 				//var oContext = oItem.getBindingContext();
// 				sap.ui.getCore().byId(id).setValue(oItem.getKey());
// 				var description = oItem.getText();
// 				description = description.replace(oItem.getKey(), "");
// 				var DescrptionId = id.replace("MatnrId", "MaktxId");
// 				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
// 				var materialUoMUrl = oBundle.getText("materialUoMUrl");
// 				sap.ui.getCore().byId(DescrptionId).setText(description);
// 				jQuery.ajax({
// 					type: 'GET',
// 					url: materialUoMUrl + "?&matnr=in.(" + oItem.getKey() + ")",
// 					success: function (data) {
// 						var UomId = id.replace("MatnrId", "MeinsId");
// 						sap.ui.getCore().byId(UomId).setValue(data[0].meins);
// 					}
// 				});
// 				// http://18.191.159.130:3000/material_detail_unit?&matnr=in.(9000022)
// 			},
// 			// OnSugestionItem2Selected: function (oEvent) {
// 			// var id = oEvent.getSource().getId();
// 			// var oItem = oEvent.getParameter("selectedItem");
// 			// //var oContext = oItem.getBindingContext();
// 			// sap.ui.getCore().byId(id).setValue(oItem.getKey());
// 			// var description = oItem.getText();
// 			// description = description.replace(oItem.getKey(), "");
// 			// var DescrptionId = id.replace("Matnr2Id" , "Maktx2Id");
// 			// sap.ui.getCore().byId(DescrptionId).setText(description);
// 			// },			
// 			onBackLaunchpad: function () {
// 				// this.getOwnerComponent().getRouter().navTo("launchPad");
// 				this.getOwnerComponent().getRouter().navTo("posReqReport");
// 			},
// 			OnDraftSave: function () {
// 				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
// 				var posRequestUrl = oBundle.getText("posRequestUrl");
// 				var posData = this.getView().getModel('posReqModel').getData();
// 				for (var i = 0; i < posData.length; i++) {
// 					posData[i].docstatus = 'DRAFT';
// 					posData[i].xblnrmkpf = oController.getView().byId("Xblnr").getValue();
// 				}
// 				$.ajax({
// 					type: "POST",
// 					url: posRequestUrl,
// 					data: JSON.stringify(posData),
// 					contentType: "application/json; charset=utf-8",
// 					dataType: "json",
// 					success: function (oResponse) {}

// 				});
// 			},
// 			OnSave: function () {
// 				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
// 				var posRequestUrl = oBundle.getText("posRequestUrl");
// 				var posData = this.getView().getModel('posReqModel').getData();
// 				for (var i = 0; i < posData.length; i++) {
// 					posData[i].docstatus = 'SAVE';
// 					posData[i].xblnrmkpf = oController.getView().byId("Xblnr").getValue();
// 				}
// 				$.ajax({
// 					type: "POST",
// 					url: posRequestUrl,
// 					data: JSON.stringify(posData),
// 					contentType: "application/json; charset=utf-8",
// 					dataType: "json",
// 					success: function (oResponse) {}

// 				});
// 			},
// 			OnPOSDelete: function (oEvent) {
// 				var sPath = oEvent.getParameter("listItem").getBindingContextPath().substr(1);
// 				var data = this.getView().getModel('posReqModel').getData();
// 				data.splice(sPath, 1);
// 				index--;
// 				for (var i = 0; i < data.length; i++) {
// 					data[i].ItemNo = (i + 1) * 10;
// 				}
// 				this.getView().getModel("posReqModel").setData(data);
// 			},
// 			OnAdd: function () {
// 				var data = this.getView().getModel("posReqModel").getData();
// 				index = data.length;
// 				data[index] = {
// 					xblnrmkpf: "",
// 					bnfpo: (index + 1) * 10,
// 					matnr: "",
// 					menge: 0,
// 					meins: "",
// 					werks: plant,
// 					// Doctype: "ZD",
// 					zuser: "",
// 					budatmkpf: new Date()
// 				};
// 				this.getView().getModel("posReqModel").setData(data);
// 			}
// 		});
// 	});