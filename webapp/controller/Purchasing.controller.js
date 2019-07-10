sap.ui.define(["sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/ui/model/json/JSONModel"
	],
	function(Controller, MessageToast, JSONModel) {
		"use strict";
		return Controller.extend("PosClient.controller.Purchasing", {
			/**
			 *@memberOf PosClient.controller.Login
			 */

			onInit: function() {
				this.getOwnerComponent().getRouter().attachRouteMatched(this._onRouteMatched, this);
			},

			

			_onRouteMatched: function(oEvent) {
				if (oEvent.getParameter("name") === "purchasing") {
				
				}
			},
			
			onDisplayWarehouse : function(){
			    var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var displayWarehouseURL = oBundle.getText("displayWarehouseURL");
			    sap.m.URLHelper.redirect(displayWarehouseURL, true);
			},
			
			
			onMaterialDocument : function(){
			   var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var materialDocumentListURL = oBundle.getText("materialDocumentListURL");
			    sap.m.URLHelper.redirect(materialDocumentListURL, true);
			},
			
			
			onStockInTransit : function(){
			    var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var stockInTransitURL = oBundle.getText("stockInTransitURL");
			    sap.m.URLHelper.redirect(stockInTransitURL, true);
			},
			
			onOverdueMaterials : function(){
			    var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var overdueMaterialsURL = oBundle.getText("overdueMaterialsURL");
			    sap.m.URLHelper.redirect(overdueMaterialsURL, true);
			},
			
			oInboundDeliveryMonitor : function(){
			    var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var inboundDeliveryMonitorURL = oBundle.getText("inboundDeliveryMonitorURL");
			    sap.m.URLHelper.redirect(inboundDeliveryMonitorURL, true);
			},
			
			onOutboundDeliveryMonitor : function(){
			    var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var outboundDeliveryMonitorURL = oBundle.getText("outboundDeliveryMonitorURL");
			    sap.m.URLHelper.redirect(outboundDeliveryMonitorURL, true);
			},
			
			onPostGoodsMovement : function(){
			    //var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				//var postGoodsMovementURL = oBundle.getText("postGoodsMovementURL");
			    //sap.m.URLHelper.redirect(postGoodsMovementURL, true);
				this.getOwnerComponent().getRouter().navTo("PostGoodsMovement");
			},
			
			onBackLaunchpad: function() {
						this.getOwnerComponent().getRouter().navTo("launchPad");
					}

		});
	});
