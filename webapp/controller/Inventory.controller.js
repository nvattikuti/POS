sap.ui.define(["sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
	],
	function(Controller, MessageToast, JSONModel, Filter, FilterOperator) {
		"use strict";
		return Controller.extend("PosClient.controller.Inventory", {
			/**
			 *@memberOf PosClient.controller.Inventory
			 */

			onInit: function() {
			    var me = this;
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var inventoryUrl = oBundle.getText("inventoryUrl");
				
				var countData = {
					"all": "",
					"inStock": "",
					"shortage": "",
					"outOfStock": ""
				};

				var countModel = new JSONModel(countData);
				this.getOwnerComponent().setModel(countModel, "countModel");
			
		
				jQuery.ajax({
					type: 'GET',
					url: inventoryUrl,
				success: function(data) {
						var inventoryData = data;
						var inventoryModel = new JSONModel(inventoryData);
						me.getView().setModel(inventoryModel, "inventoryModel");
						var countModel = me.getView().getModel("countModel");
						countModel.setProperty("/all", data.length);
						
					}
				});
				jQuery.ajax({
					type: 'GET',
					url: inventoryUrl + "?menge=gt.0",
				success: function(data) {
						var countModel = me.getView().getModel("countModel");
						countModel.setProperty("/inStock", data.length);
						
					}
				});
				
				jQuery.ajax({
					type: 'GET',
					url: inventoryUrl + "?menge=lte.0",
				success: function(data) {
						var countModel = me.getView().getModel("countModel");
						countModel.setProperty("/outOfStock", data.length);
						
					}
				});
				this.getOwnerComponent().getRouter().attachRouteMatched(this._onRouteMatched, this);
			},


			_onRouteMatched: function(oEvent) {
				if (oEvent.getParameter("name") === "inventory") {
				
				}
			},
			
				onBackLaunchpad : function(){
					this.getOwnerComponent().getRouter().navTo("launchPad");
			},
			
			handleIconTabBarSelect : function(evt){
			    var selectedKey = evt.getSource().mProperties.selectedKey;
			     var me = this;
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			//	var inventoryUrl = oBundle.getText("inventoryUrl");
				
			    if(selectedKey === "inStock"){
				 var inventoryUrl = oBundle.getText("inventoryUrl") + "?menge=gt.0";
			    }else if(selectedKey === "shortage"){
			        
			    }else if (selectedKey ==="outOfStock"){
			        var inventoryUrl = oBundle.getText("inventoryUrl") + "?menge=lte.0";
			    }else{
			        var inventoryUrl = oBundle.getText("inventoryUrl");
			    }
			   jQuery.ajax({
					type: 'GET',
					url: inventoryUrl,
				success: function(data) {
						var inventoryData = data;
						var inventoryModel = new JSONModel(inventoryData);
						me.getView().setModel(inventoryModel, "inventoryModel");
						
					}
				});
			}


			
			
		});
	});