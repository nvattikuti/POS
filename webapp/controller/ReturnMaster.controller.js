sap.ui.define(["sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/ui/model/json/JSONModel"
	],
	function(Controller, MessageToast, JSONModel) {
		"use strict";
		return Controller.extend("PosClient.controller.ReturnMaster", {
			/**
			 *@memberOf PosClient.controller.Sales
			 */

			onInit: function() {
				
				
				var customerData = {};
			var initScope = this;
			
			var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var salesOrderURL = oBundle.getText("salesOrderURL");
			
			
			var today = new Date();
			var day = today.getDate();
			if(day < 9){
			    day = "0" + day;
			}
			var month = today.getMonth()+1;
			
			if(month < 9){
			    month = "0" + month;
			}
			
			var year = today.getFullYear();
			
			var filterToday = year + month + day;
			
			jQuery.ajax({
					type: 'GET',
					url: salesOrderURL+ '?erdat=in.' + '(' + filterToday + ')' + '',
					success: function(data) {
						customerData.items = data;
						var salesModel = new JSONModel(customerData);
						initScope.getView().setModel(salesModel, "salesModel");
					}
				});
				
				this.getOwnerComponent().getRouter().attachRouteMatched(this._onRouteMatched, this);
			},


			_onRouteMatched: function(oEvent) {
				if (oEvent.getParameter("name") === "returnMaster") {
				
				}
			},
			
				onBackLaunchpad : function(){
					this.getOwnerComponent().getRouter().navTo("launchPad");
			},
			
			onListItemPress : function(oEvent){
				this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
			},
			
			_showDetail: function(oItem) {
				//	var bReplace = !Device.system.phone;
				
				var itempath = oItem.getBindingContext("salesModel");
				var vbeln = itempath.getObject().vbeln;
				var shipto = itempath.getObject().shipto;
				this.getOwnerComponent().getRouter().navTo("returnDetail", {
					vbeln: vbeln,
					shipto : shipto === "" ? "0000100066" : shipto
				}, true);
			},
			
			
			onSearch : function(evt){
			    var customerData = {};
			var initScope = this;
			    var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var salesOrderURL = oBundle.getText("salesOrderURL");
			 var   sQuery = evt.getSource().getValue();
			 	jQuery.ajax({
					type: 'GET',
					url: salesOrderURL+ '?name_org=in.' + '(' + sQuery + ')' + '',
					success: function(data) {
						customerData.items = data;
						var salesModel = new JSONModel(customerData);
						initScope.getView().setModel(salesModel, "salesModel");
					}
				});
			}


			
			
		});
	});