sap.ui.define(["sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/ui/model/json/JSONModel",
		'sap/ui/model/Filter',
		"sap/ui/core/routing/History",
		"sap/m/MessageBox"
	],
	function(Controller, MessageToast, JSONModel, Filter, History, MessageBox) {
		"use strict";
		var selObj;
		return Controller.extend("PosClient.controller.POS", {
			/**
			 *@memberOf PosClient.controller.Login
			 */

			onInit: function() {

				var paymentData = {
					"amount": ""
				};

				var paymentModel = new JSONModel(paymentData);
				this.getOwnerComponent().setModel(paymentModel, "paymentModel");

				var paymentEnableData = {
					"bank": false,
					"card": false,
					"cash": false,
					"vouchers": false
				};

				var paymentEnableModel = new JSONModel(paymentEnableData);
				this.getOwnerComponent().setModel(paymentEnableModel, "paymentEnableModel");

				var incrementData = {};
				var me = this;
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var customerListUrl = oBundle.getText("customerListUrl");
				var posReceiptInfoUrl = oBundle.getText("posReceiptInfoUrl");

				jQuery.ajax({
					type: 'GET',
					url: posReceiptInfoUrl,
					success: function(data) {
						incrementData = data[0];
						var incrementModel = new JSONModel(incrementData);
						me.getOwnerComponent().setModel(incrementModel, "incrementModel");
					}
				});

				/*var pushData = {
					"ProductDescription": "",
					"UnitPrice": "",
					"quantity" : 1
				};*/
				var sendModel = new JSONModel();
				this.getView().setModel(sendModel, "sendModel");
				var pushModel = new JSONModel();
				this.getOwnerComponent().setModel(pushModel, "pushModel");
				pushModel.setProperty("/lineItemTax", "");
				var spanData = {
					"leftSpan": "L12",
					"rightSapn": ""
				};

				var spanModel = new JSONModel(spanData);
				this.getOwnerComponent().setModel(spanModel, "spanModel");

				var enablePOSData = {
					"customer": true,
					"material": false
				};

				var enablePOSModel = new JSONModel(enablePOSData);
				this.getOwnerComponent().setModel(enablePOSModel, "enablePOSModel");

				var posvisibleData = {
					"paymentButton": true,
					"finalPaymentButton": false,
					"finishSaleButton": false,
					"saveAsQuoteButton ": true,
					"cancelSaleButton": true,
					"backToSaleButton": false,
					"numpad": false
				};

				var posvisibleModel = new JSONModel(posvisibleData);
				this.getOwnerComponent().setModel(posvisibleModel, "posvisibleModel");

				var posData = {
					"rowTotal": "",
					"total": "",
					"tax": "",
					"quantity": 1,
					"finalTotal": "",
					"discount": ""
				};

				var posTableModel = new JSONModel(posData);
				this.getOwnerComponent().setModel(posTableModel, "posTableModel");

				var selectedCus = {
					"selectedCustomer": "",
					"selectedCustomerNumber": "",
					"selectedMaterial": "",
					"selectedVatID": "",
					"selectedStreet": "",
					"selectedCity": "",
					"selectedCountry": "",
					"selectedPostcode": "",
					"selecteduniid": ""
				};
				var selectedModel = new JSONModel(selectedCus);
				this.getOwnerComponent().setModel(selectedModel, "selectedModel");

				var visibleData = {
					"miscPOSFragment": false,
					"notePOSFragment": false,
					"shipFragment": false,
					"cusSearchInput": true,
					"cusSearch": true,
					"cusNew": true,
					"cusEdit": false,
					"cusRemove": false,
					"cusNote": false,
					"cusShip": false,
					"materialSpace": false,
					"tableSpace": false,
					"totalSpace": false,
					"taxDropDown": true
				};
				var posBtnVisibleModel = new JSONModel(visibleData);
				this.getView().setModel(posBtnVisibleModel, "posBtnVisibleModel");

				var customerData = {};
				var initScope = this;

				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var customerListUrl = oBundle.getText("customerListUrl");
				var taxUrl = oBundle.getText("taxUrl");
				jQuery.ajax({
					type: 'GET',
					url: customerListUrl,
					success: function(data) {
						customerData.items = data;
						var posCusModel = new JSONModel(customerData);
						initScope.getView().setModel(posCusModel, "posCusModel");
					}
				});

				var taxData = {};

				jQuery.ajax({
					type: 'GET',
					url: taxUrl,
					success: function(data) {
						taxData.items = data;
						var taxModel = new JSONModel(taxData);
						initScope.getView().setModel(taxModel, "taxModel");
					}
				});

				var sidedata = {
					"IsExpand": false
				};
				var expandmodel = new sap.ui.model.json.JSONModel(sidedata);
				this.getView().setModel(expandmodel, "expandmodel");

				var data = [{
					"titleOne": "Converse",
					"textOne": "69,95$",
					"titleTwo": "Ref : #####",
					"textTwo": "Code : #####"
				}];
				var dataModel = new sap.ui.model.json.JSONModel(data);
				this.getView().setModel(dataModel, "dataModel");

				var sData = {
					"searchData": ""
				};
				var searchModel = new sap.ui.model.json.JSONModel(sData);
				this.getView().setModel(searchModel, "searchModel");

				var posData = {};

				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var posURL = oBundle.getText("posCustomerURL");
				//var materialListUrl = "https://api.myjson.com/bins/yl0y8";
				var me = this;
				jQuery.ajax({
					type: 'GET',
					url: posURL,
					success: function(data) {
						posData.items = data;
						//var listModel = new JSONModel(jQuery.sap.getModulePath("PosClient.model", materialData));

						var posModel = new JSONModel(posData);
						me.getView().setModel(posModel, "posModel");
					}
				});

				var materialData = {};

				var materialListUrl = oBundle.getText("materialListUrl");
				//var materialListUrl = "https://api.myjson.com/bins/yl0y8";

				jQuery.ajax({
					type: 'GET',
					url: materialListUrl,
					success: function(data) {
						materialData.items = data;
						//var listModel = new JSONModel(jQuery.sap.getModulePath("PosClient.model", materialData));

						var materialModel = new JSONModel(materialData);
						me.getView().setModel(materialModel, "materialModel");
					}
				});

				this.getOwnerComponent().getRouter().attachRouteMatched(this._onRouteMatched, this);
			},

			_onRouteMatched: function(oEvent) {
				if (oEvent.getParameter("name") === "pos") {
					var storeModel = this.getOwnerComponent().getModel("storeModel");
					storeModel.getProperty("/selectedID");
					/*if(storeModel.getProperty("/selectedID")===""){
				storeModel.setProperty("/selectedID",this.getOwnerComponent().getModel("userData").loggedinUser );
				storeModel.updateBindings();
					}*/
					window.onbeforeunload = function() {
							HashChanger.getInstance().replaceHash("");
						}
						//Keeping the tax percent globally @Arjun
					this.percentage = this.getView().byId("idTaxComboBox").getSelectedKey();
				}
			},

			onShipPress: function(evt) {
				var posBtnVisibleModel = this.getView().getModel("posBtnVisibleModel");
				if (evt.getSource().getPressed()) {
					posBtnVisibleModel.setProperty("/shipFragment", true);
				} else {
					posBtnVisibleModel.setProperty("/shipFragment", false);
				}
			},

			onNotePress: function(evt) {
				var posBtnVisibleModel = this.getView().getModel("posBtnVisibleModel");
				if (evt.getSource().getPressed()) {
					posBtnVisibleModel.setProperty("/notePOSFragment", true);
				} else {
					posBtnVisibleModel.setProperty("/notePOSFragment", false);
				}
			},

			onPressItemMisc: function(evt) {
				var posBtnVisibleModel = this.getView().getModel("posBtnVisibleModel");
				if (evt.getSource().getPressed()) {
					posBtnVisibleModel.setProperty("/miscPOSFragment", true);
				} else {
					posBtnVisibleModel.setProperty("/miscPOSFragment", false);
				}
			},

			onMiscCancel: function() {
				var posBtnVisibleModel = this.getView().getModel("posBtnVisibleModel");
				posBtnVisibleModel.setProperty("/miscPOSFragment", false);
			},

			onAdd: function() {
				var dataModel = this.getView().getModel("dataModel");
				var data = {
					"inputOne": "",
					"inputTwo": ""
				};
				dataModel.getData().push(data);
				dataModel.updateBindings(true);
			},

			onRemove: function(evt) {
				var path = evt.getSource().getBindingContext("dataModel").sPath.split("/");
				var dataModel = this.getView().getModel("dataModel");
				var Data = dataModel.getData();
				Data.splice(path[path.length - 1], 1);
				dataModel.updateBindings(true);
			},

			onAfterRendering: function() {
				var oInputs = $('#__component0---pos--idProductsTable').find('.sapMInputBaseInner');
				for (var i = 0; i < oInputs.length; i++) {
					var oInputID = "#" + oInputs[i].id;
					$(oInputID).keyboard({
						layout: 'qwerty'

					});
				}

			},

			onCustomerSearch: function() {
				var me = this;
				/*var searchText = me.getView().byId("searchCustomers").getValue();
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var posURL = oBundle.getText("posCustomerURL");
				jQuery.ajax({
					type: 'GET',
					url: posURL + '?name_org=in.' + '(' + searchText + ')' + '',
					success: function(data) {
						var customerInfo = data[0];
						var customerInfoModel = new JSONModel(customerInfo);
						me.getView().setModel(customerInfoModel, "customerInfoModel");
						var selectedCustomer = customerInfoModel.getData().name_org;
						var selectedCustomerModel = me.getOwnerComponent().getModel("selectedCustomerModel");
						selectedCustomerModel.setProperty("/selectedCustomer", selectedCustomer);

					}
				});*/
				if (!me._oDialog) {
					me._oDialog = sap.ui.xmlfragment("PosClient.fragment.CustomerTable", me);
				}

				me.getView().addDependent(me._oDialog);

				jQuery.sap.syncStyleClass("sapUiSizeCompact", me.getView(), me._oDialog);
				me._oDialog.open();

				var customerData = {};

				var oBundle = me.getOwnerComponent().getModel("i18n").getResourceBundle();
				var customerListUrl = oBundle.getText("customerListUrl");

				jQuery.ajax({
					type: 'GET',
					url: customerListUrl,
					success: function(data) {
						customerData.items = data;
						var listModel = new JSONModel(customerData);
						me.getView().setModel(listModel, "listModel");

					}
				});

				var poshipURL = oBundle.getText("posShipUrl");
				jQuery.ajax({
					type: 'GET',
					//	url: poshipURL + '?name_org=in.' + '(' + searchText + ')' + '',
					url: poshipURL,
					success: function(data) {
						var shipInfo = data[0];
						var customerShipModel = new JSONModel(shipInfo);
						me.getView().setModel(customerShipModel, "customerShipModel");

					}
				});

				var posBtnVisibleModel = this.getView().getModel("posBtnVisibleModel");

				posBtnVisibleModel.setProperty("/cusSearchInput", false);
				posBtnVisibleModel.setProperty("/cusSearch", false);
				posBtnVisibleModel.setProperty("/cusNew", false);
				posBtnVisibleModel.setProperty("/cusEdit", true);
				posBtnVisibleModel.setProperty("/cusRemove", true);
				posBtnVisibleModel.setProperty("/cusNote", true);
				posBtnVisibleModel.setProperty("/cusShip", true);

				//	var customerInfoModel = this.getView().getModel("customerInfoModel");

				//    this.getOwnerComponent().getRouter().navTo("customerMaster");

			},

			handleSearch: function(oEvent) {
				var query = oEvent.getSource()._sSearchFieldValue.toLocaleLowerCase();
				var oList = sap.ui.getCore().byId("idCustomerPOSTable");
				var items = oList.getItems();
				for (var i = 0; i < items.length; i++) {
					var sCustomerID = oList.getItems()[i].getBindingContext("listModel").getObject().partner;
					var sCustomerName = oList.getItems()[i].getBindingContext("listModel").getObject().name_org.toLowerCase();
					var sMobileNumber = oList.getItems()[i].getBindingContext("listModel").getObject().mob_number;
					var sCity = oList.getItems()[i].getBindingContext("listModel").getObject().city.toLowerCase();
					var sCountry = oList.getItems()[i].getBindingContext("listModel").getObject().country.toLowerCase();
					if (sCustomerID.indexOf(query) > -1 || sCustomerName.indexOf(query) > -1 || sMobileNumber.indexOf(query) > -1 || sCity.indexOf(
							query) >
						-1 || sCountry.indexOf(query) > -1) {
						items[i].setVisible(true);
					} else {
						items[i].setVisible(false);
					}

				}
			},

			handleClose: function(oEvent) {
				var taxComboBox = this.getView().byId("idTaxComboBox");
				for (var i = 0; i < taxComboBox.getItems().length; i++) {
					if (taxComboBox.getItems()[i].getText() === "20% regular sales/sales receipts") {
						taxComboBox.setSelectedKey(taxComboBox.getItems()[i].getKey());

					}
				}
				var me = this;
				var selectType = oEvent.getId();
				var selectedModel = me.getOwnerComponent().getModel("selectedModel");

				if (selectType === "suggestionItemSelected") {
					var cusid = oEvent.getParameter("selectedItem").getProperty("key");
					var cusName = oEvent.getParameter("selectedItem").getProperty("text");
					MessageToast.show("You have chosen " + cusName);
					me.getCustomerDetails(cusid);
					var cusSpecData = {};
					cusSpecData = me.getView().getModel("customerSpecificData").getData()[0];
					selectedModel.setProperty("/selectedCustomer", cusSpecData.name_org);
					selectedModel.setProperty("/selectedCustomerNumber", cusSpecData.partner.replace(/^0+/, ''));
					selectedModel.setProperty("/selectedVatID", cusSpecData.vat_id);
					selectedModel.setProperty("/selectedStreet", cusSpecData.street);
					selectedModel.setProperty("/selectedCity", cusSpecData.city);
					selectedModel.setProperty("/selectedCountry", cusSpecData.country);
					selectedModel.setProperty("/selectedPostcode", cusSpecData.post_code);
					selectedModel.setProperty("/selecteduniid", cusSpecData.uniid);

				} else if (selectType === "submit") {
					var cusnid = oEvent.getSource().getValue();
					//var cusName = oEvent.getParameter("selectedItem").getProperty("text");
					MessageToast.show("You have chosen " + cusnid);
					if (me.getCustomerDetails(cusnid)) {
						var cusnSpecData = {};
						cusnSpecData = me.getView().getModel("customerSpecificData").getData()[0];
						selectedModel.setProperty("/selectedCustomer", cusnSpecData.name_org);
						selectedModel.setProperty("/selectedCustomerNumber", cusnSpecData.partner.replace(/^0+/, ''));
						selectedModel.setProperty("/selectedVatID", cusnSpecData.vat_id);
						selectedModel.setProperty("/selectedStreet", cusnSpecData.street);
						selectedModel.setProperty("/selectedCity", cusnSpecData.city);
						selectedModel.setProperty("/selectedCountry", cusnSpecData.country);
						selectedModel.setProperty("/selectedPostcode", cusnSpecData.post_code);
						selectedModel.setProperty("/selecteduniid", cusnSpecData.uniid);
					}
				} else {
					var aContexts;
					aContexts = oEvent.getParameter("selectedContexts");
					if (aContexts && aContexts.length) {
						MessageToast.show("You have chosen " + aContexts.map(function(oContext) {
							var selectedCustomer = oContext.getObject().name_org;
							var selectedCustomerNumber = oContext.getObject().partner.replace(/^0+/, '');

							var selectedVatID = oContext.getObject().vat_id;
							var selectedStreet = oContext.getObject().street;
							var selectedCity = oContext.getObject().city;
							var selectedCountry = oContext.getObject().country;
							var selectedPostcode = oContext.getObject().post_code;
							var selecteduniid = oContext.getObject().uniid;
							selectedModel.setProperty("/selectedCustomer", selectedCustomer);
							selectedModel.setProperty("/selectedCustomerNumber", selectedCustomerNumber);
							selectedModel.setProperty("/selectedVatID", selectedVatID);
							selectedModel.setProperty("/selectedStreet", selectedStreet);
							selectedModel.setProperty("/selectedCity", selectedCity);
							selectedModel.setProperty("/selectedCountry", selectedCountry);
							selectedModel.setProperty("/selectedPostcode", selectedPostcode);
							selectedModel.setProperty("/selecteduniid", selecteduniid);
							return oContext.getObject().name_org;

						}).join(", "));
					}

					//    me._materialData();
					//		var selectedCustomer =  oContext.getObject().name_org;
					//		var selectedCustomerModel = this.getOwnerComponent().getModel("selectedCustomerModel");
					//		selectedCustomerModel.setProperty("/selectedCustomer", selectedCustomer);

				}
				var selCus = selectedModel.getData().selectedCustomer;
				if (selCus.length !== 0) {
					var posBtnVisibleModel = me.getView().getModel("posBtnVisibleModel");
					posBtnVisibleModel.setProperty("/materialSpace", true);
					var enablePOSModel = me.getOwnerComponent().getModel("enablePOSModel");
					enablePOSModel.setProperty("/material", true);

					//	enablePOSModel.setProperty("/customer", false);
				}

				//			var selectedModel = this.getOwnerComponent().getModel("selectedModel");
				var selectedCustomerNumber = selectedModel.getProperty("/selectedCustomerNumber");
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var poshipURL = oBundle.getText("posShipUrl");
				jQuery.ajax({
					type: 'GET',
					//	url: poshipURL + '?name_org=in.' + '(' + searchText + ')' + '',
					url: poshipURL + "?&partner=in.(" + selectedCustomerNumber + ")",
					//	url: posShipUrl + "?&shipto=in.(" + shipto + ")",
					success: function(data) {
						var shipInfo = data[0];
						var customerShipModel = new JSONModel(shipInfo);
						me.getView().setModel(customerShipModel, "customerShipModel");

					}
				});
			},

			onCusRemove: function() {

				window.location.reload();

				var posBtnVisibleModel = this.getView().getModel("posBtnVisibleModel");

				posBtnVisibleModel.setProperty("/notePOSFragment", false);
				posBtnVisibleModel.setProperty("/shipFragment", false);
				posBtnVisibleModel.setProperty("/miscPOSFragment", false);

				posBtnVisibleModel.setProperty("/cusSearchInput", true);
				posBtnVisibleModel.setProperty("/cusSearch", true);
				posBtnVisibleModel.setProperty("/cusNew", true);
				posBtnVisibleModel.setProperty("/cusEdit", false);
				posBtnVisibleModel.setProperty("/cusRemove", false);
				posBtnVisibleModel.setProperty("/cusNote", false);
				posBtnVisibleModel.setProperty("/cusShip", false);

				/*var customerInfoModel = this.getView().getModel("customerInfoModel");
				customerInfoModel.setProperty("/name_org", "");
				this.getView().byId("searchCustomers").setValue("");*/
				var selectedModel = this.getOwnerComponent().getModel("selectedModel");
				selectedModel.setProperty("/selectedCustomer", "");
				selectedModel.setProperty("/selectedMaterial", "");
				//		var  posBtnVisibleModel =  this.getView().getModel("posBtnVisibleModel");
				posBtnVisibleModel.setProperty("/materialSpace", false);
				posBtnVisibleModel.setProperty("/tableSpace", false);
				posBtnVisibleModel.setProperty("/totalSpace", false);
				var spanModel = this.getOwnerComponent().getModel("spanModel");
				spanModel.getData().leftSpan = "L12";
				spanModel.getData().rightSpan = "";
				spanModel.updateBindings(true);
				var enablePOSModel = this.getOwnerComponent().getModel("enablePOSModel");
				enablePOSModel.setProperty("/customer", true);
				var pushModel = this.getView().getModel("pushModel");
				//pushModel.oData = null;
				pushModel.oData.length = 0;
				pushModel.updateBindings(true);
			},

			handlePressConfiguration: function(oEvent) {
				var viewId = this.getView().getId();
				var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
				var sideExpanded = toolPage.getSideExpanded();
				toolPage.setSideExpanded(!toolPage.getSideExpanded());
				//toolPage.SetSideContent(false);
				/*	var 	sideNavigationId = this.getView().byId("sideNavigation");
					sideNavigationId.setvisible(false);*/
			},

			onMaterial: function() {
				var me = this;
				if (!me._oMaterialDialog) {
					me._oMaterialDialog = sap.ui.xmlfragment("PosClient.fragment.MaterialTable", me);
				}

				me.getView().addDependent(me._oMaterialDialog);

				jQuery.sap.syncStyleClass("sapUiSizeCompact", me.getView(), me._oDialog);
				me._oMaterialDialog.open();
			},

			handleMaterialSearch: function(oEvent) {
				var query = oEvent.getSource()._sSearchFieldValue.toLocaleLowerCase();
				var oList = sap.ui.getCore().byId("idMaterialPOSTable");
				var items = oList.getItems();
				for (var i = 0; i < items.length; i++) {
					var sProductID = oList.getItems()[i].getBindingContext("materialModel").getObject().productID;
					var sProductDescription = oList.getItems()[i].getBindingContext("materialModel").getObject().productDescription.toLowerCase();
					var sSupplier = oList.getItems()[i].getBindingContext("materialModel").getObject().supplier;
					//	var sStandardPrice = oList.getItems()[i].getBindingContext("materialModel").getObject().standardPrice;
					//	var sPriceUnit = oList.getItems()[i].getBindingContext("materialModel").getObject().priceUnit;
					if (sProductID.indexOf(query) > -1 || sProductDescription.indexOf(query) > -1 || sSupplier.indexOf(query) > -1) {
						items[i].setVisible(true);
					} else {
						items[i].setVisible(false);
					}

				}
			},
			handleSuggestionMaterialSelected: function(oEvent) {
				var me = this;
				var inputValueType = oEvent.getId();
				var productModel = me.getView().getModel("materialModel");
				var aFilters = [];
				var selectedValue = oEvent.getSource().getSelectedKey();
				var enteredValue = oEvent.getSource().getValue();
				var inputVal, ppath, i, obj, eanNumber;
				if (selectedValue || enteredValue) {
					if (inputValueType === "suggestionItemSelected") {
						inputVal = oEvent.getSource().getSelectedKey();

					} else if (inputValueType === "submit") {
						//inputVal = oEvent.getSource().getValue();
						ppath = productModel.getData().items;
						for (i = 0; i < ppath.length; i++) {
							obj = ppath[i];
							for (eanNumber in obj) {
								if (eanNumber === "eanNumber" && obj.eanNumber === enteredValue) {
									inputVal = obj.productID;
								}
							}
						}
					}
					var selectedModel = me.getOwnerComponent().getModel("selectedModel");
					MessageToast.show("You have chosen " + inputVal);
					selectedModel.setProperty("/selectedMaterial", inputVal);
					var posBtnVisibleModel = me.getView().getModel("posBtnVisibleModel");
					posBtnVisibleModel.setProperty("/tableSpace", true);
					posBtnVisibleModel.setProperty("/totalSpace", true);
					/*spanModel.setProperty("leftSpan", "L9");
					spanModel.setProperty("rightSpan", "L3");*/
					var spanModel = this.getOwnerComponent().getModel("spanModel");
					spanModel.getData().leftSpan = "L9";
					spanModel.getData().rightSpan = "L3";
					spanModel.updateBindings(true);
					if (inputVal !== "") {
						me._materialData();
					}

					selectedModel.setProperty("/selectedMaterial", "");
					var enablePOSModel = me.getOwnerComponent().getModel("enablePOSModel");
					enablePOSModel.setProperty("/customer", false);
					oEvent.getSource().setSelectedKey("");
				} else {
					MessageToast.show("Please Enter Valid Product Id or EAN number");
				}
			},
			handleMaterialClose: function(oEvent) {
				var me = this;
				var selectedModel = me.getOwnerComponent().getModel("selectedModel");
				var aContexts = oEvent.getParameter("selectedContexts");
				if (aContexts && aContexts.length) {
					MessageToast.show("You have chosen " + aContexts.map(function(oContext) {
						var selectedMaterial = oContext.getObject().productID.replace(/^0+/, '');;

						selectedModel.setProperty("/selectedMaterial", selectedMaterial);
						return oContext.getObject().productID;

					}).join(", "));

				}
				// code related to value help click from the suggestion item selection
				else {
					MessageToast.show("You have chosen " + oEvent.getSource().getSelectedKey());
					selectedModel.setProperty("/selectedMaterial", oEvent.getSource().getSelectedKey());
					//	oEvent.getSource().setSelectedKey("");
				}

				var posBtnVisibleModel = me.getView().getModel("posBtnVisibleModel");
				posBtnVisibleModel.setProperty("/tableSpace", true);
				posBtnVisibleModel.setProperty("/totalSpace", true);
				/*spanModel.setProperty("leftSpan", "L9");
				spanModel.setProperty("rightSpan", "L3");*/
				var spanModel = this.getOwnerComponent().getModel("spanModel");
				spanModel.getData().leftSpan = "L9";
				spanModel.getData().rightSpan = "L3";
				spanModel.updateBindings(true);
				me._materialData();
				selectedModel.setProperty("/selectedMaterial", "");
				var enablePOSModel = me.getOwnerComponent().getModel("enablePOSModel");
				enablePOSModel.setProperty("/customer", false);
			},

			_materialData: function() {
				var me = this;
				if (me.percentage === "") {
					me.percentage = me.getView().byId("idTaxComboBox").getSelectedKey();
				}
				var materialTableData = {};
				var storeModel = this.getOwnerComponent().getModel("storeModel");
				var storeID = storeModel.getProperty("/selectedID");
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var materialPriceDetailUrl = oBundle.getText("materialPriceDetailUrl");
				var selectedModel = me.getOwnerComponent().getModel("selectedModel");
				var selMaterial = selectedModel.getProperty("/selectedMaterial");
				var selCustomer = selectedModel.getProperty("/selectedCustomer");
				var selectedCustomerNumber = selectedModel.getProperty("/selectedCustomerNumber");
				var filterQueryString = "?";
				if (storeID.length > 0) {
					filterQueryString += "&werks=in.(" + storeID + ")";
				}

				if (selMaterial.length > 0) {
					filterQueryString += "&matnr=in.(" + selMaterial + ")";
				}

				if (selCustomer.length > 0) {
					filterQueryString += "&kunnr=in.(" + selectedCustomerNumber + ")";
				}
				//	filterQueryString +="&matnr=in.(" + selMaterial + ")";
				//	var	storeIDfilter ="&werks=in.(" + storeID + ")";
				var pushModel = me.getView().getModel("pushModel");
				var moreData = {};
				jQuery.ajax({
					type: 'GET',
					url: materialPriceDetailUrl + filterQueryString,
					success: function(data) {
						if (pushModel.oData.length === undefined) {
							var oArray = [];
						} else {
							var oArray = pushModel.oData;
						}
						if (data.length !== 0) {
							if (data.length > 1) {
								moreData.items = data;
								//var listModel = new JSONModel(jQuery.sap.getModulePath("PosClient.model", materialData));

								var moreModel = new JSONModel(moreData);
								me.getView().setModel(moreModel, "moreModel");
								if (!me._moreDialog) {
									me._moreDialog = sap.ui.xmlfragment("PosClient.fragment.MorePOSmaterials", me);
									me.getView().addDependent(me._moreDialog);
								}
								me._moreDialog.open();
								//	oArray.push(data[0]);
								// Adding item sub total property at line item level @Arjun

							} else {
								materialTableData.items = data[0];

								oArray.push(data[0]);
								// Adding item sub total property at line item level @Arjun
								$.each(oArray, function(index, value) {
									if (value) {

										//amount afterDiscount
										value["amountAfterDisc"] = me.calculateAmountAfterDisc(value);
										// Passing quantity as obj
										value["taxAmount"] = me.onTaxCalculate(parseInt(me.percentage), value["amountAfterDisc"], value.kpein);
										//if(value.discount&&value.discount!==""&&value.discount!==0){
										value["itemSubTotal"] = me.calculateDiscount(value);
									}
								});
								pushModel.setProperty("/", oArray);

								me.onQuantitySubmit();
							}
						}
						//else if(data.length === 0){
						//	MessageToast.show("No product details avaialble");
						//	return false;
						//}
						else {
							jQuery.ajax({
								type: 'GET',
								url: materialPriceDetailUrl + "?&matnr=in.(" + selMaterial + ")" + "&kunnr=in.(" + selectedCustomerNumber + ")",
								success: function(data) {
									if (data.length > 1) {
										moreData.items = data;
										//var listModel = new JSONModel(jQuery.sap.getModulePath("PosClient.model", materialData));

										var moreModel = new JSONModel(moreData);
										me.getView().setModel(moreModel, "moreModel");
										if (!me._moreDialog) {
											me._moreDialog = sap.ui.xmlfragment("PosClient.fragment.MorePOSmaterials", me);
											me.getView().addDependent(me._moreDialog);
										}
										me._moreDialog.open();
									} else {
										if (pushModel.oData.length === undefined) {
											var oArray = [];
										} else {
											var oArray = pushModel.oData;
										}
										if (data.length !== 0) {
											materialTableData.items = data[0];
											oArray.push(data[0]);
											// Adding item sub total property at line item level @Arjun
											$.each(oArray, function(index, value) {
												if (value) {
													//amount afterDiscount
													value["amountAfterDisc"] = me.calculateAmountAfterDisc(value);
													value["taxAmount"] = me.onTaxCalculate(parseInt(me.percentage), value["amountAfterDisc"], value.kpein);
													//if(value.discount&&value.discount!==""&&value.discount!==0){
													value["itemSubTotal"] = me.calculateDiscount(value);
												}
											});
											pushModel.setProperty("/", oArray);
											me.onQuantitySubmit();
											// Start of Addition
										} else {
											jQuery.ajax({
												type: 'GET',
												url: materialPriceDetailUrl + "?&matnr=in.(" + selMaterial + ")",
												success: function(data) {
													//If more then One record found, check if customer number exist, if yes then remove that record
													if (data.length > 1) {
														for (var i = 0; i < data.length; i++) {
															if ((data[i].kunnr != "") || (data[i].werks != "")) {
																data.splice(i, 1);
															}
														}
													}
													//Display a Popup for User to choose the data if more then one record
													if (data.length > 1) {
														moreData.items = data;
														var moreModel = new JSONModel(moreData);
														me.getView().setModel(moreModel, "moreModel");
														if (!me._moreDialog) {
															me._moreDialog = sap.ui.xmlfragment("PosClient.fragment.MorePOSmaterials", me);
															me.getView().addDependent(me._moreDialog);
														}
														me._moreDialog.open();
														if (pushModel.oData.length === undefined) {
															var oArray = [];
														} else {
															var oArray = pushModel.oData;
														}

													} else {
														if (data.length !== 0) {
															if (pushModel.oData.length === undefined) {
																var oArray = [];
																materialTableData.items = data[0];
																oArray.push(data[0]);
															} else {
																var oArray = pushModel.oData;
																materialTableData.items = data[0];
																oArray.push(data[0]);
															}
														}
													}
													$.each(oArray, function(index, value) {
														if (value) {
															//amount afterDiscount
															value["amountAfterDisc"] = me.calculateAmountAfterDisc(value);
															value["taxAmount"] = me.onTaxCalculate(parseInt(me.percentage), value["amountAfterDisc"], value.kpein);
															//if(value.discount&&value.discount!==""&&value.discount!==0){
															value["itemSubTotal"] = me.calculateDiscount(value);
														}
													});
													if (data.length !== 0) {
													pushModel.setProperty("/", oArray);
													me.onQuantitySubmit();
																										}
													// 	} else {
													// 		moreData.items = data;
													// 		var moreModel = new JSONModel(moreData);
													// 		me.getView().setModel(moreModel, "moreModel");
													// 		if (!me._moreDialog) {
													// 			me._moreDialog = sap.ui.xmlfragment("PosClient.fragment.MorePOSmaterials", me);
													// 			me.getView().addDependent(me._moreDialog);
													// 		}
													// 		me._moreDialog.open();

													// 	}
													// }
													// If Only Single Record Selected				   
													//													else {
													// if (pushModel.oData.length === undefined) {
													// 	var oArray = [];
													// } else {
													// 	var oArray = pushModel.oData;
													// }

													// if (data.length !== 0) {
													// 	materialTableData.items = data[0];
													// 	oArray.push(data[0]);
													// 	$.each(oArray, function(index, value) {
													// 		if (value) {
													// 			//amount afterDiscount
													// 			value["amountAfterDisc"] = me.calculateAmountAfterDisc(value);
													// 			value["taxAmount"] = me.onTaxCalculate(parseInt(me.percentage), value["amountAfterDisc"], value.kpein);
													// 			//if(value.discount&&value.discount!==""&&value.discount!==0){
													// 			value["itemSubTotal"] = me.calculateDiscount(value);
													// 		}
													// 	});
													// pushModel.setProperty("/", oArray);
													// me.onQuantitySubmit();
													//														}
													//													}
												}
											});
											//End of Addition
											// 											jQuery.ajax({
											// 												type: 'GET',
											// 												url: materialPriceDetailUrl + "?&matnr=in.(" + selMaterial + ")",
											// 												success: function(data) {
											// 													if (data.length > 0) {
											// 														for (var i = 0; i < data.length; i++) {
											// 															if (data[i].kunnr === "") {
											// 																materialTableData.items = data[i];
											// 																//	var oArray = [];
											// 																//	var oArray = pushModel.oData;
											// 																if (pushModel.oData.length === undefined) {
											// 																	var oArray = [];
											// 																} else {
											// 																	var oArray = pushModel.oData;
											// 																}
											// 																oArray.push(data[i]);
											// 																// Adding item sub total property at line item level @Arjun
											// 																$.each(oArray, function(index, value) {
											// 																	if (value) {
											// 																		//amount afterDiscount
											// 																		value["amountAfterDisc"] = me.calculateAmountAfterDisc(value);
											// 																		value["taxAmount"] = me.onTaxCalculate(parseInt(me.percentage), value["amountAfterDisc"], value.kpein);
											// 																		//if(value.discount&&value.discount!==""&&value.discount!==0){
											// 																		value["itemSubTotal"] = me.calculateDiscount(value);
											// 																		pushModel.setProperty("/", oArray);
											//                                                                         me.onQuantitySubmit();
											// 																	}

											// 																});

											// 															}

											// 														}
											// 														/*moreData.items = data;

											// 														var moreModel = new JSONModel(moreData);
											// 														me.getView().setModel(moreModel, "moreModel");
											// 														if (!me._moreDialog) {
											// 															me._moreDialog = sap.ui.xmlfragment("PosClient.fragment.MorePOSmaterials", me);
											// 															me.getView().addDependent(me._moreDialog);
											// 														}
											// 														me._moreDialog.open();*/
											// 													} 
											// //else {
											// 														// if (pushModel.oData.length === undefined) {
											// 														// 	var oArray = [];
											// 														// } else {
											// 														// 	var oArray = pushModel.oData;
											// 														// }
											// 														// materialTableData.items = data[0];
											// 														// if (data[0]) {
											// 														// 	oArray.push(data[0]);
											// 														// }
											// 														// Adding item sub total property at line item level @Arjun
											// 														$.each(oArray, function(index, value) {
											// 															// if (value) {
											// 															// 	//amount afterDiscount
											// 															// 	value["amountAfterDisc"] = me.calculateAmountAfterDisc(value);
											// 															// 	value["taxAmount"] = me.onTaxCalculate(parseInt(me.percentage), value["amountAfterDisc"], value.kpein);
											// 															// 	//if(value.discount&&value.discount!==""&&value.discount!==0){
											// 															// 	value["itemSubTotal"] = me.calculateDiscount(value);
											// 															// }
											// 														}
											// 														);

											// pushModel.setProperty("/", oArray);
											// me.onQuantitySubmit();
											//													}
										}
									}
									//										}
									//									}
								}
							});
						}

					}
				});
			},

			onQuantitySubmit: function(oEvent) {
				var taxCheckBox = true; //this.getView().byId("idTaxCheckBox").getSelected();
				var posTableModel = this.getOwnerComponent().getModel("posTableModel");
				var pushModel = this.getOwnerComponent().getModel("pushModel");
				/*		if (taxCheckBox === true) {
							this.percentage = this.getView().byId("idTaxComboBox").getSelectedKey();
						} else {
							this.percentage = "0";
						}

						var discountInput = sap.ui.getCore().byId("idDiscountInput");

						if (discountInput === undefined) {
							this.discountValue = "0";
						} else {
							this.discountValue = parseFloat(discountInput.getValue());
							posTableModel.getData().discount = this.discountValue + "%";
							posTableModel.updateBindings(true);
						}



						posTableModel.refresh();
						var pushModelOdata = this.getView().getModel("pushModel").oData;

						if (oEvent !== undefined) {
							var rowQty = parseInt(oEvent.getSource().getBindingContext("pushModel").getObject().kpein);
							var rowPrice = oEvent.getSource().getBindingContext("pushModel").getObject().kbetr;
							var rowTotal = rowQty * rowPrice;

							oEvent.getSource().getBindingContext("pushModel").getObject().rRotal = Math.round(rowTotal * 100) / 100;

							pushModel.updateBindings(true);
							var tot = 0;
							var finalTOT = 0;
							var finalTax = 0;
							var discountTot = 0;
							for (var j = 0; j < pushModelOdata.length; j++) {

								if (this.discountValue !== "0") {
									tot += pushModelOdata[j].rRotal - ((this.discountValue / 100) * pushModelOdata[j].rRotal);
									discountTot += (parseFloat(pushModelOdata[j].kbetr) - (((100 - this.discountValue) / 100) * parseFloat(pushModelOdata[j].kbetr))) *
										parseFloat(pushModelOdata[j].kpein);
									var nan = "NAN";
									var pNan = parseInt(nan);
									if (discountTot === pNan) {
										discountTot = 0;
									}
									finalTOT += (parseFloat(((this.percentage / 100) * pushModelOdata[j].rRotal).toFixed(2)) + pushModelOdata[j].rRotal) - ((this.discountValue /
										100) * (parseFloat(((this.percentage / 100) * pushModelOdata[j].rRotal).toFixed(2)) + pushModelOdata[j].rRotal));
									finalTax += parseFloat(((this.percentage / 100) * pushModelOdata[j].rRotal).toFixed(2)) - ((this.discountValue / 100) *
										parseFloat(((this.percentage / 100) * pushModelOdata[j].rRotal).toFixed(2)));
									pushModelOdata[j].lTotal = parseFloat((pushModelOdata[j].kbetr * pushModelOdata[j].kpein) - (parseFloat(pushModelOdata[j].kbetr) -
											(((100 -
												this.discountValue) / 100) * parseFloat(pushModelOdata[j].kbetr))) *
										parseFloat(pushModelOdata[j].kpein)).toFixed(2);
									pushModel.updateBindings(true);
								} else {
									tot += pushModelOdata[j].rRotal;

									if (pushModelOdata[j].discountTotal === undefined) {
										discountTot = 0;
										pushModel.getData()[j].lTotal = parseFloat(pushModelOdata[j].kbetr * pushModelOdata[j].kpein).toFixed(2);
										pushModel.updateBindings(true);
									} else {
										discountTot += parseFloat(pushModelOdata[j].discountTotal);
										pushModelOdata[j].lTotal = parseFloat((pushModelOdata[j].kbetr * pushModelOdata[j].kpein) - parseFloat(pushModelOdata[j].discountTotal))
											.toFixed(2);
										pushModel.updateBindings(true);
									}

									finalTOT += (parseFloat(((this.percentage / 100) * pushModelOdata[j].rRotal).toFixed(2)) + pushModelOdata[
										j].rRotal);
									finalTax += parseFloat(((this.percentage / 100) * pushModelOdata[j].rRotal).toFixed(2));

								}


							}
							var Total = Math.round(tot * 100) / 100;
							var finalT = Math.round(finalTOT * 100) / 100;

						} else {
							var tot = 0;
							var finalTOT = 0;
							var finalTax = 0;
							var discountTot = 0;
							for (var j = 0; j < pushModelOdata.length; j++) {

								if (this.discountValue !== "0") {
									tot += pushModelOdata[j].rRotal - ((this.discountValue / 100) * pushModelOdata[j].rRotal);
									discountTot += (parseFloat(pushModelOdata[j].kbetr) - (((100 - this.discountValue) / 100) * parseFloat(pushModelOdata[j].kbetr))) *
										parseFloat(pushModelOdata[j].kpein);

									finalTOT += (parseFloat(((this.percentage / 100) * pushModelOdata[j].rRotal).toFixed(2)) + pushModelOdata[j].rRotal) - ((this.discountValue /
										100) * (parseFloat(((this.percentage / 100) * pushModelOdata[j].rRotal).toFixed(2)) + pushModelOdata[j].rRotal));
									finalTax += parseFloat(((this.percentage / 100) * pushModelOdata[j].rRotal).toFixed(2)) - ((this.discountValue / 100) *
										parseFloat(((this.percentage / 100) * pushModelOdata[j].rRotal).toFixed(2)));
									pushModel.getData()[j].lTotal = parseFloat((pushModelOdata[j].kbetr * pushModelOdata[j].kpein) - (parseFloat(pushModelOdata[j].kbetr) -
											(((
												100 - this.discountValue) / 100) * parseFloat(pushModelOdata[j].kbetr))) *
										parseFloat(pushModelOdata[j].kpein)).toFixed(2);
									pushModel.updateBindings(true);
								} else {
									tot += pushModelOdata[j].rRotal;
									if (pushModelOdata[j].discountTotal === undefined) {
										discountTot = 0;
										pushModel.getData()[j].lTotal = (pushModelOdata[j].kbetr * pushModelOdata[j].kpein);
										pushModel.updateBindings(true);
									} else {
										discountTot += parseFloat(pushModelOdata[j].discountTotal);
										pushModel.getData()[j].lTotal = parseFloat((pushModelOdata[j].kbetr * pushModelOdata[j].kpein) - parseFloat(pushModelOdata[j].discountTotal))
											.toFixed(2);
										pushModel.updateBindings(true);
									}

									finalTOT += (parseFloat(((this.percentage / 100) * pushModelOdata[j].rRotal).toFixed(2)) + pushModelOdata[
										j].rRotal);
									finalTax += parseFloat(((this.percentage / 100) * pushModelOdata[j].rRotal).toFixed(2));
									//	pushModel.getData().lTotal =	(pushModelOdata[j].kbetr * pushModelOdata[j].kpein) - ((parseFloat(pushModelOdata[j].kbetr) - (((100 - this.discountValue)  / 100) * parseFloat(pushModelOdata[j].kbetr))) * parseFloat(pushModelOdata[j].kpein));

								}

							}
							var Total = parseFloat(tot);
							var finalT = parseFloat(tot + finalTax).toFixed(2);

						}

						posTableModel.setProperty("/total", Math.round(Total * 100) / 100);
						posTableModel.setProperty("/finalTotal", finalT);
						posTableModel.setProperty("/discountTotal", Math.round(discountTot * 100) / 100);


						posTableModel.setProperty("/tax", parseFloat(finalTax).toFixed(2));
						var Tax = posTableModel.getProperty("/tax");


						// Nothing has changed in this method just added the new updated totals code

					//	var pushModel = context.getView().getModel("pushModel");*/
				var tableItems = pushModel.getProperty("/");
				var subTotals = 0;
				var totalDiscountAmount = 0;
				var totalTaxAmount = 0;
				if (tableItems && tableItems.length > 0) {
					$.each(tableItems, function(index, value) {
						if (value) {
							//	subTotals = subTotals + parseFloat(value.itemSubTotal);
							//							subTotals = parseFloat(parseFloat(subTotals) + (parseFloat(value.lTotal) * parseFloat(value.kpein))).toFixed(2);
							subTotals = parseFloat(parseFloat(subTotals) + (parseFloat(value.lTotal).toFixed(2) * parseFloat(value.kpein)));
							if (value.discount) {
								// Adding total to the dicount field also
								//	totalDiscountAmount =totalDiscountAmount+ value.lTotal*(value.discount/100);
								totalDiscountAmount = totalDiscountAmount + (value.lTotal * (value.discount / 100) * value.kpein);
							}
							totalTaxAmount = totalTaxAmount + parseFloat(value.taxAmount);
						}
					});
				}

				posTableModel.setProperty("/total", parseFloat(subTotals).toFixed(2));
				posTableModel.setProperty("/finalTotal", parseFloat(parseFloat(subTotals) + parseFloat(totalTaxAmount) - parseFloat(
					totalDiscountAmount)).toFixed(2));
				//posTableModel.setProperty("/finalTotal", parseFloat(parseFloat(subTotals)));
				posTableModel.setProperty("/discountTotal", parseFloat(totalDiscountAmount).toFixed(2));
				posTableModel.setProperty("/tax", parseFloat(totalTaxAmount).toFixed(2));
				//var Tax = posTableModel.getProperty("/tax");
				posTableModel.updateBindings(true);
				pushModel.updateBindings(true);
			},
			onQuantityChange: function(evt) {
				var me = this;
				var pushModel = this.getView().getModel("pushModel");
				var quantityObj = evt.getSource().getBindingContext("pushModel").getObject();
				var quantityVal = quantityObj.kpein;
				if (quantityVal !== "" && quantityVal !== undefined) {
					// Updating tax amount and sub total
					//amount afterDiscount
					quantityObj["amountAfterDisc"] = me.calculateAmountAfterDisc(quantityObj);
					var calCulatedTaxAmount = me.onTaxCalculate(parseInt(me.percentage), quantityObj["amountAfterDisc"], "");
					//if(value.discount&&value.discount!==""&&value.discount!==0){
					quantityObj["taxAmount"] = parseFloat(calCulatedTaxAmount * quantityVal).toFixed(2);
					//	var itemSubTotal = me.calculateDiscount(quantityObj);
					quantityObj["itemSubTotal"] = me.calculateDiscount(quantityObj);
				}
				// updating sub totals
				pushModel.updateBindings();
				me.onQuantitySubmit();
			},

			onPaymentPress: function() {
				if (!this._PaymentPOS) {
					this._PaymentPOS = sap.ui.xmlfragment("PosClient.fragment.PaymentPOS", this);
					this.getView().addDependent(this._PaymentPOS);
				}
				this._PaymentPOS.open();

				var posvisibleModel = this.getOwnerComponent().getModel("posvisibleModel");
				//	posvisibleModel.setProperty("/paymentButton", false);
				//	posvisibleModel.setProperty("/finishSaleButton", true);
				posvisibleModel.setProperty("/saveAsQuoteButton", false);
				posvisibleModel.setProperty("/cancelSaleButton", false);
				posvisibleModel.setProperty("/backToSaleButton", true);
			},

			onPaymentAccept: function() {
				var posTableModel = this.getOwnerComponent().getModel("posTableModel");
				var total = posTableModel.getProperty("/finalTotal");
				var paymentModel = this.getOwnerComponent().getModel("posTableModel");

				var paymentEnableModel = this.getOwnerComponent().getModel("paymentEnableModel");
				var bank = paymentEnableModel.getProperty("/bank");
				var card = paymentEnableModel.getProperty("/card");
				var cash = paymentEnableModel.getProperty("/cash");

				var bankValue = sap.ui.getCore().byId("idBankValue").getValue();
				if (bankValue === "") {
					bankValue = 0;
				}
				var cardValue = sap.ui.getCore().byId("idCardValue").getValue();
				if (cardValue === "") {
					cardValue = 0;
				}
				var cashValue = sap.ui.getCore().byId("idCashValue").getValue();
				if (cashValue === "") {
					cashValue = 0;
				}

				var valueTotal = parseFloat(bankValue) + parseFloat(cardValue) + parseFloat(cashValue);
				/*if (bank === true) {
					paymentModel.setProperty("/amount", bankValue);
				} else if (card === true) {
					paymentModel.setProperty("/amount", cardValue);
				} else if (cash === true) {
					paymentModel.setProperty("/amount", cashValue);
				}*/
				//	var paymentTotal = parseFloat(paymentModel.getProperty("/amount")).toFixed(2);
				var paymentTotal = valueTotal;
				//	total = parseInt(total);
				//	paymentTotal = parseInt(paymentTotal);
				if (total > paymentTotal) {
					MessageBox.show("Amount Paid is less then total", {

						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error",
						actions: [sap.m.MessageBox.Action.OK],

					});
				} else if (total < paymentTotal) {
					var me = this;
					var change = paymentTotal - total;
					var changeValue = parseFloat(change).toFixed(2);
					MessageBox.show('Amount Paid BGN' + '   ' + total + '   Change BGN' + '   ' + changeValue + '' + '', {

						icon: sap.m.MessageBox.Icon.INFORMATION,
						title: "Information",
						actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
						onClose: function(sAction) {
							me._PaymentPOS.open();
							var posvisibleModel = this.getOwnerComponent().getModel("posvisibleModel");
							posvisibleModel.setProperty("/paymentButton", false);
							posvisibleModel.setProperty("/finalPaymentButton", false);
						}
					});
					this._PaymentPOS.close();
					var posvisibleModel = this.getOwnerComponent().getModel("posvisibleModel");
					posvisibleModel.setProperty("/paymentButton", false);
					posvisibleModel.setProperty("/finalPaymentButton", true);
				} else {
					this._PaymentPOS.close();
					var posvisibleModel = this.getOwnerComponent().getModel("posvisibleModel");
					posvisibleModel.setProperty("/paymentButton", false);
					posvisibleModel.setProperty("/finalPaymentButton", true);
				}
			},

			onPaymentCancel: function() {
				var posvisibleModel = this.getOwnerComponent().getModel("posvisibleModel");
				posvisibleModel.setProperty("/paymentButton", true);
				posvisibleModel.setProperty("/finishSaleButton", false);
				posvisibleModel.setProperty("/saveAsQuoteButton", true);
				posvisibleModel.setProperty("/cancelSaleButton", true);
				posvisibleModel.setProperty("/backToSaleButton", false);
				posvisibleModel.setProperty("/finalPaymentButton", false);
				this._PaymentPOS.close();
			},
			onSaveAsQuote: function() {
				MessageToast.show("Saved Quote 1 ");
			},

			onProductsDelete: function(oEvent) {
				var path = oEvent.getSource().getBindingContext("pushModel").sPath.split("/");
				var dataModel = this.getView().getModel("pushModel");
				var Data = dataModel.getData();
				Data.splice(path[path.length - 1], 1);
				dataModel.updateBindings(true);
				this.onQuantitySubmit();
			},

			onSelectMoreMaterials: function(evt) {
				selObj = evt.getSource().getSelectedItem().getBindingContext("moreModel").getObject();
			},

			onOKMoreMaterials: function(evt) {

				var me = this;
				var aContexts = evt.getParameter("selectedContexts");
				var selectedModel = me.getOwnerComponent().getModel("selectedModel");
				var pushModel = this.getView().getModel("pushModel");
				if (aContexts && aContexts.length) {
					MessageToast.show("You have chosen " + aContexts.map(function(oContext) {
						var selectedMaterial = oContext.getObject().matnr;

						selectedModel.setProperty("/selectedMaterial", selectedMaterial);
						return oContext.getObject().matnr;

						pushModel.oData = oContext.getObject();

					}).join(", "));

					//    me._materialData();
					//		var selectedCustomer =  oContext.getObject().name_org;
					//		var selectedCustomerModel = this.getOwnerComponent().getModel("selectedCustomerModel");
					//		selectedCustomerModel.setProperty("/selectedCustomer", selectedCustomer);

				}

				/*	var selObj = evt.mParameters.selectedItem.oBindingContexts.moreModel.getObject();
					if (pushModel.oData[0] !== undefined) {
						var oArray = pushModel.oData;
					} else {
						var oArray = [];
					}*/
				var oArray = [];
				var selObj = evt.getParameters().selectedItem.getBindingContext("moreModel").getObject();
				if (pushModel.getProperty("/")) {
					oArray = pushModel.getProperty("/");
				}
				if (!Array.isArray(oArray)) {
					oArray = [];
				}
				oArray.push(selObj);
				$.each(oArray, function(index, value) {
					if (value) {
						//	value.discount = parseFloat(discountPercent);
						//if(value.discount&&value.discount!==""&&value.discount!==0){
						//amount afterDiscount
						value["amountAfterDisc"] = me.calculateAmountAfterDisc(value);
						value["taxAmount"] = me.onTaxCalculate(parseInt(me.percentage), value["amountAfterDisc"], value.kpein);
						//if(value.discount&&value.discount!==""&&value.discount!==0){
						value["itemSubTotal"] = me.calculateDiscount(value);
					}
				});
				pushModel.setProperty("/", oArray);
				//	this._moreDialog.close();
				this.onQuantitySubmit();
				var selectedModel = this.getOwnerComponent().getModel("selectedModel");
				selectedModel.setProperty("/selectedMaterial", "");
				//pushModel.getProperty("/").push(selObj);
				//	sap.ui.getCore().getModel("pushModel").getProperty("/").push(selObj);
			},

			onCancelMoreMaterials: function() {
				this._moreDialog.open();
			},

			onUserClick: function(oEvent) {
				if (!this._oPopover) {
					this._oPopover = sap.ui.xmlfragment("PosClient.fragment.BackPopOver", this);
					this.getView().addDependent(this._oPopover);
				}
				this._oPopover.openBy(oEvent.getSource());
			},

			onBackLaunchpad: function() {
				this.getOwnerComponent().getRouter().navTo("launchPad");
			},
			onUserNamePress: function(oEvent) {
				var oPopover = new sap.m.Popover({
					showHeader: false,
					placement: sap.m.PlacementType.Bottom,
					content: [
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
			logoutUser: function() {

				this.getOwnerComponent().getRouter().navTo("login");
			},
			onNavBack: function() {
				var oHistory = History.getInstance();
				var sPreviousHash = oHistory.getPreviousHash();

				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("launchPad", true);
				}
			},
			gotoNewPOSS: function() {
				this.getOwnerComponent().getRouter().navTo("pos");
			},
			onPressTax: function(evt) {
				var selectVal = evt.getParameters().selected;
				var ovisibleModel = this.getView().getModel("posBtnVisibleModel");
				var taxComboBox = this.getView().byId("idTaxComboBox");
				for (var i = 0; i < taxComboBox.getItems().length; i++) {
					if (taxComboBox.getItems()[i].getText() === "20% regular sales/sales receipts") {
						taxComboBox.setSelectedKey(taxComboBox.getItems()[i].getKey());
						this.percentage = taxComboBox.getItems()[i].getKey();

					}
				}

				if (selectVal) {
					this.onTaxChange();
					ovisibleModel.setProperty("/taxDropDown", true);
					return ovisibleModel.refresh();
				} else {
					this.percentage = 0;
					this.onTaxChange();
					ovisibleModel.setProperty("/taxDropDown", false);
					return ovisibleModel.refresh();
				}

			},

			onFinalPaymentPress: function() {
				var sendModel = this.getView().getModel("sendModel");
				var sendModelData = sendModel.getData();
				var storeModel = this.getView().getModel("storeModel");
				var posTableModel = this.getView().getModel("posTableModel");
				var selectedModel = this.getView().getModel("selectedModel");
				var customerShipModel = this.getView().getModel("customerShipModel");
				var date = new Date();
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				if (month < 10) {
					month = "0" + month;
				}
				var day = date.getDate();
				if (day < 10) {
					day = "0" + day;
				}
				//	var fulldate = year + month + day;
				var fulldate = year + "-" + month + "-" + day;

				var hours = date.getHours();
				if (hours < 10) {
					hours = "0" + hours;
				}

				var minutes = date.getMinutes();
				if (minutes < 10) {
					minutes = "0" + minutes;
				}

				var seconds = date.getSeconds();
				if (seconds < 10) {
					seconds = "0" + seconds;
				}

				var fullHHMMSS = hours.toString() + ":" + minutes.toString() + ":" + seconds.toString();

				sendModelData.erdat = fulldate;
				sendModelData.ernam = storeModel.getData().selectedID;
				sendModelData.erzet = fullHHMMSS;
				sendModelData.kpein = "abc";
				sendModelData.kschl = "abcd";
				sendModelData.mandt = "300";
				sendModelData.mwskz = "01";
				sendModelData.netwr = parseFloat(posTableModel.getData().finalTotal);
				sendModelData.partner = selectedModel.getData().selectedCustomerNumber;
				sendModelData.pmnt = "abcd";
				sendModelData.posid = this.getView().byId("idPOSValue").getText();
				//	sendModelData.shipto = customerShipModel.getData().id.toString();
				sendModelData.shipto = "0000100066";
				sendModelData.text1_e = "abcd";
				sendModelData.text1_l = "abcd";
				sendModelData.vatrate = 1234;
				sendModelData.vbeln = "UK1";
				sendModelData.v_text1_e = "abcd";
				sendModelData.v_text1_l = "abcd";
				sendModelData.waerk = "abcd";

				sendModelData.werks = storeModel.getData().selectedID;

				sendModel.updateBindings(true);

				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var orderHeadURL = oBundle.getText("orderHeadURL");

				var incrementModel = this.getOwnerComponent().getModel("incrementModel");
				// Date formatting
				/*	var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "YYYY-MM-DD" });
			//	var dateFormatted = dateFormat.format(fulldate);
				     var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
      pattern: "KK:mm:ss a"
    });*/
				// var formatedTime = timeFormat.format(fullHHMMSS);
				var orderHeadPostData = {
					"abgru": "",
					//	"auart": "",
					"auart": "Z1OS",
					"belnr": "",
					"damnt": isNaN(parseFloat(posTableModel.getData().discount)) ? 0 : parseFloat(posTableModel.getData().discount),
					"erdat": fulldate,
					//	"erdat": dateFormatted,
					"ernam": storeModel.getData().selectedID,
					"erzet": fullHHMMSS,
					//	"erzet": formatedTime,
					"kpein": "01",
					"kschl": "VR00",
					//	"mandt": customerShipModel.getData().mandt !== undefined ? customerShipModel.getData().mandt.toString() : "",
					"mandt": "",
					"mwskz": "01",
					//	"netwr": parseFloat(posTableModel.getData().total),
					"netwr": parseFloat(posTableModel.getData().finalTotal),

					"partner": selectedModel.getData().selectedCustomerNumber,
					"pmnt": posTableModel.getProperty("/paymentType"),
					"posid": incrementModel.getData().posnr,
					"shipto": customerShipModel.getData().shipto !== undefined ? customerShipModel.getData().shipto.toString() : "",
					"tamnt": isNaN(parseFloat(posTableModel.getData().tax)) ? 0 : parseFloat(posTableModel.getData().tax),
					"traid": "",
					"text1_e": "", // Populating
					"text1_l": "",
					"v_text1_e": "",
					"v_text1_l": "",
					"vatrate": isNaN(parseFloat(posTableModel.getData().tax)) ? 0 : parseFloat(posTableModel.getData().tax),
					"vbeln": incrementModel.getData().next_vbeln,
					"vbtyp": "C",
					"waerk": "BGN",
					"werks": "1110",
					//					"werks": storeModel.getData().selectedID,
					"zdcmpl": "",
					"zlcard": "",
					"zlisu": "",
					"zuser": ""
				};
				var pushModel = this.getView().getModel("pushModel");
				var pushModelData = pushModel.getData();
				var arrayOfItems = [];
				var initialPosnrVal = 10;
				var updatedPosnrVal = 0;

				for (var i = 0; i < pushModelData.length; i++) {
					updatedPosnrVal = updatedPosnrVal + initialPosnrVal;
					var orderItemsPostData = {
						"abgru": "",
						"barum": "",
						//						"taxamt": isNaN(parseFloat(posTableModel.getData().tax)) ? 0 : parseFloat(posTableModel.getData().tax),
						//	"dcont": isNaN(parseFloat(posTableModel.getData().discount)) ? 0 : parseFloat(posTableModel.getData().discount),
						"taxamt": isNaN(parseFloat(pushModelData[i].taxAmount)) ? 0 : parseFloat(pushModelData[i].taxAmount),
						"dcont": isNaN(parseFloat(pushModelData[i].discount)) ? 0 : parseFloat(pushModelData[i].discount),
						//						"dcont": pushModelData[i].discount,
						"erzet": fullHHMMSS,
						"kwmeng": pushModelData[i].kpein,
						"laeda": fulldate,
						"lifnr": "",
						"maktx_e": pushModelData[i].maktx_e,
						"maktx_l": pushModelData[i].maktx_l,
						"mandt": "300",
						"matkl": pushModelData[i].matkl,
						"matnr": pushModelData[i].matnr,
						"meins": pushModelData[i].kmein,
						//						"netwr": isNaN(parseFloat(posTableModel.getData().finalTotal)) ? 0 : parseFloat(posTableModel.getData().finalTotal),
						"netwr": isNaN(parseFloat(pushModelData[i].itemSubTotal)) ? 0 : parseFloat(pushModelData[i].itemSubTotal),
						//						"netwr": pushModelData[i].lTotal,
						"posid": incrementModel.getData().posnr,
						"posnr": updatedPosnrVal,
						"uprce": pushModelData[i].kbetr,
						"vbeln": incrementModel.getData().next_vbeln,
						// "waerk": pushModelData[i].waerk,
						"waerk": "BGN",
						"werks": "1110",
						//						"werks": this.getOwnerComponent().getModel("storeModel").getData().selectedID,
						"zcomment": "",
						"zmatnr": ""
					};
					arrayOfItems.push(orderItemsPostData);
				}

				var orderItemURL = oBundle.getText("orderItemURL");
				var me = this;

				jQuery.ajax({
					type: 'POST',
					url: orderHeadURL,
					data: orderHeadPostData,
					success: function(data) {
						// Adding payments related code
						var paymentsPayload = [];
						// Pushing objects based on the payment type
						var paymentObject = {
							ccard: "",
							erdat: fulldate,
							erzet: fullHHMMSS,
							pmnt: posTableModel.getProperty("/paymentType"),
							//									"posid": this.getView().byId("idPOSValue").getText(),
							"posid": incrementModel.getData().posnr,
							"posnr": incrementModel.getData().posnr,
							rftxn: "",
							text1_e: "",
							text1_l: "",
							"vbeln": incrementModel.getData().next_vbeln,
							"waerk": "BGN",
							"werks": "1110",
							//							"werks": me.getOwnerComponent().getModel("storeModel").getData().selectedID,
							zuser: "",
							amount: 0,
							mandt: 0
						};

						var dupPaymentsObject = $.extend({}, paymentObject);
						if (posTableModel.getProperty("/paymentType") === "Card") {
							dupPaymentsObject["ccard"] = "";
							//	paymentObject["amount"] =
							paymentsPayload.push($.extend({}, dupPaymentsObject));
							//	}
						} else if (posTableModel.getProperty("/paymentType") === "Mix") {
							dupPaymentsObject["ccard"] = "";
							var billTotal_s = parseFloat(posTableModel.getProperty("/finalTotal"));
							var cardVal1_s = parseFloat(me.getView().byId("idCardValue").getValue());
							var voucherVal_s = parseFloat(me.getView().byId("idVouchersValue").getValue());
							var bankVal_s = parseFloat(me.getView().byId("idBankValue").getValue());
							var change_s = cardVal1_s + voucherVal_s + bankVal_s;

							// Checking if cash/credit/vouchers amounts are available or not.
							if (me.getView().byId("idCashValue").getValue() !== "" && me.getView().byId("idCashValue").getValue() !== 0) {
								//								dupPaymentsObject["amount"] = me.getView().byId("idCashValue").getValue();
								dupPaymentsObject["amount"] = billTotal_s - change_s;
								dupPaymentsObject["pmnt"] = "Cash";
								paymentsPayload.push($.extend({}, dupPaymentsObject));
							}
							if (me.getView().byId("idCardValue") !== "" && me.getView().byId("idCardValue") !== 0) {
								//								dupPaymentsObject["amount"] = me.getView().byId("idCardValue").getValue();
								dupPaymentsObject["amount"] = cardVal1_s;
								dupPaymentsObject["pmnt"] = "Card";
								paymentsPayload.push($.extend({}, dupPaymentsObject));
							}
							if (me.getView().byId("idVouchersValue") !== "" && me.getView().byId("idVouchersValue") !== 0) {
								//								dupPaymentsObject["amount"] = me.getView().byId("idVouchersValue").getValue();
								dupPaymentsObject["amount"] = voucherVal_s;
								dupPaymentsObject["pmnt"] = "Vouc";
								paymentsPayload.push($.extend({}, dupPaymentsObject));
							}
							if (me.getView().byId("idBankValue") !== "" && me.getView().byId("idBankValue") !== 0) {
								//								dupPaymentsObject["amount"] = me.getView().byId("idBankValue").getValue();
								dupPaymentsObject["amount"] = bankVal_s;
								dupPaymentsObject["pmnt"] = "Bank";
								paymentsPayload.push($.extend({}, dupPaymentsObject));
							}
						} else {
							var total_c = parseFloat(posTableModel.getProperty("/finalTotal"));
							dupPaymentsObject["amount"] = total_c;

							//							dupPaymentsObject["amount"] = me.getView().byId("cashInput").getValue() - me.getView().getModel("posTableModel").getProperty(
							//								"/changeValue");
							paymentsPayload.push($.extend({}, dupPaymentsObject));
						}
						// updating posnrval by looping through payments object
						initialPosnrVal = 10;
						updatedPosnrVal = 0;
						$.each(paymentsPayload, function(index, value) {
							if (value) {
								updatedPosnrVal = updatedPosnrVal + initialPosnrVal;
								value["posnr"] = updatedPosnrVal;
							}
						});
						var paymentURL = oBundle.getText("paymentURL");
						jQuery.ajax({
							type: "POST",
							url: paymentURL,
							data: JSON.stringify(paymentsPayload),
							contentType: "application/json",
							//data: orderItemsPostData,
							success: function(data) {},
							error: function(error) {
								var sDetails = error.responseText;
								jQuery.sap.log.error(sDetails);
								MessageBox.show("An error occurred  :   " + sDetails, {
									icon: sap.m.MessageBox.Icon.ERROR,
									title: "Error",
									actions: [sap.m.MessageBox.Action.OK]
								});
							}

						});

						jQuery.ajax({
							type: "POST",
							url: orderItemURL,
							data: JSON.stringify(arrayOfItems),
							contentType: "application/json",
							//data: orderItemsPostData,
							success: function(data) {
								// var incrementModel = me.getOwnerComponent().getModel("incrementModel");
								// var vbeln = parseInt(me.getOwnerComponent().getModel("incrementModel").getProperty("/vbeln"));
								// var posnr = parseInt(me.getOwnerComponent().getModel("incrementModel").getProperty("/posnr"));
								// incrementModel.setProperty("/vbeln", vbeln + 1);
								// incrementModel.setProperty("/posnr", posnr + 10);
								MessageToast.show("Printing Fiscal Receipt. Please Wait.....");
								window.location.reload();
							},

							error: function(error) {
								var sDetails = error.responseText;
								jQuery.sap.log.error(sDetails);
								//	that._oErrorHandler._showServiceError(sDetails);
								MessageBox.show("An error occurred  :   " + sDetails, {
									icon: sap.m.MessageBox.Icon.ERROR,
									title: "Error",
									actions: [sap.m.MessageBox.Action.OK]
								});
							}

						});
					},
					error: function(e) {
						MessageToast.show("Error occured while storing main order information");
					}

				});

				// var orderItemsPostData = {
				// 	"barum": "ABC",
				// 	"erzet": fullHHMMSS,
				// 	"kwmeng": parseInt(pushModel.getData()[0].kpein),
				// 	"laeda": fulldate,
				// 	"lifnr": "abc",
				// 	"maktx_e": "abc",
				// 	"maktx_l": pushModel.getData()[0].maktx_l,
				// 	"mandt": "300",
				// 	"matkl": "abc",
				// 	"matnr": pushModel.getData()[0].matnr,
				// 	"meins": pushModel.getData()[0].kmein,
				// 	"netwr": pushModel.getData()[0].rRotal,
				// 	"posid": this.getView().byId("idPOSValue").getText(),
				// 	"posnr": incrementModel.getData().posnr,
				// 	"vbeln": incrementModel.getData().vbeln,
				// 	"waerk": "abcd",
				// 	"werks": this.getOwnerComponent().getModel("storeModel").getData().selectedID
				// };

			},

			onDiscountOpen: function() {
				var me = this;
				if (!me._discountDialog) {
					me._discountDialog = sap.ui.xmlfragment("PosClient.fragment.DiscountPOS", me);
					me.getView().addDependent(me._discountDialog);
				}
				me._discountDialog.open();
			},

			onDiscountCancel: function() {
				this._discountDialog.close();
			},
			onApplyDiscount: function() {
				var me = this;
				// Method to apply the mass discount --- @Arjun
				// updating the table items value with the given discount percentage
				var discountPercent = sap.ui.getCore().byId("idDiscountInput").getValue();
				var pushModel = this.getView().getModel("pushModel");
				var tableItems = pushModel.getProperty("/");
				if (discountPercent && discountPercent !== "") {
					$.each(tableItems, function(index, value) {
						if (value) {
							value.discount = parseFloat(discountPercent);
							//if(value.discount&&value.discount!==""&&value.discount!==0){
							//amount afterDiscount
							value["amountAfterDisc"] = me.calculateAmountAfterDisc(value);
							value["taxAmount"] = me.onTaxCalculate(parseInt(me.percentage), value["amountAfterDisc"], value.kpein);
							//if(value.discount&&value.discount!==""&&value.discount!==0){
							value["itemSubTotal"] = me.calculateDiscount(value);
						}
					});
				}
				this.onQuantitySubmit();
				pushModel.updateBindings();
				this._discountDialog.close();
			},

			onTaxChange: function(evt) {
				var me = this;
				var posTableModel = this.getOwnerComponent().getModel("posTableModel");
				var pushModel = this.getOwnerComponent().getModel("pushModel");
				if (evt) {
					this.percentage = parseInt(evt.getSource().getSelectedItem().getKey());
				}
				// Updating the table items  tax value with percentage with the new tax value
				var tableItems = pushModel.getProperty("/");
				if (tableItems && tableItems.length > 0)
					$.each(tableItems, function(index, value) {
						if (value) {
							//amount afterDiscount
							value["amountAfterDisc"] = me.calculateAmountAfterDisc(value);
							value["taxAmount"] = me.onTaxCalculate(parseInt(me.percentage), value["amountAfterDisc"], value.kpein);
							//if(value.discount&&value.discount!==""&&value.discount!==0){
							value["itemSubTotal"] = me.calculateDiscount(value);
						}
					});
				this.onQuantitySubmit();
				pushModel.updateBindings();
			},

			/*onPaymentModeSelect: function(evt) {
				var paymentModel = this.getOwnerComponent().getModel("paymentModel");
				var selectedMode = evt.getSource().getSelectedButton().getText();
				var paymentEnableModel = this.getView().getModel("paymentEnableModel");
				if (selectedMode === "Bank") {
					paymentEnableModel.setProperty("/bank", true);
					paymentEnableModel.setProperty("/card", false);
					paymentEnableModel.setProperty("/cash", false);
				} else if (selectedMode === "Card") {
					paymentEnableModel.setProperty("/bank", false);
					paymentEnableModel.setProperty("/card", true);
					paymentEnableModel.setProperty("/cash", false);
				} else if (selectedMode === "Cash") {
					paymentEnableModel.setProperty("/bank", false);
					paymentEnableModel.setProperty("/card", false);
					paymentEnableModel.setProperty("/cash", true);
				}
			},*/

			onBankselect: function(evt) {
				var paymentEnableModel = this.getView().getModel("paymentEnableModel");
				var selected = evt.getSource().getSelected();
				if (selected === true) {
					paymentEnableModel.setProperty("/bank", true);
				} else {
					paymentEnableModel.setProperty("/bank", false);
				}
			},

			onCardselect: function(evt) {
				var paymentEnableModel = this.getView().getModel("paymentEnableModel");
				var selected = evt.getSource().getSelected();
				if (selected === true) {
					paymentEnableModel.setProperty("/card", true);
				} else {
					paymentEnableModel.setProperty("/card", false);
				}
			},

			onCashselect: function(evt) {
				var paymentEnableModel = this.getView().getModel("paymentEnableModel");
				var selected = evt.getSource().getSelected();
				if (selected === true) {
					paymentEnableModel.setProperty("/cash", true);
				} else {
					paymentEnableModel.setProperty("/cash", false);
				}
			},
			onVoucherselect: function(evt) {
				var paymentEnableModel = this.getView().getModel("paymentEnableModel");
				var selected = evt.getSource().getSelected();
				if (selected === true) {
					paymentEnableModel.setProperty("/vouchers", true);
				} else {
					paymentEnableModel.setProperty("/vouchers", false);
				}
			},
			showNumpad: function(evt) {
				var posBtnVisibleModel = this.getOwnerComponent().getModel("posvisibleModel");
				if (evt.getSource().getPressed()) {
					posBtnVisibleModel.setProperty("/numpad", true);
				} else {
					posBtnVisibleModel.setProperty("/numpad", false);
				}
			},
			onPrintForm: function() {
				this.onFinalPaymentPress();
				this.getOwnerComponent().getRouter().navTo("PrintForm");
			},
			onCashPress: function(evt) {
				if (!this._cashPopUp) {
					this._cashPopUp = sap.ui.xmlfragment(this.getView().getId(), "PosClient.fragment.CashPopOver", this);
					this.getView().addDependent(this._cashPopUp);
				}
				var posTableModel = this.getOwnerComponent().getModel("posTableModel");
				posTableModel.setProperty("/changeValue", "");
				posTableModel.setProperty("/cashChangeType", "");
				this.getView().byId("cashErrMsg").setVisible(false);
				this.getView().byId("change").setType("Information");
				this.getView().byId("cashInput").setValue("");
				// Setting the payment type property in model @Arjun
				var paymentType = evt.getSource().getCustomData()[0].getKey();
				posTableModel.setProperty("/paymentType", "Cash");
				posTableModel.updateBindings();
				this._cashPopUp.open();
			},

			cashValidation: function() {
				var posTableModel = this.getOwnerComponent().getModel("posTableModel");
				var errMsg = this.getView().byId("cashErrMsg");
				var errTxt = "";
				var total = parseFloat(posTableModel.getProperty("/finalTotal"));
				var inputVal = parseFloat(this.getView().byId("cashInput").getValue());

				if (!inputVal) {
					errTxt = this.getResourceText(this, "pleaseEnterPaymentAmount");
					errMsg.setVisible(true);
					errMsg.setText(errTxt);
					errMsg.setType("Error");
					return false;
				}
				var changeVal = (inputVal - total).toFixed(2);
				posTableModel.setProperty("/changeValue", changeVal);
				if (total < inputVal) {
					errTxt = this.getResourceText(this, "returnChangeToCustomer");
					//errTxt = "Return change to customer";
					errMsg.setVisible(true);
					errMsg.setText(errTxt);
					errMsg.setType("Warning");
					this.getView().byId("change").setType("Success");
					return true;
				} else if (total > inputVal) {
					errTxt = this.getResourceText(this, "cashPaidIsLessThanTotalAmount");
					// errTxt = "Cash paid is less than total amount";
					errMsg.setVisible(true);
					errMsg.setText(errTxt);
					this.getView().byId("change").setType("Error");
					return false;
				} else if (total === inputVal) {
					errMsg.setVisible(false);
					this.getView().byId("change").setType("Information");
					return true;
				}

			},
			onCashAccept: function(evt) {
				//this.onPaymentAccept();
				var cashValidate = this.cashValidation();
				if (cashValidate) {
					this.onFinalPaymentPress();
				} else {
					return false;
				}
			},
			onCashCancel: function() {
				this._cashPopUp.close();
				//this._cashPopUp.destroy();
			},
			onCardPress: function() {
				var posTableModel = this.getOwnerComponent().getModel("posTableModel");
				if (!this._cardPopUp) {
					this._cardPopUp = sap.ui.xmlfragment(this.getView().getId(), "PosClient.fragment.CardPopOver", this);
					this.getView().addDependent(this._cardPopUp);
				}
				posTableModel.setProperty("/paymentType", "Card");
				posTableModel.updateBindings();
				this._cardPopUp.open();
			},
			cardValidation: function() {
				var cardType = this.getView().byId("cardSelPayment").getSelectedKey();
				var trxRefNo = this.getView().byId("cardPayTrxRefNo").getValue();
				var errMsg = [];
				var concatErrMsg, errTxt;
				if (!cardType) {
					errTxt = this.getResourceText(this, "pleaseSelectCardType");
					errMsg.push(errTxt);
				}
				if (!trxRefNo) {
					errTxt = this.getResourceText(this, "pleaseEnterTransactionRefNo");
					errMsg.push(errTxt);
				}
				if (errMsg.length > 0) {
					concatErrMsg = errMsg.join(",");
					this.getView().byId("cardErrMsg").setVisible(true);
					this.getView().byId("cardErrMsg").setText(concatErrMsg);
					return false;
				} else {
					this.getView().byId("cardErrMsg").setVisible(false);
					return true;
				}
			},
			onCardAccept: function() {
				var cardValidate = this.cardValidation();
				if (cardValidate) {
					this.onFinalPaymentPress();
				} else {
					return false;
				}

			},
			onCardCancel: function() {
				this._cardPopUp.close();
			},
			onMixedPress: function() {
				var posTableModel = this.getOwnerComponent().getModel("posTableModel");
				posTableModel.setProperty("/paymentType", "Mix");
				posTableModel.updateBindings();
				if (!this._mixedPopUp) {
					this._mixedPopUp = sap.ui.xmlfragment(this.getView().getId(), "PosClient.fragment.MixedPopOver", this);
					this.getView().addDependent(this._mixedPopUp);
				}

				this.getView().byId("mixErrMsg").setVisible(false);
				this.getView().byId("mixErrMsg").setText("");
				var posTableModel = this.getOwnerComponent().getModel("posTableModel");
				posTableModel.setProperty("/mixChangeVal", "");
				this.getView().byId("mixChange").setType("Information");
				this._mixedPopUp.open();
			},
			onMixedCancel: function() {
				this._mixedPopUp.close();
			},
			mixedValidation: function() {
				var inputValue = parseFloat(this.getView().byId("idCashValue").getValue());
				var posTableModel = this.getOwnerComponent().getModel("posTableModel");
				var billTotal = parseFloat(posTableModel.getProperty("/finalTotal"));
				var cardVal = parseFloat(this.getView().byId("idCardValue").getValue());
				var voucherVal = parseFloat(this.getView().byId("idVouchersValue").getValue());
				var bankVal = parseFloat(this.getView().byId("idBankValue").getValue());
				var errMsg = this.getView().byId("mixErrMsg");
				var mixType = this.getView().byId("mixChange");
				var errTxt = "";
				if (!cardVal) {
					cardVal = 0;
				}
				if (!inputValue) {
					inputValue = 0;
				}
				if (!voucherVal) {
					voucherVal = 0;
				}
				if (!bankVal) {
					bankVal = 0;
				}
				if (inputValue === "" || inputValue === undefined) {
					errTxt = this.getResourceText(this, "pleaseEnterCash");
					//	errTxt = "Please enter cash";
					errMsg.setVisible(true);
					errMsg.setText(errTxt);
					mixType.setType("Error");
					return false;
				}
				//Negative Value Check for Cash
				if ((inputValue < 0) || (cardVal < 0) || (bankVal < 0) || (voucherVal < 0)) {
					errTxt = this.getResourceText(this, "Amount Can't be in Negative");
					// errTxt = "Cash should not be greater ";
					errMsg.setVisible(true);
					errMsg.setText(errTxt);
					mixType.setType("Error");
					//					return false;
					return false;
				}

				var sumOfValues = cardVal + voucherVal + bankVal;
				var totSum = inputValue + sumOfValues;
				// Removing negative sign for the change amount available
				var finalVal = 0;
				if (billTotal > totSum) {
					finalVal = billTotal - totSum;
				} else if (billTotal < totSum) {
					finalVal = totSum - billTotal;
				}

				finalVal = finalVal.toFixed(2);
				posTableModel.setProperty("/mixChangeVal", finalVal);
				if (totSum === 0) {
					errTxt = this.getResourceText(this, "pleaseEnterAmountInCardVoucherBank");
					// errTxt = "Please enter amount in Card/Voucher/Bank ";
					errMsg.setVisible(true);
					errMsg.setText(errTxt);
					mixType.setType("Error");
					return false;
				} else if (totSum < billTotal) {
					errTxt = this.getResourceText(this, "enteredAmountIsLessThanTotalAmount");
					// errTxt = "Entered amount is less than Total Amount ";
					errMsg.setVisible(true);
					errMsg.setText(errTxt);
					mixType.setType("Error");
					return false;
				} else if (inputValue > sumOfValues) {
					errTxt = this.getResourceText(this, "cashShouldNotBeGreater");
					// errTxt = "Cash should not be greater ";
					errMsg.setVisible(true);
					errMsg.setText(errTxt);
					mixType.setType("Error");
					return false;
				}
				// Error message if the change remained is greater than the cash value
				else if (inputValue > 0 && (finalVal > inputValue)) {
					errTxt = this.getResourceText(this, "changeShouldNotGreater");
					// errTxt = "Cash should not be greater ";
					errMsg.setVisible(true);
					errMsg.setText(errTxt);
					mixType.setType("Error");
					return false;
				}

				// Condition to check if there is no cash in that case change should not be there
				else if ((inputValue === "" || inputValue === 0) && finalVal > 0) {
					errTxt = this.getResourceText(this, "plsGiveEqAmt");
					// errTxt = "Cash should not be greater ";
					errMsg.setVisible(true);
					errMsg.setText(errTxt);
					mixType.setType("Error");
					return false;
				} else {
					mixType.setType("Success");
					errMsg.setVisible(false);
					return true;
				}
			},
			onMixedAccept: function() {
				var mixValidateValue = this.mixedValidation();
				if (mixValidateValue) {
					this.onFinalPaymentPress();
				} else {
					return false;
				}
			},
			getResourceText: function(oController, sKey) {
				var translatedText = oController.getView().getModel("i18n").getResourceBundle().getText(sKey);
				return translatedText;
			},
			/*
			 *** Method Invoked when discount changes at item level
			 */
			onDiscountChange: function(evt) {
				var itemLevelObj = evt.getSource().getBindingContext("pushModel").getObject();
				var discountPercent = parseInt(itemLevelObj.discount);
				if (isNaN(discountPercent)) {
					discountPercent = 0;
				}
				// updating tax value
				var totalAfterDiscount = parseFloat(itemLevelObj.lTotal - itemLevelObj.lTotal * (discountPercent / 100));
				var taxAfterDiscount = this.onTaxCalculate(this.percentage, totalAfterDiscount, "");
				//	var updatedItemSubTotal = parseFloat(itemLevelObj.lTotal-   itemLevelObj.lTotal*(discountPercent/100)+parseFloat(itemLevelObj.taxAmount)).toFixed(2);
				var updatedItemSubTotal = parseFloat(totalAfterDiscount + parseFloat(taxAfterDiscount)).toFixed(2);
				// updating tax amount also
				itemLevelObj.taxAmount = taxAfterDiscount * itemLevelObj.kpein;
				itemLevelObj.itemSubTotal = updatedItemSubTotal * itemLevelObj.kpein;
				// calling updatetotal method
				this.onQuantitySubmit();
			},
			onTaxCalculate: function(taxPercent, total, quantity) {
				if (taxPercent !== undefined && total !== undefined) {
					if (quantity === "") {
						return parseFloat(total * (taxPercent / 100)).toFixed(2);
					} else {
						return parseFloat((total * (taxPercent / 100)) * quantity).toFixed(2);
					}
				}
			},
			calculateDiscount: function(value) {
				var discount = 0;
				if (value.discount && value.discount !== "") {
					discount = parseInt(value.discount);
				}
				// updating tax after discount
				var updatedTotal = parseFloat(value.lTotal - value.lTotal * (discount / 100)).toFixed(2);
				return parseFloat((parseFloat(updatedTotal) + parseFloat(this.onTaxCalculate(this.percentage, updatedTotal, ""))) * value.kpein).toFixed(
					2);
			},
			calculateAmountAfterDisc: function(value) {
				var discount = 0;
				if (value.discount && value.discount !== "") {
					discount = parseInt(value.discount);
				}
				// updating tax after discount
				//	var updatedTotal = parseFloat(value.lTotal-  value.lTotal*(discount/100)).toFixed(2);
				return parseFloat(value.lTotal - value.lTotal * (discount / 100)).toFixed(2);
			},

			scanMaterialNumber: function(oEvent) {
				// https://blogs.sap.com/2017/10/19/barcode-scanning-with-device-camera-in-sapui5-applications-without-a-native-container/
				sap.ndc.BarcodeScanner.scan(
					function(mResult) {
						jQuery.sap.log.info("We got a bar code\n" +
							"Result: " + mResult.text + "\n" +
							"Format: " + mResult.format + "\n" +
							"Cancelled: " + mResult.cancelled);
					},
					function(Error) {
						jQuery.sap.log.info("Scanning failed: " + Error);
					}
				);
			},
			handleSuggest: function(oEvent) {
				var sTerm = oEvent.getParameter("suggestValue");
				var aFilters = [];
				if (sTerm) {
					aFilters.push(new Filter("productID", sap.ui.model.FilterOperator.Contains, sTerm));
					aFilters.push(new Filter("eanNumber", sap.ui.model.FilterOperator.Contains, sTerm));
				}
				oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
				oEvent.getSource().getBinding("suggestionItems").refresh(true);
			},
			handleSuggestCustomer: function(oEvent) {
				var sTerm = oEvent.getParameter("suggestValue");
				var aFilters = [];
				if (sTerm) {
					aFilters.push(new Filter("partner", sap.ui.model.FilterOperator.Contains, sTerm));
					aFilters.push(new Filter("name_org", sap.ui.model.FilterOperator.Contains, sTerm));
				}
				oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
				oEvent.getSource().getBinding("suggestionItems").refresh(true);
			},
			getCustomerDetails: function(selectedCustomerNumber) {
				var that = this;
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var customerListUrl = oBundle.getText("customerListUrl");
				var customerData = {};
				//var taxUrl = oBundle.getText("taxUrl");
				jQuery.ajax({
					type: 'GET',
					url: customerListUrl + "?&partner=in.(" + selectedCustomerNumber + ")",
					success: function(data) {
						//customerData.items = JSON.parse(data);
						var posCusModel = new JSONModel();
						posCusModel.setData(data);
						that.getView().setModel(posCusModel, "customerSpecificData");
					}
				});
			}

		});
	});