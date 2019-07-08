sap.ui.define(["sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/ui/model/json/JSONModel",
		'sap/ui/model/Filter',
		'sap/m/MessageBox'
	],
	function(Controller, MessageToast, JSONModel, Filter, MessageBox) {
		"use strict";
		var selObj;
		return Controller.extend("PosClient.controller.PointOfSales", {
			/**
			 *@memberOf PosClient.controller.Login
			 */

			onInit: function() {

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

				var sendModel = new JSONModel();
				this.getView().setModel(sendModel, "sendModel");
				/*var pushData = {
					"ProductDescription": "",
					"UnitPrice": "",
					"quantity" : 1
				};*/

				var pushModel = new JSONModel();
				this.getOwnerComponent().setModel(pushModel, "pushModel");

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
					"backToSaleButton": false
				};

				var posvisibleModel = new JSONModel(posvisibleData);
				this.getOwnerComponent().setModel(posvisibleModel, "posvisibleModel");

				var posData = {
					"rowTotal": "",
					"total": "",
					"tax": "",
					"quantity": 1,
					"discount": ""
				};

				var posTableModel = new JSONModel(posData);
				this.getOwnerComponent().setModel(posTableModel, "posTableModel");

				var selectedCus = {
					"selectedCustomer": "",
					"selectedCustomerNumber": "",
					"selectedMaterial": ""
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
					"taxDropDown": false
				};
				var posBtnVisibleModel = new JSONModel(visibleData);
				this.getView().setModel(posBtnVisibleModel, "posBtnVisibleModel");

				var customerData = {};
				var initScope = this;

				jQuery.ajax({
					type: 'GET',
					url: customerListUrl,
					success: function(data) {
						customerData.items = data;
						var posCusModel = new JSONModel(customerData);
						initScope.getView().setModel(posCusModel, "posCusModel");
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
				if (oEvent.getParameter("name") === "pointOfSales") {
					var storeModel = this.getOwnerComponent().getModel("storeModel");
					storeModel.getProperty("/selectedID");

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
				var oInputs = $('#__component0---pointOfSales--idProductsTable').find('.sapMInputBaseInner');
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
				if (!me._oCustomerDialog) {
					me._oCustomerDialog = sap.ui.xmlfragment("PosClient.fragment.CustomerTable", me);
				}

				me.getView().addDependent(me._oCustomerDialog);

				jQuery.sap.syncStyleClass("sapUiSizeCompact", me.getView(), me._oCustomerDialog);
				me._oCustomerDialog.open();

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
				var me = this;
				var aContexts = oEvent.getParameter("selectedContexts");
				var selectedModel = me.getOwnerComponent().getModel("selectedModel");
				if (aContexts && aContexts.length) {
					MessageToast.show("You have chosen " + aContexts.map(function(oContext) {
						var selectedCustomer = oContext.getObject().name_org;
						var selectedCustomerNumber = oContext.getObject().partner;

						selectedModel.setProperty("/selectedCustomer", selectedCustomer);
						selectedModel.setProperty("/selectedCustomerNumber", selectedCustomerNumber);
						return oContext.getObject().name_org;

					}).join(", "));

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

			handleCancel: function() {
				this._oCustomerDialog.close();
			},

			handleMoreMaterialClose: function(oEvent) {
				var me = this;
				var selectedModel = me.getOwnerComponent().getModel("selectedModel");
				var aContexts = oEvent.getParameter("selectedContexts");
				if (aContexts && aContexts.length) {
					MessageToast.show("You have chosen " + aContexts.map(function(oContext) {
						var selectedMaterial = oContext.getObject().matnr;

						selectedModel.setProperty("/selectedMaterial", selectedMaterial);
						return oContext.getObject().matnr;

					}).join(", "));

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

			handleMoreMaterialCancel: function() {

			},

			handleMoreMaterialSearch: function(oEvent) {
				var query = oEvent.getSource()._sSearchFieldValue.toLocaleLowerCase();
				var oList = sap.ui.getCore().byId("idMoreMaterialPOSTable");
				var items = oList.getItems();
				for (var i = 0; i < items.length; i++) {
					var sProductID = oList.getItems()[i].getBindingContext("moreModel").getObject().matnr;
					var sProductDescription = oList.getItems()[i].getBindingContext("moreModel").getObject().maktx_l.toLowerCase();
					//	var sSupplier = oList.getItems()[i].getBindingContext("moreModel").getObject().supplier;
					//	var sStandardPrice = oList.getItems()[i].getBindingContext("moreModel").getObject().standardPrice;
					var sPriceUnit = oList.getItems()[i].getBindingContext("moreModel").getObject().vrkme.toLowerCase();
					if (sProductID.indexOf(query) > -1 || sProductDescription.indexOf(query) > -1 || sPriceUnit.indexOf(query) > -1) {
						items[i].setVisible(true);
					} else {
						items[i].setVisible(false);
					}

				}
			},

			onCusRemove: function() {
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

			/*handlePressConfiguration: function(oEvent) {
				var viewId = this.getView().getId();
				var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
				var sideExpanded = toolPage.getSideExpanded();
				toolPage.setSideExpanded(!toolPage.getSideExpanded());
			},*/

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

			handleMaterialClose: function(oEvent) {
				var me = this;
				var selectedModel = me.getOwnerComponent().getModel("selectedModel");
				var aContexts = oEvent.getParameter("selectedContexts");
				if (aContexts && aContexts.length) {
					MessageToast.show("You have chosen " + aContexts.map(function(oContext) {
						var selectedMaterial = oContext.getObject().productID;

						selectedModel.setProperty("/selectedMaterial", selectedMaterial);
						return oContext.getObject().productID;

					}).join(", "));

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

			handleMaterialCancel: function() {
				this._oMaterialDialog.close();
			},

			_materialData: function() {
				var me = this;
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
							} else {
								materialTableData.items = data[0];
								oArray.push(data[0]);
								pushModel.setProperty("/", oArray);

								me.onQuantitySubmit();
							}
						} else {
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
											pushModel.setProperty("/", oArray);
											me.onQuantitySubmit();
										} else {
											jQuery.ajax({
												type: 'GET',
												url: materialPriceDetailUrl + "?&matnr=in.(" + selMaterial + ")",
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
														materialTableData.items = data[0];
														oArray.push(data[0]);
														pushModel.setProperty("/", oArray);
														me.onQuantitySubmit();
													}
												}
											});
										}
									}
								}
							});
						}
					}
				});

			},

			onQuantitySubmit: function(oEvent) {
				var pushModel = this.getOwnerComponent().getModel("pushModel");

				var posTableModel = this.getOwnerComponent().getModel("posTableModel");
				posTableModel.refresh();
				var pushModelOdata = this.getView().getModel("pushModel").oData;

				if (oEvent !== undefined) {
					var rowQty = parseInt(oEvent.getSource().getBindingContext("pushModel").getObject().kpein);
					var rowPrice = oEvent.getSource().getBindingContext("pushModel").getObject().kbetr;
					var rowTotal = rowQty * rowPrice;
					oEvent.getSource().getBindingContext("pushModel").getObject().rRotal = rowTotal;
					pushModel.updateBindings(true);
				}

				var tot = 0;
				for (var j = 0; j < pushModelOdata.length; j++) {
					tot += pushModelOdata[j].kbetr * pushModelOdata[j].kpein;
				}
				var Total = tot.toFixed(2);
				posTableModel.getData().total = Total;
				posTableModel.updateBindings(true);

				var Tax = ((8 / 100) * posTableModel.getData().total).toFixed(2);
				posTableModel.getData().tax = Tax;
				posTableModel.updateBindings(true);

			},

			onPaymentPress: function() {
				if (!this._PaymentPOS) {
					this._PaymentPOS = sap.ui.xmlfragment("PosClient.fragment.PaymentPOS", this);
					this.getView().addDependent(this._PaymentPOS);
				}
				this._PaymentPOS.open();

				var posvisibleModel = this.getOwnerComponent().getModel("posvisibleModel");
				//	posvisibleModel.setProperty("/paymentButton", false);
				posvisibleModel.setProperty("/finishSaleButton", true);
				posvisibleModel.setProperty("/saveAsQuoteButton", false);
				posvisibleModel.setProperty("/cancelSaleButton", false);
				posvisibleModel.setProperty("/backToSaleButton", true);
			},

			onPaymentCancel: function() {
				var posvisibleModel = this.getOwnerComponent().getModel("posvisibleModel");
				posvisibleModel.setProperty("/paymentButton", true);
				posvisibleModel.setProperty("/finishSaleButton", false);
				posvisibleModel.setProperty("/saveAsQuoteButton", true);
				posvisibleModel.setProperty("/cancelSaleButton", true);
				posvisibleModel.setProperty("/backToSaleButton", false);
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

				var selObj = evt.mParameters.selectedItem.oBindingContexts.moreModel.getObject();
				if (pushModel.oData[0] !== undefined) {
					var oArray = pushModel.oData;
				} else {
					var oArray = [];
				}
				oArray.push(selObj);
				pushModel.setProperty("/", oArray);
				//	this._moreDialog.close();
				this.onQuantitySubmit();
				var selectedModel = this.getOwnerComponent().getModel("selectedModel");
				selectedModel.setProperty("/selectedMaterial", "");
				//pushModel.getProperty("/").push(selObj);
				//	sap.ui.getCore().getModel("pushModel").getProperty("/").push(selObj);
			},

			onCancelMoreMaterials: function() {
				this._moreDialog.close();
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
				var discountValue = parseFloat(sap.ui.getCore().byId("idDiscountInput").getValue());
				var pushModel = this.getOwnerComponent().getModel("pushModel");
				var total = pushModel.getProperty("/rRotal");

				//	var discountTotal = (discountValue / 100) * total;
				for (var i = 0; i < pushModel.getData().length; i++) {
					var rRotal = (discountValue / 100) * pushModel.getData()[i].rRotal;

					var finalrRotal = (pushModel.getData()[i].rRotal - rRotal).toFixed(2);
					pushModel.getData()[i].rRotal = finalrRotal;

				}
				//	pushModel.getData().rRotal = finalrRotal;
				pushModel.updateBindings(true);

				var posTableModel = this.getOwnerComponent().getModel("posTableModel");
				var rightTotal = posTableModel.getProperty("/total");

				var rRightRotal = (discountValue / 100) * rightTotal;
				var fiRiTotal = (rightTotal - rRightRotal).toFixed(2);
				posTableModel.getData().total = fiRiTotal;

				var tax = posTableModel.getProperty("/tax");
				var discountTax = (discountValue / 100) * tax;
				var finalTax = (tax - discountTax).toFixed(2);
				posTableModel.getData().tax = finalTax;

				var dis = posTableModel.setProperty("/discount", discountValue + "%");
				posTableModel.updateBindings(true);
				this._discountDialog.close();
			},

			onDiscountChange: function() {

			},

			onPaymentAccept: function() {
				this._PaymentPOS.close();
				var posvisibleModel = this.getOwnerComponent().getModel("posvisibleModel");
				posvisibleModel.setProperty("/paymentButton", false);
				posvisibleModel.setProperty("/finalPaymentButton", true);
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
				var day = date.getDay();
				if (day < 10) {
					day = "0" + day;
				}
				var fulldate = year + month + day;

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

				var fullHHMMSS = hours.toString() + minutes.toString() + seconds.toString();

				sendModelData.erdat = fulldate;
				sendModelData.ernam = storeModel.getData().selectedID;
				sendModelData.erzet = fullHHMMSS;
				sendModelData.kpein = "abc";
				sendModelData.kschl = "abcd";
				sendModelData.mandt = "300";
				sendModelData.mwskz = "01";
				sendModelData.netwr = parseFloat(posTableModel.getData().total);
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

				var orderHeadPostData = {
					"erdat": fulldate,
					"ernam": storeModel.getData().selectedID,
					"erzet": fullHHMMSS,
					"kpein": "abc",
					"kschl": "abcd",
					"mandt": customerShipModel.getData().mandt !== undefined ? customerShipModel.getData().mandt.toString() : "",
					"mwskz": "01",
					"netwr": parseFloat(posTableModel.getData().total),
					"partner": selectedModel.getData().selectedCustomerNumber,
					"pmnt": "abcd",
					"posid": incrementModel.getData().posnr,
					"shipto": customerShipModel.getData().shipto !== undefined ? customerShipModel.getData().shipto.toString() : "",
					"text1_e": "",
					"text1_l": "",
					"v_text1_e": "",
					"v_text1_l": "",
					"vatrate": posTableModel.getData().tax,
					"vbeln": incrementModel.getData().next_vbeln,
					"waerk": "BGN",
					"werks": storeModel.getData().selectedID
				};

				jQuery.ajax({
					type: 'POST',
					url: orderHeadURL,
					data: orderHeadPostData,
					success: function(data) {

					},
					error: function(e) {

					}

				});

				var pushModel = this.getView().getModel("pushModel");
				var pushModelData = pushModel.getData();
				var arrayOfItems = [];
				for (var i = 0; i < pushModelData.length; i++) {
					var orderItemsPostData = {
						"barum": "",
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
						"netwr": pushModelData[i].rRotal,
						"posid": incrementModel.getData().posnr, //this.getView().byId("idPOSValue").getText(),
						"posnr": incrementModel.getData().posnr,
						"vbeln": incrementModel.getData().next_vbeln,
						"waerk": "BGN",
						"werks": this.getOwnerComponent().getModel("storeModel").getData().selectedID
					};
					arrayOfItems.push(orderItemsPostData);
				}

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

				var orderItemURL = oBundle.getText("orderItemURL");
				var me = this;
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
						MessageToast.show("Order Created Successfully");
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
			/*onUserClick : function(oEvent){
			    if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("PosClient.fragment.BackPopOver", this);
				this.getView().addDependent(this._oPopover);
			}
			this._oPopover.openBy(oEvent.getSource());
			},
			
			onBackLaunchpad: function() {
			this.getOwnerComponent().getRouter().navTo("launchPad");
		},*/
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
				if (selectVal) {
					ovisibleModel.setProperty("/taxDropDown", true);
					return ovisibleModel.refresh();
				} else {
					ovisibleModel.setProperty("/taxDropDown", false);
					return ovisibleModel.refresh();
				}
			}

			/*suggestionItemSelected: function(oEvent){
		var oItem = oEvent.getParameter("selectedItem");
		var oContext = oItem.getBindingContext("posModel");
	}*/

		});
	});