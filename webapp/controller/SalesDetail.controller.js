sap.ui.define(["sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/ui/model/json/JSONModel"
	],
	function(Controller, MessageToast, JSONModel) {
		"use strict"; 
		return Controller.extend("PosClient.controller.SalesDetail", {
			/**
			 *@memberOf PosClient.controller.Sales
			 */

			onInit: function() {
				this.getOwnerComponent().getRouter().attachRouteMatched(this._onRouteMatched, this);
			},

			_onRouteMatched: function(oEvent) {
				if (oEvent.getParameter("name") === "salesDetail") {
					var vbeln = oEvent.getParameter("arguments").vbeln;
					var shipto = oEvent.getParameter("arguments").shipto;
					/*if (this.getOwnerComponent().getModel("salesModel").getData().results !== undefined) {
				this.data = this.getOwnerComponent().getModel("salesModel").getData().results[vbeln];
					}*/
					var initScope = this;
					var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
					var orderItemURL = oBundle.getText("orderItemURL");
					var posShipUrl = oBundle.getText("posShipUrl");
					var storeUserUrl = oBundle.getText("storeUserUrl");
					var salesOrderURL = oBundle.getText("salesOrderURL");
					var salesDetailData = {};
					var salesShipData = {};
					var salesUserData = {};
					var salesOrderData = {};
					
					jQuery.ajax({
						type: 'GET',
						url: salesOrderURL + "?&vbeln=in.(" + vbeln + ")",
						success: function(data) {
							salesOrderData = data[0];
							var salesOrderModel = new JSONModel(salesOrderData);
							initScope.getView().setModel(salesOrderModel, "salesOrderModel");
						}
					});
					
					jQuery.ajax({
						type: 'GET',

						url: orderItemURL + "?&vbeln=in.(" + vbeln + ")",
						success: function(data) {
							salesDetailData.items = data;
							var salesDetailModel = new JSONModel(salesDetailData);
							initScope.getView().setModel(salesDetailModel, "salesDetailModel");
						}
					});
					
					// jQuery.ajax({
					// 	type: 'GET',
					// 	url: posShipUrl + "?&shipto=in.(" + shipto + ")",
					// 	success: function(data) {
					// 		salesShipData = data[0];
					// 		var salesShipToModel = new JSONModel(salesShipData);
					// 		initScope.getView().setModel(salesShipToModel, "salesShipToModel");
					// 		//salesShipToModel.updateBindings(true);
					// 	}
					// });
					
					
					jQuery.ajax({
						type: 'GET',

					//	url: storeUserUrl + "?&werks=in.(" + shipto + ")",
						url: storeUserUrl + "?&werks=in.(1110)",
						success: function(data) {
							salesUserData = data[0];
							var storeUserModel = new JSONModel(salesUserData);
							initScope.getView().setModel(storeUserModel, "storeUserModel");
						}
					});
					var detailSalesModel = new sap.ui.model.json.JSONModel(this.data);
					this.getView().setModel(detailSalesModel, "detailSalesModel");

				}
			},

			onBackLaunchpad: function() {
				this.getOwnerComponent().getRouter().navTo("launchPad");
			}

		});
	});