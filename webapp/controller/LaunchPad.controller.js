sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("PosClient.controller.LaunchPad", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf PosClient.view.LaunchPad
		 */
			onInit: function() {
		this.getOwnerComponent().getRouter().attachRouteMatched(this._onRouteMatched, this);
			},
			
			_onRouteMatched: function(oEvent) {
				if (oEvent.getParameter("name") === "launchPad") {
					
					var user = oEvent.getParameters().arguments.user;
					this.user = user;
					
					var materialData = {};
				var me = this;
				
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var materialListUrl = oBundle.getText("materialListUrl");
				//var materialListUrl = "https://api.myjson.com/bins/yl0y8";
				var todaySalesURL = oBundle.getText("todaySalesURL");
				
				var todaySalesData = {};
					
				jQuery.ajax({
					type: 'GET',
					url: todaySalesURL,
					success: function(data) {
						todaySalesData = data[0];
						var todaySalesModel = new JSONModel(todaySalesData);
						me.getView().setModel(todaySalesModel, "todaySalesModel");
						var todaySalesModel = me.getView().getModel("todaySalesModel");
						todaySalesModel.setProperty("/time", (todaySalesModel.getData().time).slice(0,8));
						 
					}
				});
				
				jQuery.ajax({
					type: 'GET',
					url: materialListUrl,
					success: function(data) {
						materialData.items = data;
						var totalValue = data.length;
						//var listModel = new JSONModel(jQuery.sap.getModulePath("PosClient.model", materialData));
				
						var totalModel = new JSONModel(materialData);
						me.getView().setModel(totalModel, "totalModel");
						totalModel.setProperty("/totalValue", totalValue);
					}
				});
				
				
				var customerListUrl = oBundle.getText("customerListUrl");
				//var materialListUrl = "https://api.myjson.com/bins/yl0y8";
				var customerData = {};
				jQuery.ajax({
					type: 'GET',
					url: customerListUrl,
					success: function(data) {
						customerData.items = data;
						var totalCustomerValue = data.length;
						//var listModel = new JSONModel(jQuery.sap.getModulePath("PosClient.model", materialData));
				
						var totalCustomerModel = new JSONModel(customerData);
						me.getView().setModel(totalCustomerModel, "totalCustomerModel");
						totalCustomerModel.setProperty("/totalCustomerValue", totalCustomerValue);
					}
				});
				}
			},
			
			onUserNamePress: function (oEvent) {
			var oPopover = new sap.m.Popover({
				showHeader: false,
				placement: sap.m.PlacementType.Bottom,
				content:[
					new sap.m.Button({
						text: 'Feedback',
						type: sap.m.ButtonType.Transparent
					}),
					new sap.m.Button({
						text: 'Help',
						type: sap.m.ButtonType.Transparent
					}),
					new sap.m.Button({
						text: 'Logout',
						type: sap.m.ButtonType.Transparent,
						press: this.logoutUser
					})
				]
			}).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');

			oPopover.openBy(oEvent.getSource());
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf PosClient.view.LaunchPad
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf PosClient.view.LaunchPad
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf PosClient.view.LaunchPad
		 */
		//	onExit: function() {
		//
		//	}
		
		onBackLogin : function(){
				this.getOwnerComponent().getRouter().navTo("login");
			},
			
			onMaterialMaster : function(){
				this.getOwnerComponent().getRouter().navTo("materialMaster");
			},
			
			onPointOfSales : function(){
				this.getOwnerComponent().getRouter().navTo("pos");
			},
			
			onSettingsDashboard : function() {
				this.getOwnerComponent().getRouter().navTo("settingsView");
			},
			
			onCustomerMaster: function(){
				this.getOwnerComponent().getRouter().navTo("customerMaster");	
			},
			
			onInventory : function(){
				this.getOwnerComponent().getRouter().navTo("inventory");	
			},
			
			onSales : function(){
				this.getOwnerComponent().getRouter().navTo("salesMaster");	
			},

			onInv: function(){
				this.getOwnerComponent().getRouter().navTo("invoicesMaster");	
			},
			
			onReturn : function(){
				this.getOwnerComponent().getRouter().navTo("returnMaster");	
			},
			
			onPurchasing : function(){
			    this.getOwnerComponent().getRouter().navTo("purchasing");
			},
			
			handlePressConfiguration: function(oEvent) {
			var viewId = this.getView().getId();
			var toolPage = sap.ui.getCore().byId(viewId + "--lPtoolPage");
			var sideExpanded = toolPage.getSideExpanded();
			toolPage.setSideExpanded(!toolPage.getSideExpanded());
		}

	});

});