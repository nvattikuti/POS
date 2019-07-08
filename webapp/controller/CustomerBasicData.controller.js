sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Controller, JSONModel){
	"use strict";

	return Controller.extend("PosClient.controller.CustomerBasicData", {


	
			onInit: function() {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf PosClient.view.CustomerBasicData
		 */
		//	onInit: function() {
		//
		//	},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf PosClient.view.CustomerBasicData
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf PosClient.view.CustomerBasicData
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf PosClient.view.CustomerBasicData
		 */
		//	onExit: function() {
		//
		//	}
				this.getOwnerComponent().getRouter().attachRouteMatched(this._onRouteMatched, this);
			},

			onBackCustomerMaster : function(){
					this.getOwnerComponent().getRouter().navTo("customerMaster");
			},
			
			_onRouteMatched: function(oEvent) {
				if (oEvent.getParameter("name") === "customerBasicData") {
					var CustomerNumber = oEvent.getParameters().arguments.CustomerNumber;
					

			var initScope = this;
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var customerBasicDataUrl = oBundle.getText("customerBasicDataUrl");
				var customerGroupDataDetailUrl = oBundle.getText("customerGroupDataDetailUrl");
			
		
				jQuery.ajax({
					type: 'GET',
					url: customerBasicDataUrl + '?partner=eq.'+CustomerNumber+'',
				success: function(data) {
						var customerBasicInfo = data[0];
						var customerBasicDataModel = new JSONModel(customerBasicInfo);
						initScope.getView().setModel(customerBasicDataModel, "CustomerBasicModel");
						
					}
				});
				
						jQuery.ajax({
					type: 'GET',
					url: customerGroupDataDetailUrl + '?partner=eq.'+CustomerNumber+'',
					success: function(data) {
						var customerGrpDataInfo = {};
						customerGrpDataInfo.items = data;
						var customerGrpDataModel = new JSONModel(customerGrpDataInfo);
						initScope.getView().setModel(customerGrpDataModel, "customerGrpDataModel");
						
					}
				});

			}
		},
			onCustomerGrpDataPress : function(){
					
				}


});
});