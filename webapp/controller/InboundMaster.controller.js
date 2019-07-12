sap.ui.define(["sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/ui/model/json/JSONModel"
	],
	function(Controller, MessageToast, JSONModel) {
		"use strict"; 
		return Controller.extend("PosClient.controller.InboundMaster", {
			/**
			 *@memberOf PosClient.controller.Sales
			 */

			onInit: function() {
				var customerData = {};
				var initScope = this;

				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var inboundURL = oBundle.getText("inboundURL");

				var today = new Date();
				var day = today.getDate();
				if (day < 9) {
					day = "0" + day;
				}
				var month = today.getMonth() + 1;

				if (month < 9) {
					month = "0" + month;
				}

				var year = today.getFullYear();

				// var filterToday = year + '-' + month + '-' + day;
				// jQuery.ajax({
				// 	type: 'GET',
				// 	url: inboundURL + '?erdat=in.' + '(' + filterToday + ')' + '',
				// 	success: function(data) {
				// 		customerData.items = data;
				// 		var inboundModel = new JSONModel(customerData);
				// 		initScope.getView().setModel(inboundModel, "inboundModel");
				// 	}
				// });
				
//				var filterToday = year + '-' + month + '-' + day;
				jQuery.ajax({
					type: 'GET',
					url: inboundURL,
					success: function(data) {
						customerData.items = data;
						var inboundModel = new JSONModel(customerData);
						initScope.getView().setModel(inboundModel, "inboundModel");
					}
				});

				this.getOwnerComponent().getRouter().attachRouteMatched(this._onRouteMatched, this);
			    
			},


			_onRouteMatched: function(oEvent) {
				if (oEvent.getParameter("name") === "InboundMaster") {
				
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
				var itempath = oItem.getBindingContext("inboundModel");
				var vbeln = itempath.getObject().vbeln;
				// var shipto = itempath.getObject().shipto;
//                var shipto;
				this.getOwnerComponent().getRouter().navTo("InboundDetail", {
					vbeln: vbeln
				}, true);
			},
			onSearch: function(evt) {
				var customerData = {};
				var initScope = this;
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var inboundURL = oBundle.getText("inboundURL");
				var sQuery = evt.getSource().getValue();
				jQuery.ajax({
					type: 'GET',
					url: inboundURL + '?vbeln=in.' + '(' + sQuery + ')' + '',
					success: function(data) {
						customerData.items = data;
						var inboundModel = new JSONModel(customerData);
						initScope.getView().setModel(inboundModel, "inboundModel");
					}
				});
			}
		});
	});