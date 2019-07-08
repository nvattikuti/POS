sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/Tokenizer",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Controller, JSONModel, Tokenizer, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("PosClient.controller.CustomerMaster", {

		onInit: function() {
		    
		    var selectedCus = {
					"selectedCustomer": ""
				};
				var selectedCustomerModel = new JSONModel(selectedCus);
				this.getOwnerComponent().setModel(selectedCustomerModel, "selectedCustomerModel");

			var selectData = {
				"customerTypeKeys": [],
				"nameKeys": [],
				"mobileNumberKeys": []
			};

			var oFilterModel = new sap.ui.model.json.JSONModel(selectData);
			this.getView().setModel(oFilterModel, "oFilterModel");
			var customerData = {};
			var initScope = this;

			var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var customerListUrl = oBundle.getText("customerListUrl");

			jQuery.ajax({
				type: 'GET',
				url: customerListUrl,
				success: function(data) {
					customerData.items = data;
					var listModel = new JSONModel(customerData);
					initScope.getView().setModel(listModel, "listModel");
				
				}
			});
				initScope.getOwnerComponent().getRouter().attachRouteMatched(initScope._onRouteMatched, initScope);
		},

		_onRouteMatched: function(oEvent) {
			if (oEvent.getParameter("name") === "customerMaster") {
				var selectedCustomerModel = this.getOwnerComponent().getModel("selectedCustomerModel");
				var SelectedCustomerValue = selectedCustomerModel.getData().selectedCustomer;
				var oFilterModel = this.getView().getModel("oFilterModel");
				oFilterModel.setProperty("/nameKeys", SelectedCustomerValue);
			//	this.getView().byId("idCustomerName").setTokens(SelectedCustomerValue);
			if(SelectedCustomerValue.length > 0){
			   /* oFilterModel.getData().nameKeys = SelectedCustomerValue;
			    oFilterModel.updateBindings(true);*/
			 //   oFilterModel.setProperty("/nameKeys", SelectedCustomerValue);
			this.getView().byId("idCustomerName").addToken(new sap.m.Token({text : SelectedCustomerValue}));
			var customerData = {};
			var initScope = this;

			var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var customerListUrl = oBundle.getText("customerListUrl");
			var filterQueryString = "?";
			filterQueryString += "&name_org=in.(" + SelectedCustomerValue + ")";
			jQuery.ajax({
				type: 'GET',
				url: customerListUrl + filterQueryString, 
				success: function(data) {
					customerData.items = data;
					var listModel = new JSONModel(customerData);
					initScope.getView().setModel(listModel, "listModel");
				}
			});
			}
			}
		},

		onCustomerMasterListPress: function(oEvent) {
			this.getOwnerComponent().getRouter().navTo("customerBasicData", {
				CustomerNumber: oEvent.getSource().getBindingContext("listModel").getObject().partner
			});
		},

		onBackLaunchpad: function() {
			this.getOwnerComponent().getRouter().navTo("launchPad");
		},

		onCustomerBasicData: function() {
			this.getOwnerComponent().getRouter().navTo("customerBasicData");
			//	alert("On press");
		},

		onCustomerTypeValueHelp: function(oEvent) {

			var me = this,
				oView = me.getView();
			if (!me.oCustomerTypeDialog) {
				me.oCustomerTypeDialog = sap.ui.xmlfragment(
					"PosClient.fragment.CustomerType",
					this
				);
				oView.addDependent(me.oCustomerTypeDialog);
			}
			//initially deselect all the items in the list
			$.each(me.oCustomerTypeDialog.getItems(), function(j, item) {
				item.setSelected(false);
			});
			//now Based on the input tokens set selected as true for the items in the List
			$.each(oEvent.getSource().getTokens(), function(i, token) {
				$.each(me.oCustomerTypeDialog.getItems(), function(j, item) {
					if (token.getKey() === item.getTitle()) {
						item.setSelected(true);
					}
				});
			});
			me.oCustomerTypeDialog._searchField.setValue("");
			sap.ui.getCore().byId("idCustomerTypeValueHelp").fireSearch();

			me.oCustomerTypeDialog.open();

		},

		onCustomerNameValueHelp: function(oEvent) {

			var me = this,
				oView = me.getView();
			if (!me.oCustomerNameDialog) {
				me.oCustomerNameDialog = sap.ui.xmlfragment(
					"PosClient.fragment.CustomerName",
					this
				);
				oView.addDependent(me.oCustomerNameDialog);
			}
			//initially deselect all the items in the list
			$.each(me.oCustomerNameDialog.getItems(), function(j, item) {
				item.setSelected(false);
			});
			//now Based on the input tokens set selected as true for the items in the List
			$.each(oEvent.getSource().getTokens(), function(i, token) {
				$.each(me.oCustomerNameDialog.getItems(), function(j, item) {
					if (token.getKey() === item.getTitle()) {
						item.setSelected(true);
					}
				});
			});
			me.oCustomerNameDialog._searchField.setValue("");
			sap.ui.getCore().byId("idCustomerNameValueHelp").fireSearch();

			me.oCustomerNameDialog.open();

		},

		onMobileNumberValueHelp: function(oEvent) {

			var me = this,
				oView = me.getView();
			if (!me.oMobileNumberDialog) {
				me.oMobileNumberDialog = sap.ui.xmlfragment(
					"PosClient.fragment.MobileNumber",
					this
				);
				oView.addDependent(me.oMobileNumberDialog);
			}
			//initially deselect all the items in the list
			$.each(me.oMobileNumberDialog.getItems(), function(j, item) {
				item.setSelected(false);
			});
			//now Based on the input tokens set selected as true for the items in the List
			$.each(oEvent.getSource().getTokens(), function(i, token) {
				$.each(me.oMobileNumberDialog.getItems(), function(j, item) {
					if (token.getKey() === item.getTitle()) {
						item.setSelected(true);
					}
				});
			});
			me.oMobileNumberDialog._searchField.setValue("");
			sap.ui.getCore().byId("idMobileNumberValueHelp").fireSearch();

			me.oMobileNumberDialog.open();

		},

		customerTokenUpdate: function(oEvent) {
			var oFilterModel = this.getView().getModel("oFilterModel");
			var oSource = oEvent.getSource(),
				oTokens = oSource.getTokens(),
				bFlag = false;

			var oCustomerTypeKeys = oFilterModel.getProperty("/customerTypeKeys");
			var oNameKeys = oFilterModel.getProperty("/nameKeys");
			var oMobileNumberKeys = oFilterModel.getProperty("/mobileNumberKeys");
			var customDataKey = oSource.getCustomData()[0].getKey();
			var isEmptyRows = customDataKey === "CustomerType" ? oCustomerTypeKeys.length : oNameKeys.length;
			if (oEvent.getParameter("type") === Tokenizer.TokenUpdateType.Added) {
				var addedTokens = oEvent.getParameter("addedTokens");
				if (isEmptyRows !== 0) {
					for (var k = 0; k < oTokens.length - 1; k++) {
						if (oTokens[k].getText() === addedTokens[0].getText()) {
							bFlag = false;
							break;
						} else {
							bFlag = true;
						}
					}
					if (bFlag) {
						if (customDataKey === "CustomerType") {
							oCustomerTypeKeys.push({
								key: addedTokens[0].getKey(),
								text: addedTokens[0].getText()
							});
						} else if (customDataKey === "customerName") {
							oNameKeys.push({
								key: addedTokens[0].getKey(),
								text: addedTokens[0].getText()
							});
						} else {
							oMobileNumberKeys.push({
								key: addedTokens[0].getKey(),
								text: addedTokens[0].getText()
							});
						}
					}
				} else {
					if (customDataKey === "CustomerType") {
						oCustomerTypeKeys.push({
							key: addedTokens[0].getKey(),
							text: addedTokens[0].getText()
						});
					} else if (customDataKey === "customerName") {
						oNameKeys.push({
							key: addedTokens[0].getKey(),
							text: addedTokens[0].getText()
						});
					} else {
						oMobileNumberKeys.push({
							key: addedTokens[0].getKey(),
							text: addedTokens[0].getText()
						});
					}
				}
			} else if (oEvent.getParameter("type") === Tokenizer.TokenUpdateType.Removed) {
				var removedToken = oEvent.getParameter("removedTokens");

				var oCustomerTypeKeys = oFilterModel.getProperty("/customerTypeKeys");
				var oNameKeys = oFilterModel.getProperty("/nameKeys");
				var oMobileNumberKeys = oFilterModel.getProperty("/mobileNumberKeys");
				if (customDataKey === "CustomerType") {
					for (var j = 0; j < oCustomerTypeKeys.length; j++) {
						if (oCustomerTypeKeys[j].key === removedToken[0].getKey()) {
							oCustomerTypeKeys.splice(j, 1);
						}
					}
				} else if (customDataKey === "customerName") {
					for (var k = 0; k < oNameKeys.length; k++) {
						if (oNameKeys[k].key === removedToken[0].getKey()) {
							oNameKeys.splice(k, 1);
						}
					}
				} else {
					for (var l = 0; l < oMobileNumberKeys.length; l++) {
						if (oMobileNumberKeys[l].key === removedToken[0].getKey()) {
							oMobileNumberKeys.splice(l, 1);
						}
					}
				}
			}
			oFilterModel.updateBindings(true);

			this._finalFilters();
		},

		_finalFilters: function() {

			var oFilterModel = this.getView().getModel("oFilterModel");
			var oFilterModelData = oFilterModel.getData();
			var customerTypeKeys = [];
			var nameKeys = [];
			var mobileNumberKeys = [];

			/*if (oFilterModelData.customerTypeKeys.length !== 0) {
				for (var j = 0; j < oFilterModelData.customerTypeKeys.length; j++) {
					customerTypeKeys.push(new Filter("category", sap.ui.model.FilterOperator.EQ, oFilterModelData.customerTypeKeys[j]));
				}

			}*/
			if (oFilterModelData.customerTypeKeys) {
				if (oFilterModelData.customerTypeKeys.length !== 0) {
					for (var j = 0; j < oFilterModelData.customerTypeKeys.length; j++) {
						customerTypeKeys.push(oFilterModelData.customerTypeKeys[j].key);
					}

				}
			}
			if (oFilterModelData.nameKeys) {
				if (oFilterModelData.nameKeys.length !== 0) {
					for (var k = 0; k < oFilterModelData.nameKeys.length; k++) {
						nameKeys.push(oFilterModelData.nameKeys[k].key);
					}

				}
			}

			if (oFilterModelData.mobileNumberKeys) {
				if (oFilterModelData.mobileNumberKeys.length !== 0) {
					for (var l = 0; l < oFilterModelData.mobileNumberKeys.length; l++) {
						mobileNumberKeys.push(oFilterModelData.mobileNumberKeys[l].key);
					}

				}
			}

			var customerData = {};
			var initScope = this;

			var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var customerListUrl = oBundle.getText("customerListUrl");

			var filterQueryString = "?";

			if (customerTypeKeys.length > 0) {
				filterQueryString += "&partner=in.(" + customerTypeKeys + ")";
			}

			if (nameKeys.length > 0) {
				filterQueryString += "&name_org=in.(" + nameKeys + ")";
			}

			if (mobileNumberKeys.length > 0) {
				filterQueryString += "&uniid=in.(" + mobileNumberKeys + ")";
			}

			jQuery.ajax({
				type: 'GET',
				url: customerListUrl + filterQueryString, //'?productID=eq.'+"("+productIdKeys+")"+'' + '&productDescription=eq.'+"("+productDescriptionKeys+")"+'' + '&supplier=eq.'+"("+supplierKeys+")"+'',
				success: function(data) {
					customerData.items = data;
					var listModel = new JSONModel(customerData);
					initScope.getView().setModel(listModel, "listModel");
				}
			});

		},

		onCustomerTypeConfirm: function(oEvent) {
			var oSelectedItems = oEvent.getParameter("selectedContexts");
			var arrTempTokens = [];
			//add tokens to the MultiInput based on the selection of items
			for (var i = 0; i < oSelectedItems.length; i++) {
				arrTempTokens.push({
					key: oSelectedItems[i].getObject().partner
				});
			}
			var oFilterModel = this.getView().getModel("oFilterModel");
			oFilterModel.setProperty("/customerTypeKeys", arrTempTokens);

			this._finalFilters();
		},

		onCustomerNameConfirm: function(oEvent) {
			var oSelectedItems = oEvent.getParameter("selectedContexts");
			var arrTempTokens = [];
			//add tokens to the MultiInput based on the selection of items
			for (var i = 0; i < oSelectedItems.length; i++) {
				arrTempTokens.push({
					key: oSelectedItems[i].getObject().name_org
				});
			}
			var oFilterModel = this.getView().getModel("oFilterModel");
			oFilterModel.setProperty("/nameKeys", arrTempTokens);

			this._finalFilters();
		},

		onMobileNumberConfirm: function(oEvent) {
			var oSelectedItems = oEvent.getParameter("selectedContexts");
			var arrTempTokens = [];
			//add tokens to the MultiInput based on the selection of items
			for (var i = 0; i < oSelectedItems.length; i++) {
				arrTempTokens.push({
					key: oSelectedItems[i].getObject().uniid
				});
			}
			var oFilterModel = this.getView().getModel("oFilterModel");
			oFilterModel.setProperty("/mobileNumberKeys", arrTempTokens);

			this._finalFilters();
		},

		onCustomerTypeSearch: function(oEvent) {
			var aoCustomerTypeFilter = [];
			var sQuery = oEvent.getParameter("value");
			if (sQuery === null || sQuery === undefined) {
				sQuery = "";
			}
			aoCustomerTypeFilter.push(new Filter({
				filters: [
					new Filter({
						path: "partner",
						operator: FilterOperator.Contains,
						value1: sQuery
					})
				],
				and: false
			}));
			var oCustomerTypeList = this.oCustomerTypeDialog;
			var oBinding = oCustomerTypeList.getBinding("items");
			oBinding.filter(aoCustomerTypeFilter);
		},

		onCustomerNameSearch: function(oEvent) {
			var aoCustomerNameFilter = [];
			var sQuery = oEvent.getParameter("value");
			if (sQuery === null || sQuery === undefined) {
				sQuery = "";
			}
			aoCustomerNameFilter.push(new Filter({
				filters: [
					new Filter({
						path: "name_org",
						operator: FilterOperator.Contains,
						value1: sQuery
					})
				],
				and: false
			}));
			var oCustomerTypeList = this.oCustomerNameDialog;
			var oBinding = oCustomerTypeList.getBinding("items");
			oBinding.filter(aoCustomerNameFilter);
		},

		onMobileNumberSearch: function(oEvent) {
			var aMobileNumberFilter = [];
			var sQuery = oEvent.getParameter("value");
			if (sQuery === null || sQuery === undefined) {
				sQuery = "";
			}
			aMobileNumberFilter.push(new Filter({
				filters: [
					new Filter({
						path: "uniid",
						operator: FilterOperator.Contains,
						value1: sQuery
					})
				],
				and: false
			}));
			var oCustomerTypeList = this.oMobileNumberDialog;
			var oBinding = oCustomerTypeList.getBinding("items");
			oBinding.filter(aMobileNumberFilter);
		},
		
		onOkToPPOS : function(){
		    this.getView().byId("idCustomerName").removeAllTokens();
		}

	});

});