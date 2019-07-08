sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Controller, JSONModel, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("PosClient.controller.MaterialDetail", {


			onInit: function() {
				
				// var initScope = this;
				// var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				// var materialBasicDetailUrl = oBundle.getText("materialBasicDetailUrl");
				// var materialStoreDetailUrl = oBundle.getText("materialStoreDetailUrl");
				// var materialPriceDetailUrl = oBundle.getText("materialPriceDetailUrl");
				// var materialUnitDetailUrl = oBundle.getText("materialUnitDetailUrl");
				
				// jQuery.ajax({
				// 	type: 'GET',
				// 	url: materialBasicDetailUrl + '?matnr=eq.000000000001000101',
				// 	success: function(data) {
				// 		var materialBasicInfo = data[0];
				// 		var materialBasicModel = new JSONModel(materialBasicInfo);
				// 		initScope.getView().setModel(materialBasicModel, "materialBasicModel");
						
				// 	}
				// });
				
				
				/*jQuery.ajax({
					type: 'GET',
					url: materialStoreDetailUrl + '?matnr=eq.000000000001000101',
					success: function(data) {
						var materialStoreInfo = {};
						materialStoreInfo.items = data;
						var materialStoreModel = new JSONModel(materialStoreInfo);
						initScope.getView().setModel(materialStoreModel, "materialStoreModel");
						
					}
				});
				
				jQuery.ajax({
					type: 'GET',
					url: materialPriceDetailUrl + '?matnr=eq.000000000001000101',
					success: function(data) {
						var materialPriceInfo = {};
						materialPriceInfo.items = data;
						var materialPriceModel = new JSONModel(materialPriceInfo);
						initScope.getView().setModel(materialPriceModel, "materialPriceModel");
						
					}
				});
				
				jQuery.ajax({
					type: 'GET',
					url: materialUnitDetailUrl + '?matnr=eq.000000000001000101',
					success: function(data) {
						var materialUnitInfo = {};
						materialUnitInfo.items = data;
						var materialUnitModel = new JSONModel(materialUnitInfo);
						initScope.getView().setModel(materialUnitModel, "materialUnitModel");
						
					}
				});*/
				
				this.getOwnerComponent().getRouter().attachRouteMatched(this._onRouteMatched, this);
			},
			
			_onRouteMatched: function(oEvent) {
				if (oEvent.getParameter("name") === "materialDetail") {
					var MaterialNumber = oEvent.getParameters().arguments.MaterialNumber;
					
					var storeId = oEvent.getParameters().arguments.storeId;

					this.storeId = storeId;
					var storeFilter = "";
					if (storeId !== "admin" && storeId !== "") {
						storeFilter = "&werks=in.("+storeId+",)";
					}

			var initScope = this;
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var materialBasicDetailUrl = oBundle.getText("materialBasicDetailUrl");
				var materialStoreDetailUrl = oBundle.getText("inventoryUrl");
				var materialPriceDetailUrl = oBundle.getText("materialPriceDetailUrl");
				var materialUnitDetailUrl = oBundle.getText("materialUnitDetailUrl"); 
			jQuery.ajax({
					type: 'GET',
					url: materialBasicDetailUrl + '?matnr=eq.'+MaterialNumber+'',
				success: function(data) {
						var materialBasicInfo = data[0];
						var materialBasicModel = new JSONModel(materialBasicInfo);
						initScope.getView().setModel(materialBasicModel, "materialBasicModel");
						
					}
				});
				
				jQuery.ajax({
					type: 'GET',
					url: materialStoreDetailUrl + '?matnr=eq.'+MaterialNumber+'',
					success: function(data) {
						var materialStoreInfo = {};
						materialStoreInfo.items = data;
						var materialStoreModel = new JSONModel(materialStoreInfo);
						initScope.getView().setModel(materialStoreModel, "materialStoreModel");
						
					}
				});
				
				jQuery.ajax({
					type: 'GET',
					url: materialPriceDetailUrl + '?matnr=eq.'+MaterialNumber+'',
					success: function(data) {
						var materialPriceInfo = {};
						materialPriceInfo.items = data;
						var materialPriceModel = new JSONModel(materialPriceInfo);
						initScope.getView().setModel(materialPriceModel, "materialPriceModel");
						
					}
				});
				
				jQuery.ajax({
					type: 'GET',
					url: materialUnitDetailUrl + '?matnr=eq.'+MaterialNumber+'',
					success: function(data) {
						var materialUnitInfo = {};
						materialUnitInfo.items = data;
						var materialUnitModel = new JSONModel(materialUnitInfo);
						initScope.getView().setModel(materialUnitModel, "materialUnitModel");
						
					}
				});
//
				}
			},
			
			onBackMaterialMaster : function(){
					this.getOwnerComponent().getRouter().navTo("materialMaster");
			},
			
			onMaterialMasterListPress : function(){
				
			}





	});

});