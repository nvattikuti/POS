sap.ui.define(["sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		'sap/m/MessageBox',
		"sap/ui/model/json/JSONModel"
	],
	function (Controller, MessageToast, MessageBox, JSONModel) {
		"use strict";
		return Controller.extend("PosClient.controller.InboundDetail", {
			/**
			 *@memberOf PosClient.controller.Sales
			 */

			onInit: function () {
				this.getOwnerComponent().getRouter().attachRouteMatched(this._onRouteMatched, this);
			},

			_onRouteMatched: function (oEvent) {
				if (oEvent.getParameter("name") === "InboundDetail") {
					var vbeln = oEvent.getParameter("arguments").vbeln;
					var oController = this;
					var initScope = this;
					var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
					var InboundItemURL = oBundle.getText("InboundItemURL");
					// var posShipUrl = oBundle.getText("posShipUrl");
					var storeUserUrl = oBundle.getText("storeUserUrl");
					var inboundURL = oBundle.getText("inboundURL");
					var InboundDetailData = {};
					var settingsUrl = oBundle.getText("settingsUrl");
					var incrementData = {};
					//Get Store Information
					$.ajax({
						type: 'GET',
						url: settingsUrl,
						success: function (data) {
							incrementData = data[0];
							var incrementModel = new JSONModel(incrementData);
							oController.getOwnerComponent().setModel(incrementModel, "settingModel");
						}
					});
					// var salesShipData = {};
					var UserData = {};
					var inboundData = {};

					jQuery.ajax({
						type: 'GET',
						url: inboundURL + "?&vbeln=in.(" + vbeln + ")",
						success: function (data) {
							inboundData = data[0];
							var inboundModel = new JSONModel(inboundData);
							initScope.getView().setModel(inboundModel, "inboundModel");
						}
					});

					jQuery.ajax({
						type: 'GET',

						url: InboundItemURL + "?&vbeln=in.(" + vbeln + ")",
						success: function (data) {
							InboundDetailData.items = data;
							var inboundDetailModel = new JSONModel(InboundDetailData);
							initScope.getView().setModel(inboundDetailModel, "inboundDetailModel");
						}
					});

					// jQuery.ajax({
					// 	type: 'GET',
					// 	url: posShipUrl + "?&shipto=in.(" + shipto + ")",
					// 	success: function(data) {
					// 		salesShipData = data[0];
					// 		var salesShipToModel = new JSONModel(salesShipData);
					// 		initScope.getView().setModel(salesShipToModel, "salesShipToModel");
					// 		//salesShipToModel.updateBindings(true);
					// 	}
					// });

					jQuery.ajax({
						type: 'GET',

						//	url: storeUserUrl + "?&werks=in.(" + shipto + ")",
						url: storeUserUrl + "?&werks=in.(1110)",
						success: function (data) {
							UserData = data[0];
							var storeUserModel = new JSONModel(UserData);
							initScope.getView().setModel(storeUserModel, "storeUserModel");
						}
					});
					var detailInboundModel = new sap.ui.model.json.JSONModel(this.data);
					this.getView().setModel(detailInboundModel, "detailInboundModel");

				}
			},
			OnSave: function (oEvent) {
				var oController = this;
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var InboundItemURL = oBundle.getText("InboundItemURL");
				var InboundData = this.getView().getModel('inboundDetailModel').getData().items;
				var Payload = {};
				for (var i = 0; i < InboundData.length; i++) {
					if (i + 1 === InboundData.length) {
						var showMessage = true;
					} else {
						showMessage = false;
					}
					Payload.vbeln = InboundData[i].vbeln;
					Payload.posnr = InboundData[i].posnr;
					Payload.vstel = InboundData[i].vstel;
					Payload.matnr = InboundData[i].matnr;
					Payload.erdat = InboundData[i].erdat;
					Payload.lfimg = InboundData[i].lfimg;
					Payload.meins = InboundData[i].meins;
					Payload.arktx = InboundData[i].arktx;
					Payload.vgbel = InboundData[i].vgbel;
					Payload.vgpos = InboundData[i].vgpos;
					Payload.xblnr_ref = InboundData[i].xblnr_ref;

					$.ajax({
						type: "PATCH",
						url: InboundItemURL + "?&vbeln=in.(" + Payload.vbeln + ")&posnr=in.(" + Payload.posnr + ")",
						data: JSON.stringify(Payload),
						contentType: "application/json; charset=utf-8",
						dataType: "json",
						success: function (oResponse) {
							if (showMessage === true) {
								var message = "Inbound Delivery has been updated";
								oController.showSuccess(message);
							}
						},
						error: function (oError) {
							oController.showSuccess(oError);
						}

					});
				}
			},
			showSuccess: function (message) {
				// if (message.responseText === "" && message.status === 201) {
					MessageBox.show(
						message, {
							icon: sap.m.MessageBox.Icon.SUCCESS,
							title: "Inbound Delivery",
							actions: [sap.m.MessageBox.Action.CLOSE],
							onClose: function (oAction) {}
						});
				// }
			},
			showError: function (message) {
				MessageBox.show(
					message.statusText, {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Inbound Delivery",
						actions: [sap.m.MessageBox.Action.CLOSE],
						onClose: function (oAction) {}
					});
			},
			onBackLaunchpad: function () {
				this.getOwnerComponent().getRouter().navTo("launchPad");
			}

		});
	});