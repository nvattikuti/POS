sap.ui.define(["sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/ui/model/json/JSONModel"
	],
	function(Controller, MessageToast, JSONModel) {
		"use strict";
		return Controller.extend("PosClient.controller.PostGoodsMovement", {

//sap.ui.define([ "PosClient/controller/LaunchPad" ], function(Controller) {
//	"use strict";
//
//	return Controller.extend("PosClient.controller.PostGoodsMovement", {
		// ------------------------------------------//
		// PRIVATE ATTRIBUTES
		// ------------------------------------------//
		// see also private attributes in
		// BaseController
		_readyToSave : false,
		_oBusyDialog : null,
		_oLocalModel : null,
		_oMaterialDialog : undefined,
		_oBundle : undefined,
		//_sUrl : "http://18.191.159.130:3000",

		// ------------------------------------------//
		// HOOK METHODS
		// ------------------------------------------//

		onInit : function() {
			// attach navigation event
			//this._sUrl = "";
			this.getOwnerComponent().getRouter().attachRouteMatched(this._onObjectMatched, this);
//			this.getRouter().getRoute("PostGoodsMovement").attachPatternMatched(
//					this._onObjectMatched, this);
			this._oLocalModel = new sap.ui.model.json.JSONModel();
			this._oLocalModel.setSizeLimit(10000);
			this.getView().setModel(this._oLocalModel);
			var oTableItems = this.byId("ItemsTbl");
			oTableItems.setModel(this._oLocalModel);
			oTableItems.bindRows("/document/items");
		},

		onBeforeRendering : function() {
		},

		onAfterRendering : function() {			
		},
		// ------------------------------------------//
		// PRIVATE METHODS
		// ------------------------------------------//
		_onObjectMatched : function() {
			var that = this;
			
			this._oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var sUrl = this._oBundle.getText("settingsDataUrl");
			
			that._setBusy(true);
			$.ajax({
				type: 'GET',
				async: false,
				url: sUrl,
				success: function(oData) {
					for (var i = 0; i < oData.length ; i++) {						
						that._oLocalModel.setProperty("/" + oData[i].setting_key, oData[i].setting_value);
					}
					that._setBusy(false);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					that._setBusy(false);
				}
			});
			
//			that._setBusy(true);
//			sUrl = this._sUrl + "/zot_mat_bas";
//			$.ajax({
//				type: 'GET',
//				url: sUrl,
//				success: function(oData) {
//					for (var i = 0; i < oData.length ; i++) {
//						oData[i].mengeMax = 0;
//					}
//					that._oLocalModel.setProperty("/materials", oData);
//					that._setBusy(false);
//				},
//				error: function(jqXHR, textStatus, errorThrown) {
//					that._setBusy(false);
//				}
//			});				

			that._setBusy(true);
			var aData = [];
			var oData = {};
			sUrl = this._oBundle.getText("GoodsMovementURL");
			sUrl = sUrl;  //?&dstatus=in.(V)
			$.ajax({
				type: 'GET',
				url: sUrl,
				async: false,
				success: function(data) {
					for (var i = 0; i < data.length ; i++) {
						if (oData != undefined && oData.xblnr_mkpf == data[i].xblnr_mkpf) {
							var oItems = {};
							oItems.zeile = data[i].zeile;
							oItems.matnr = data[i].matnr;
							oItems.mengeMax = 0;
							oItems.menge = data[i].menge;
							oItems.meins = data[i].meins;
							oItems.werks = data[i].werks;
							oItems.lgort = data[i].lgort;
							oItems.kostl = data[i].kostl;
							oData.items.push(oItems);
						} else {
							if (oData != undefined) {
								aData.push(oData);
							}
							var oData = {};
							oData.budat_mkpf = new Date(data[i].budat_mkpf.substr(0,4) + "-" + data[i].budat_mkpf.substr(4,2) + "-" + data[i].budat_mkpf.substr(6,2));
							oData.xblnr_mkpf = data[i].xblnr_mkpf; 
							oData.docstatus = data[i].docstatus;
							oData.zuser     = data[i].zuser;
							oData.bwart     = data[i].bwart;
							oData.items		= [];
							var oItems = {};
							oItems.zeile = data[i].zeile;
							oItems.matnr = data[i].matnr;
							oItems.mengeMax = 0;
							oItems.menge = data[i].menge;
							oItems.meins = data[i].meins;
							oItems.werks = data[i].werks;
							oItems.lgort = data[i].lgort;
							oItems.kostl = data[i].kostl;
							oData.items.push(oItems);
						}
					}
					if (oData != undefined) {
						aData.push(oData);
					}
					that._oLocalModel.setProperty("/documents", aData);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.show(jqXHR.responseJSON.message, {
						icon : sap.m.MessageBox.Icon.NONE,
						title : textStatus,
						actions : sap.m.MessageBox.Action.OK,
						onClose : function(oAction) {	}
					});
				},
				complete: function(jqXHR, textStatus) {
					that._setBusy(false);					
				},
			});				
			
			
//			var aMockData = [{
//				budat_mkpf : new Date(),
//				xblnr_mkpf : "1000000001",
//				docstatus : "V",
//				zuser     : "",
//				bwart     : "641",
//				items : [{
//					zeile : 1,
//					matnr : "1000101",
//					mengeMax : 34,
//					menge : 3,
//					meins : "PC",
//					werks : "1110",
//					lgort : "",
//					kostl : "",
//				}]
//			},
//			{
//				budat_mkpf : new Date(),
//				xblnr_mkpf : "1000000002",
//				docstatus : " ",
//				zuser     : "",
//				bwart     : "311",
//				items : [{
//					zeile : 1,
//					matnr : "1000103",
//					mengeMax : 51,
//					menge : 2,
//					meins : "PC",
//					werks : "1110",
//					lgort : "",
//					kostl : "",
//				}]
//			}];
//			this._oLocalModel.setProperty("/documents", aMockData);
			
			var aMovementTypes = [{				
				bwart    : "641",
				Text     : "Movement 641"
			},
			{
				bwart    : "311",
				Text     : "Movement 311"
			}];
			this._oLocalModel.setProperty("/MovementTypes", aMovementTypes);
			
			var aDocumentTypes = [{				
				docstatus : "V",
				Text      : "Draft"
			},
			{
				docstatus : " ",
				Text      : "Posted"
			}];
			this._oLocalModel.setProperty("/DocumentTypes", aDocumentTypes);
			
			this._New();
			

			
		},
		
		_New : function() {			
			var oEmptyData = {
					budat_mkpf : new Date(),
					xblnr_mkpf : "<NEW>",
					docstatus : "V",
					zuser     : this.getOwnerComponent().getModel("storeModel").getProperty("/selectedID"),
					bwart     : "",
					items : []};
			this._oLocalModel.setProperty("/document", oEmptyData);
			this._oLocalModel.setProperty("/docstatus", 'V');
			this.byId("SplitCntr").toDetail(this.createId("Items"));
			//this._oLocalModel.refresh();
		},
		
		_getMaterialQuantity: function(sMaterial) {
			var that = this;
			var mengeMax = 0;
			
			//var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var sUrl = this._oBundle.getText("inventoryUrl");
			
			sUrl = sUrl + "?&werks=in.(" + this._oLocalModel.getProperty("/plant") + ")&matnr=in.(#1)";
			sUrl = sUrl.replace("#1", sMaterial);
			that._setBusy(true);
			$.ajax({
				type: 'GET',
				url: sUrl,
				async : false,
				success: function(oData) {
					if (oData.length > 0) {
						mengeMax = oData[0].menge;
					}						
				},
				error: function(jqXHR, textStatus, errorThrown) {

				},
				complete: function(jqXHR, textStatus) {
					that._setBusy(false);					
				},
			});
			return mengeMax;
		},
		
		_getMaterials: function() {
			var that = this;
			
			//var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var sUrl = this._oBundle.getText("materialBasicDetailUrl");
			
			that._setBusy(true);
			that._oLocalModel.setProperty("/materials", new Array());
			$.ajax({
				type: 'GET',
				url: sUrl,
				async: false,
				success: function(oData) {
					for (var i = 0; i < oData.length ; i++) {
						oData[i].mengeMax = 0;
						if (sap.ui.getCore().getConfiguration().getLanguage() == "en") {
							oData[i].maktx = oData[i].maktx_e;
						} else {
							oData[i].maktx = oData[i].maktx_l;
						}
					}
					that._oLocalModel.setProperty("/materials", oData);					
				},
				error: function(jqXHR, textStatus, errorThrown) {
					jQuery.sap.require("sap.m.MessageBox");
          sap.m.MessageBox.show(errorThrown, {
            icon : sap.m.MessageBox.Icon.NONE,
            title : textStatus,
            actions : sap.m.MessageBox.Action.OK,
            onClose : function(oAction) {
              
            }
          });
				},
				complete: function(jqXHR, textStatus) {
					that._setBusy(false);
				}
			});				
		},
		
		_getPlantMaterials: function() {
			var that = this;
			
			//var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var sUrl = this._oBundle.getText("inventoryUrl");
			
			sUrl = sUrl + "?&werks=in.(" + this._oLocalModel.getProperty("/plant") + ")&menge=gt.0";
			that._setBusy(true);
			that._oLocalModel.setProperty("/plantmaterials", new Array());
			$.ajax({
				type: 'GET',
				url: sUrl,
				async: false,
				success: function(oData) {
					that._oLocalModel.setProperty("/plantmaterials", oData);					
				},
				error: function(jqXHR, textStatus, errorThrown) {
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.show(errorThrown, {
						icon : sap.m.MessageBox.Icon.NONE,
						title : textStatus,
						actions : sap.m.MessageBox.Action.OK,
						onClose : function(oAction) {	}
					});
				},
				complete: function(jqXHR, textStatus) {
					that._setBusy(false);
				}
			});				
		},
		
		_SelectDocument : function(sPath) {
			var oDocument = this._oLocalModel.getProperty(sPath);
			for (var i = 0;  i < oDocument.items.length ; i++) {	
				oDocument.items[i].mengeMax = this._getMaterialQuantity(oDocument.items[i].matnr);				
			}
			this._oLocalModel.setProperty("/document", oDocument);
			this._oLocalModel.setProperty("/docstatus", oDocument.docstatus);
			this.byId("SplitCntr").toDetail(this.createId("Items"));
		},
		
		_popupToSave : function() {
			var that = this;			
			var oDialog = new sap.m.Dialog({
				title : that.getText('confirmBackDialogTitle'),
				type : 'Message',
				state: 'Warning',
				content : new sap.m.Text({
					text : that.getText('confirmBackDialogQuestion')
				}),
				beginButton : new sap.m.Button({
					text : that.getText('yes'),
					press : function() {
						that._SaveDocument();
						oDialog.close();																		
					}
				}),
				endButton : new sap.m.Button({
					text : that.getText('no'),
					press : function() {
						oDialog.close();
					}
				}),
				afterClose : function() {
					oDialog.destroy();
					that._setBusy(false);
				}
			});
			oDialog.open();
		},
		
		_SaveDocument : function() {
			var that = this;
			
			//var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var cUrl = this._oBundle.getText("GoodsMovementURL");
			
			var sUrl = "";
			var oDocument = this.getModel().getProperty("/document");
			var sNumber = "";
			if (oDocument.xblnr_mkpf == "<NEW>") {
				sNumber = "1000000009";
			} else {
				sNumber = oDocument.xblnr_mkpf;
				sUrl = cUrl + "?&xblnr_mkpf=in.(#1)";	
				sUrl = sUrl.replace("#1", oDocumentDel.xblnr_mkpf);
				that._setBusy(true);
				$.ajax({
					type: 'DELETE',
					url: sUrl,
					async: false,
					complete: function(jqXHR, textStatus) {
						that._setBusy(false);
					}
				});
				
			}
			var aData = [];
			for (var i = 0;  i < oDocument.items.length ; i++) {
				var oData = {};
				//oData.docstatus = this.getModel().getProperty("/docstatus");
				oData.xblnr_mkpf = sNumber;
				oData.zeile = i + 1;
				//oData.zuser = "";
				oData.budat_mkpf = oDocument.budat_mkpf.toISOString().slice(0,10).split("-").join("");
				oData.matnr = oDocument.items[i].matnr;
				oData.menge = oDocument.items[i].menge;		
				oData.meins = oDocument.items[i].meins;
				oData.werks	= this._oLocalModel.getProperty("/plant")
				oData.lgort = "";
				oData.bwart = oDocument.bwart;				
				oData.kostl = "";				
				aData.push(oData);
			}
			
			sUrl = cUrl;			
			$.ajax({
				type: 'POST',
				url: sUrl,
				data: JSON.stringify(aData),
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				async: false,
				success: function(oData) {
					//that._oLocalModel.setProperty("/plantmaterials", oData);					
				},
				error: function(jqXHR, textStatus, errorThrown) {
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.show(jqXHR.responseJSON.message, {
						icon : sap.m.MessageBox.Icon.NONE,
						title : textStatus,
						actions : sap.m.MessageBox.Action.OK,
						onClose : function(oAction) {	}
					});
				},
				complete: function(jqXHR, textStatus) {
					//that._setBusy(false);
				}
			});
			
			this._readyToSave = false;
		},
		
		_setBusy : function(busy, showCancelButton) {
			if (!this._oBusyDialog) {
				var sText = this._oBundle.getText("busyText");
				var sTitle = this._oBundle.getText("busyTitle");
				this._oBusyDialog = new sap.m.BusyDialog({
				
			    text : sText,
			    title : sTitle,
			    	showCancelButton: showCancelButton
			    })
			}
			
			if (busy === true) {
			//			        sap.ui.core.BusyIndicator.show(10);
			  this._oBusyDialog.open();
			} else {
			  sap.ui.core.BusyIndicator.hide();
			  this._oBusyDialog.close();
			}
	    },

		// ------------------------------------------//
		// EVENT HANDLERS
		// ------------------------------------------//
	    onBackLaunchpad: function() {
			this.getOwnerComponent().getRouter().navTo("launchPad");
		},    
	
	    onPressNew : function(oEvent) {
			var that = this;
			if (this._readyToSave) {
				this._setBusy(true);				
				jQuery.sap.delayedCall(100, this, function() {					
					that._popupToSave();					
				});					
			}
			this._New();
		},
		
		onPressItemsBack : function(oEvent) {
			this.byId("SplitCntr").backDetail();			
		},
		
		onDeleteDocument : function(oEvent) {
			var that = this;
			var path = oEvent.getParameter('listItem').getBindingContext().getPath();
			var idx = parseInt(path.substring(path.lastIndexOf('/') +1));
			var m = this.getModel();
			var oDocumentDel = m.getProperty(path);
			//var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var sUrl = this._oBundle.getText("GoodsMovementURL");
			
			sUrl = sUrl + "?&xblnr_mkpf=in.(#1)";	
			sUrl = sUrl.replace("#1", oDocumentDel.xblnr_mkpf);
			$.ajax({
				type: 'DELETE',
				url: sUrl,
				async: false,
				success: function(oData) {	
					var oDocumentSel = m.getProperty("/document");
					var d = m.getProperty("/documents");
					d.splice(idx, 1);
					m.setProperty("/documents", d);
					if (oDocumentDel.xblnr_mkpf === oDocumentSel.xblnr_mkpf) {
						that._New();
						that._readyToSave = false;
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.show(jqXHR.responseJSON.message, {
						icon : sap.m.MessageBox.Icon.NONE,
						title : textStatus,
						actions : sap.m.MessageBox.Action.OK,
						onClose : function(oAction) {	}
					});
				},
				complete: function(jqXHR, textStatus) {
					//that._setBusy(false);
				}
			});
		},
		
		onSelectDocument : function(oEvent) {
			var that = this;
			if (this._readyToSave) {
				this._setBusy(true);				
				jQuery.sap.delayedCall(100, this, function() {					
					that._popupToSave();					
				});					
			} 
			var sPath = oEvent.getSource().getBindingContext().getPath();
			this._SelectDocument(sPath);
		},
		
		onSaveDocument : function(oEvent) {
			this._SaveDocument();
		},
		
		onDocumentChange : function(oEvent) {
			this._readyToSave = true;
		},
		
		onChangeItemQuantity : function(oEvent) {
			this._readyToSave = true;
			var iValueNew = oEvent.getParameter("value");
			var oItem = this._oLocalModel.getProperty(oEvent.getSource().getBindingContext().getPath());
			if (oItem.mengeMax < iValueNew) {
				oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			} else {
				oEvent.getSource().setValueState(sap.ui.core.ValueState.Success);
			}
		},
		
		onChangeItemQuantityValidationError : function(oEvent) {
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			//oEvent.getSource().setValue(oEvent.getParameter("oldValue"));
		},
		
		onChangeItemQuantityValidationSuccess : function(oEvent) {
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Success);
		},
		
		onItemAdd : function(oEvent) {
			if (this._oMaterialDialog === undefined) {
				this._getMaterials();
				this._getPlantMaterials();
				
//				var aMat = [
//				{
//					matnr : "1000101",
//					maktx : "test material 1",
//					barum : "1234132443",
//					mengeMax : Number(34),
//					meins : "PC"
//				},
//				{
//					matnr : "1000102",
//					maktx : "test material 2",
//					barum : "6545235",
//					mengeMax : Number(134),
//					meins : "PC"
//				},
//				{
//					matnr : "1000103",
//					maktx : "test material 3",
//					barum : "896755444",
//					mengeMax : Number(334),
//					meins : "PC"
//				}];
//				this._oLocalModel.setProperty("/materials", aMat);
				
				this._oMaterialDialog = sap.ui.xmlfragment("PosClient/fragment.MaterialSelection", this);
				this._oMaterialDialog.setModel(this._oLocalModel);
				this.getView().addDependent(this._oMaterialDialog);
			}
			var aMaterials = this._oLocalModel.getProperty("/materials");
			var aPlantMaterials = this._oLocalModel.getProperty("/plantmaterials");
			var k = 0;
			for (var i = 0;  i < aMaterials.length ; i++) {	
				for (var j = 0;  j < aPlantMaterials.length ; j++) {
					if (aMaterials[i].matnr === aPlantMaterials[j].matnr) {
						aMaterials[i].mengeMax = aPlantMaterials[j].menge;
						k = j + 1;
						break;
					}
				}			
			}
			
			
//			for (var i = 0;  i < aMaterials.length ; i++) {	
//				aMaterials[i].mengeMax = this._getMaterialQuantity(aMaterials[i].matnr);				
//			}
			var oFilter = new Array();
			this._oMaterialDialog.getBinding("items").filter(oFilter);
			this._oMaterialDialog.open();
		},
		
		onDeleteItem : function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext().getPath();
			var aSplit = sPath.split("/");
			var iIndex = aSplit[aSplit.length - 1];
			var oDocument = this._oLocalModel.getProperty("/document");
			oDocument.items.splice(iIndex, 1);
			this.byId("ItemsTbl").getModel().refresh();
			this.byId("ItemsTbl").setVisibleRowCount(oDocument.items.length);
		},
		
		onMaterialDialogSearch : function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new this.Filter({
				filters : [
										new this.Filter("matnr", sap.ui.model.FilterOperator.Contains, sValue),
										new this.Filter("maktx", sap.ui.model.FilterOperator.Contains, sValue),
										new this.Filter("barum", sap.ui.model.FilterOperator.Contains, sValue)
									],
				and : false
			});
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([ oFilter ]);
		},
		
		onMaterialDialogConfirm : function(oEvent) {
			this._readyToSave = true;
			var aContexts = oEvent.getParameter("selectedContexts");
			var oEntry = aContexts[0].getObject();			
			var oDocument = this._oLocalModel.getProperty("/document");									
			for (var i = 0;  i < aContexts.length ; i++) {
				var oItem = {};
				oItem.matnr = aContexts[i].getObject().matnr;
				oItem.maktx = aContexts[i].getObject().maktx;	
				oItem.mengeMax = aContexts[i].getObject().mengeMax;
				oItem.meins = aContexts[i].getObject().meins;				
				oItem.werks = this._oLocalModel.getProperty("/plant");				
				oDocument.items.push(oItem);
			}
			this.byId("ItemsTbl").getModel().refresh();
			this.byId("ItemsTbl").setVisibleRowCount(oDocument.items.length);
		},

	});
});