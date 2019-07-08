sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/Tokenizer"
], function(Controller, JSONModel, Filter, FilterOperator, Tokenizer) {
	"use strict";

	return Controller.extend("PosClient.controller.MaterialMaster", {


			onInit: function() {
				this.getOwnerComponent().getRouter().attachRouteMatched(this._onRouteMatched, this);
			},
			
			_onRouteMatched: function(oEvent) {
				if (oEvent.getParameter("name") === "materialMaster") {
					var storeId = oEvent.getParameters().arguments.storeId;
					this.storeId = storeId;
					var storeFilter = "";
					if (storeId !== "admin" && storeId !== "") {
						storeFilter = "?storeId=in.("+storeId+",)";
					}
					var selectData = {
						"categoryKeys" : [],
						"productIdKeys": [],
						"productDescriptionKeys": [],
						"supplierKeys": []
					};
					var oFilterModel = new sap.ui.model.json.JSONModel(selectData);
					this.getView().setModel(oFilterModel, "oFilterModel");
					
					var materialData = {};
					var initScope = this;
					
					var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
					var materialListUrl = oBundle.getText("materialListUrl");
					//var materialListUrl = "https://api.myjson.com/bins/yl0y8";
					
					jQuery.ajax({
						type: 'GET',
						url: materialListUrl,
						success: function(data) {
							materialData.items = data;
							//var listModel = new JSONModel(jQuery.sap.getModulePath("PosClient.model", materialData));
					
							var listModel = new JSONModel(materialData);
							initScope.getView().setModel(listModel, "listModel");
						}
					});
				}
			},
			
			onBackLaunchpad : function(){
					this.getOwnerComponent().getRouter().navTo("launchPad");
			},
			
			onMaterialMasterListPress : function(oEvent){
				this.getOwnerComponent().getRouter().navTo("materialDetail", {
					MaterialNumber : oEvent.getSource().getBindingContext("listModel").getObject().productID
				});
			},
			
			onProducIdValueHelp : function(oEvent){
				
			var me = this,
				oView = me.getView();
			if (!me.oProducIdDialog) {
				me.oProducIdDialog = sap.ui.xmlfragment(
					"PosClient.fragment.PriceID",
					this
				);
				oView.addDependent(me.oProducIdDialog);
			}
			//initially deselect all the items in the list
			$.each(me.oProducIdDialog.getItems(), function (j, item) {
				item.setSelected(false);
			});
			//now Based on the input tokens set selected as true for the items in the List
			$.each(oEvent.getSource().getTokens(), function (i, token) {
				$.each(me.oProducIdDialog.getItems(), function (j, item) {
					if (token.getKey() === item.getTitle()) {
						item.setSelected(true);
					}
				});
			});
			me.oProducIdDialog._searchField.setValue("");
			sap.ui.getCore().byId("idProductIDValueHelp").fireSearch();

			me.oProducIdDialog.open();
		
			},
/*			
			onPriceIdSearch: function (oEvent) {
			var aPriceIdFilter = [];
			var sQuery = oEvent.getParameter("value");
			if (sQuery === null || sQuery === undefined) {
				sQuery = "";
			}
			aPriceIdFilter.push(new Filter({
				filters: [
					new Filter({
						path: "productID",
						operator: FilterOperator.Contains,
						value1: sQuery
					})
				],
				and: false
			}));
			var oPriceIdList = this.oProducIdDialog;
			var oBinding = oPriceIdList.getBinding("items");
			oBinding.filter(aPriceIdFilter);
		},
		
		onPriceIdConfirm: function (oEvent) {
			var oSelectedItems = oEvent.getParameter("selectedContexts");
			var arrTempTokens = [];
			//add tokens to the MultiInput based on the selection of items
			for (var i = 0; i < oSelectedItems.length; i++) {
				arrTempTokens.push({
					key: oSelectedItems[i].getObject().productID
				});
			}
			var oFilterModel = this.getView().getModel("oFilterModel");
			oFilterModel.setProperty("/productIdKeys", arrTempTokens);

			this._finalFilters();
		},
*/		
		
		onProductDescriptionValueHelp : function(oEvent){
				
			var me = this,
				oView = me.getView();
			if (!me.oProductDescriptionDialog) {
				me.oProductDescriptionDialog = sap.ui.xmlfragment(
					"PosClient.fragment.ProductDescription",
					this
				);
				oView.addDependent(me.oProductDescriptionDialog);
			}
			//initially deselect all the items in the list
			$.each(me.oProductDescriptionDialog.getItems(), function (j, item) {
				item.setSelected(false);
			});
			//now Based on the input tokens set selected as true for the items in the List
			$.each(oEvent.getSource().getTokens(), function (i, token) {
				$.each(me.oProductDescriptionDialog.getItems(), function (j, item) {
					if (token.getKey() === item.getTitle()) {
						item.setSelected(true);
					}
				});
			});
			me.oProductDescriptionDialog._searchField.setValue("");
			sap.ui.getCore().byId("idProductDescriptionValueHelp").fireSearch();

			me.oProductDescriptionDialog.open();
		
			},
			
			onProductDescriptionSearch: function (oEvent) {
			var aProductDescriptionFilter = [];
			var sQuery = oEvent.getParameter("value");
			if (sQuery === null || sQuery === undefined) {
				sQuery = "";
			}
			aProductDescriptionFilter.push(new Filter({
				filters: [
					new Filter({
						path: "productDescription",
						operator: FilterOperator.Contains,
						value1: sQuery
					})
				],
				and: false
			}));
			var oList = this.oProductDescriptionDialog;
			var oBinding = oList.getBinding("items");
			oBinding.filter(aProductDescriptionFilter);
		},
		
		onProductDescriptionConfirm: function (oEvent) {
			var oSelectedItems = oEvent.getParameter("selectedContexts");
			var arrTempTokens = [];
			//add tokens to the MultiInput based on the selection of items
			for (var i = 0; i < oSelectedItems.length; i++) {
				arrTempTokens.push({
					key: oSelectedItems[i].getObject().productDescription
				});
			}
			var oFilterModel = this.getView().getModel("oFilterModel");
			oFilterModel.setProperty("/productDescriptionKeys", arrTempTokens);

			this._finalFilters();
		},
		
		onSupplierValueHelp : function(oEvent){
				
			var me = this,
				oView = me.getView();
			if (!me.oSupplierDialog) {
				me.oSupplierDialog = sap.ui.xmlfragment(
					"PosClient.fragment.Supplier",
					this
				);
				oView.addDependent(me.oSupplierDialog);
			}
			//initially deselect all the items in the list
			$.each(me.oSupplierDialog.getItems(), function (j, item) {
				item.setSelected(false);
			});
			//now Based on the input tokens set selected as true for the items in the List
			$.each(oEvent.getSource().getTokens(), function (i, token) {
				$.each(me.oSupplierDialog.getItems(), function (j, item) {
					if (token.getKey() === item.getTitle()) {
						item.setSelected(true);
					}
				});
			});
			me.oSupplierDialog._searchField.setValue("");
			sap.ui.getCore().byId("idsupplierValueHelp").fireSearch();

			me.oSupplierDialog.open();
		
			},
			
			onSupplierSearch: function (oEvent) {
			var aSupplierFilter = [];
			var sQuery = oEvent.getParameter("value");
			if (sQuery === null || sQuery === undefined) {
				sQuery = "";
			}
			aSupplierFilter.push(new Filter({
				filters: [
					new Filter({
						 path: "supplier",
						operator: FilterOperator.Contains,
						value1: sQuery
					})
				],
				and: false
			}));
			var oSupplierList = this.oSupplierDialog;
			var oBinding = oSupplierList.getBinding("items");
			oBinding.filter(aSupplierFilter);
		},
		
		onSupplierConfirm: function (oEvent) {
			var oSelectedItems = oEvent.getParameter("selectedContexts");
			var arrTempTokens = [];
			//add tokens to the MultiInput based on the selection of items
			for (var i = 0; i < oSelectedItems.length; i++) {
				arrTempTokens.push({
					key: oSelectedItems[i].getObject().supplier
				});
			}
			var oFilterModel = this.getView().getModel("oFilterModel");
			oFilterModel.setProperty("/supplierKeys", arrTempTokens);

			this._finalFilters();
		},
		
		
		_finalFilters: function () {
			var oFilterModel = this.getView().getModel("oFilterModel");
			var oFilterModelData = oFilterModel.getData();
			var categoryKeys = [];
			var	productIdKeys = [];
			var	productDescriptionKeys = [];
			var	supplierKeys = [];
			
			if (oFilterModelData.categoryKeys.length !== 0) {
				for (var j = 0; j < oFilterModelData.categoryKeys.length; j++) {
					categoryKeys.push(new Filter("category", sap.ui.model.FilterOperator.EQ, oFilterModelData.categoryKeys[j]));
				}

			}
			if (oFilterModelData.productIdKeys) {
				if (oFilterModelData.productIdKeys.length !== 0) {
					for (var k = 0; k < oFilterModelData.productIdKeys.length; k++) {
						productIdKeys.push(oFilterModelData.productIdKeys[k].key);
					}

					
				}
			}
			
			if (oFilterModelData.productDescriptionKeys) {
				if (oFilterModelData.productDescriptionKeys.length !== 0) {
					for (var l = 0; l  < oFilterModelData.productDescriptionKeys.length; l++) {
						productDescriptionKeys.push(oFilterModelData.productDescriptionKeys[l].key);
					}

					
				}
			}
			
			if (oFilterModelData.supplierKeys) {
				if (oFilterModelData.supplierKeys.length !== 0) {
					for (var m = 0; m  < oFilterModelData.supplierKeys.length; m++) {
						supplierKeys.push(oFilterModelData.supplierKeys[m].key);
					}

					
				}
			}
			
			var materialData = {};
				var initScope = this;
				
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var materialListUrl = oBundle.getText("materialListUrl");
				
				var filterQueryString = "?";
				
				if(productIdKeys.length > 0) {
					filterQueryString += "&productID=in.(" + productIdKeys + ")";
				}
				
				if(productDescriptionKeys.length > 0) {
					filterQueryString += "&productDescription=in.(" + productDescriptionKeys + ")";
				}
				
				if(supplierKeys.length > 0) {
					filterQueryString += "&supplier=in.(" + supplierKeys + ")";
				}
				
				jQuery.ajax({
					type: 'GET',
					url: materialListUrl + filterQueryString, //'?productID=eq.'+"("+productIdKeys+")"+'' + '&productDescription=eq.'+"("+productDescriptionKeys+")"+'' + '&supplier=eq.'+"("+supplierKeys+")"+'',
					success: function(data) {
						materialData.items = data;

						var listModel = new JSONModel(materialData);
						initScope.getView().setModel(listModel, "listModel");
						initScope.getOwnerComponent().getRouter().attachRouteMatched(initScope._onRouteMatched, initScope);
					}
				});
		},
		

sdTokenUpdate: function (oEvent) {
			var oFilterModel = this.getView().getModel("oFilterModel");
			var oSource = oEvent.getSource(),
				oTokens = oSource.getTokens(),
				bFlag = false;
			/*var oCodeKeys = oFilterModel.getProperty("/codeKeys");
			var oEmployeeKeys = oFilterModel.getProperty("/employeeKeys");*/
			var oProductIdKeys = oFilterModel.getProperty("/productIdKeys");
			var oProductDescriptionKeys = oFilterModel.getProperty("/productDescriptionKeys");
			var oSupplierKeys = oFilterModel.getProperty("/supplierKeys");
			var customDataKey = oSource.getCustomData()[0].getKey();
			var isEmptyRows = customDataKey === "productID" ? oProductIdKeys.length : oProductDescriptionKeys.length;
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
						if (customDataKey === "productID") {
							oProductIdKeys.push({
								key: addedTokens[0].getKey(),
								text: addedTokens[0].getText()
							});
						} else if(customDataKey === "productDescription"){
							oProductDescriptionKeys.push({
								key: addedTokens[0].getKey(),
								text: addedTokens[0].getText()
							});
						} else {
							oSupplierKeys.push({
								key: addedTokens[0].getKey(),
								text: addedTokens[0].getText()
							});
						}
					}
				} else {
					if (customDataKey === "productID") {
						oProductIdKeys.push({
							key: addedTokens[0].getKey(),
							text: addedTokens[0].getText()
						});
					} else if(customDataKey === "productDescription"){
						oProductDescriptionKeys.push({
							key: addedTokens[0].getKey(),
							text: addedTokens[0].getText()
						});
					} else {
						oSupplierKeys.push({
							key: addedTokens[0].getKey(),
							text: addedTokens[0].getText()
						});
					}
				}
			} else if (oEvent.getParameter("type") === Tokenizer.TokenUpdateType.Removed) {
				var removedToken = oEvent.getParameter("removedTokens");

				var oProductIdKeys = oFilterModel.getProperty("/productIdKeys");
			var oProductDescriptionKeys = oFilterModel.getProperty("/productDescriptionKeys");
			var oSupplierKeys = oFilterModel.getProperty("/supplierKeys");
				if (customDataKey === "productID") {
					for (var j = 0; j < oProductIdKeys.length; j++) {
						if (oProductIdKeys[j].key === removedToken[0].getKey()) {
							oProductIdKeys.splice(j, 1);
						}
					}
				} else if(customDataKey === "productDescription"){
					for (var k = 0; k < oProductDescriptionKeys.length; k++) {
						if (oProductDescriptionKeys[k].key === removedToken[0].getKey()) {
							oProductDescriptionKeys.splice(k, 1);
						}
					}
				} else {
					for (var l = 0; l < oSupplierKeys.length; l++) {
						if (oSupplierKeys[l].key === removedToken[0].getKey()) {
							oSupplierKeys.splice(l, 1);
						}
					}
				}
			}
			oFilterModel.updateBindings(true);

			this._finalFilters();
		},




	});

});