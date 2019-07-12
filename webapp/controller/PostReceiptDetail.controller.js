sap.ui.define(["sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		'sap/m/MessageBox',
		"sap/ui/model/json/JSONModel"
	],
	function (Controller, MessageToast, MessageBox, JSONModel) {
		"use strict";
		var method;
		var zuser;
		return Controller.extend("PosClient.controller.PostReceiptDetail", {
			/**
			 *@memberOf PosClient.controller.Sales
			 */

			onInit: function () {
				this.getOwnerComponent().getRouter().attachRouteMatched(this._onRouteMatched, this);
			},

			_onRouteMatched: function (oEvent) {
				if (oEvent.getParameter("name") === "PostReceiptDetail") {
					var vbeln = oEvent.getParameter("arguments").vbeln;
					var oController = this;
					var initScope = this;
					var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
					var PostReceiptItemURL = oBundle.getText("PostReceiptItemURL");
					var inboundItemURL = oBundle.getText("inboundItemURL");
					var storeUserUrl = oBundle.getText("storeUserUrl");
					var inboundURL = oBundle.getText("inboundURL");
					var PostReceiptDetailData = {};
					var settingsUrl = oBundle.getText("settingsUrl");
					var storeUserUrl = oBundle.getText("storeUserUrl");
					var incrementData = {};
					jQuery.ajax({
						type: 'GET',
						url: storeUserUrl,
						success: function (data) {
							zuser = data[0].zuser;
						}
					});
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
					var postReceiptData = {};

					jQuery.ajax({
						type: 'GET',
						url: inboundURL + "?&vbeln=in.(" + vbeln + ")",
						success: function (data) {
							postReceiptData = data[0];
							var PostReceiptModel = new JSONModel(postReceiptData);
							initScope.getView().setModel(PostReceiptModel, "PostReceiptModel");
						}
					});

					jQuery.ajax({
						type: 'GET',
						url: PostReceiptItemURL + "?&vbeln=in.(" + vbeln + ")",
						success: function (data) {
							PostReceiptDetailData.items = data;
							if (PostReceiptDetailData.items.length === 0) {
								method = "POST";
								jQuery.ajax({
									type: 'GET',
									url: inboundItemURL + "?&vbeln=in.(" + vbeln + ")",
									success: function (data) {
										PostReceiptDetailData.items = data;
										var PostReceiptDetailModel = new JSONModel(PostReceiptDetailData);
										initScope.getView().setModel(PostReceiptDetailModel, "PostReceiptDetailModel");
									}
								});
							} else {
								method = "PATCH";
								var PostReceiptDetailModel = new JSONModel(PostReceiptDetailData);
								initScope.getView().setModel(PostReceiptDetailModel, "PostReceiptDetailModel");
							}
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
					var detailPostReceiptModel = new sap.ui.model.json.JSONModel(this.data);
					this.getView().setModel(detailPostReceiptModel, "detailPostReceiptModel");

				}
			},
			OnSave: function (oEvent) {
				var oController = this;
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var PostReceiptItemURL = oBundle.getText("PostReceiptItemURL");
				var postReceiptData = this.getView().getModel('PostReceiptDetailModel').getData().items;
				var Payload = {};
				if (method === "PATCH") {
					for (var i = 0; i < postReceiptData.length; i++) {
						if (i + 1 === postReceiptData.length) {
							var showMessage = true;
						} else {
							showMessage = false;
						}
						Payload.vbeln = postReceiptData[i].vbeln;
						Payload.posnr = postReceiptData[i].posnr;
						Payload.vstel = postReceiptData[i].vstel;
						Payload.matnr = postReceiptData[i].matnr;
						Payload.erdat = postReceiptData[i].erdat;
						Payload.menge = postReceiptData[i].menge;
						Payload.lfimg = postReceiptData.lfimg;
						Payload.meins = postReceiptData[i].meins;
						Payload.arktx = postReceiptData[i].arktx;
						Payload.lgort = postReceiptData[i].lgort;
						Payload.zuser = zuser;
						// Payload.vgbel = postReceiptData[i].vgbel;
						// Payload.vgpos = postReceiptData[i].vgpos;
						Payload.xblnr_ref = postReceiptData[i].xblnr_ref;

						$.ajax({
							type: "PATCH",
							url: PostReceiptItemURL + "?&vbeln=in.(" + Payload.vbeln + ")&posnr=in.(" + Payload.posnr + ")",
							data: JSON.stringify(Payload),
							contentType: "application/json; charset=utf-8",
							dataType: "json",
							success: function (oResponse) {
								if (showMessage === true) {
									var message = "Post receipt has been updated";
									oController.showSuccess(message);
								}
							},
							error: function (oError) {
								oController.showSuccess(oError);
							}

						});
					}
				} else {
					for (var i = 0; i < postReceiptData.length; i++) {
						if (i + 1 === postReceiptData.length) {
							var showMessage = true;
						} else {
							showMessage = false;
						}
						Payload[i].vbeln = postReceiptData[i].vbeln;
						Payload[i].posnr = postReceiptData[i].posnr;
						Payload[i].vstel = postReceiptData[i].vstel;
						Payload[i].matnr = postReceiptData[i].matnr;
						Payload[i].erdat = postReceiptData[i].erdat;
						Payload[i].menge = postReceiptData[i].menge;
						Payload[i].lfimg = postReceiptData[i].lfimg;
						Payload[i].meins = postReceiptData[i].meins;
						Payload[i].arktx = postReceiptData[i].arktx;
						Payload[i].lgort = postReceiptData[i].lgort;
						Payload[i].zuser = zuser;
						// Payload.vgbel = postReceiptData[i].vgbel;
						// Payload.vgpos = postReceiptData[i].vgpos;
						Payload[i].xblnr_ref = postReceiptData[i].xblnr_ref;
					}
					$.ajax({
						type: "POST",
						url: PostReceiptItemURL,
						data: JSON.stringify(Payload),
						contentType: "application/json; charset=utf-8",
						dataType: "json",
						success: function (oResponse) {
							if (showMessage === true) {
								var message = "Post Receipt has been created";
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
				if (message.responseText === "" && message.status === 201) {
					MessageBox.show(
						message.statusText, {
							icon: sap.m.MessageBox.Icon.SUCCESS,
							title: "Inbound Delivery",
							actions: [sap.m.MessageBox.Action.CLOSE],
							onClose: function (oAction) {}
						});
				}
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