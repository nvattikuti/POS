var MasterController;
sap.ui.define(["sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/ui/model/json/JSONModel"
	],
	function (Controller, MessageToast, JSONModel) {
		"use strict";
		var zuser;
		return Controller.extend("PosClient.controller.OutboundReqMaster", {
			/**
			 *@memberOf PosClient.controller.Sales
			 */
			onInit: function () {
				MasterController = this;
				this.getOwnerComponent().getRouter().attachRouteMatched(this._onRouteMatched, this);
			},

			_onRouteMatched: function (oEvent) {
				if (oEvent.getParameter("name") === "OutboundRequest" || oEvent.getParameter("name") === "OutboundReqMaster") {
					var oController = this;
					var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
					var outboundRequestUrl = oBundle.getText("outboundRequestUrl");
					var storeUserUrl = oBundle.getText("storeUserUrl");
					// this.getView().byId("TableModifId").setVisible(false);
					// this.getView().byId("TableCreateId").setVisible(true)
					jQuery.ajax({
						type: 'GET',
						url: storeUserUrl,
						success: function (data) {
							zuser = data[0].zuser;
						}
					});
					jQuery.ajax({
						type: 'GET',
						url: storeUserUrl,
						success: function (data) {
							jQuery.ajax({
								type: 'GET',
								url: outboundRequestUrl + "?&docstatus=in.(1)&zuser=in.(" + data[0].zuser + ")",
								success: function (outbounddata) {
									var outboundRequest = [];
									// var posHdr = [];
									var duplicateInd;
									for (var i = 0; i < outbounddata.length; i++) {
										if (i > 0) {
											duplicateInd = false;
											for (var j = 0; j < outboundRequest.length; j++) {
												if (outboundRequest[j].xblnr_mkpf === outbounddata[i].xblnr_mkpf) {
													duplicateInd = true;
													break;
												}
											}
											if (duplicateInd === false) {
												outboundRequest[i] = {};
												outboundRequest[i].xblnr_mkpf = outbounddata[i].xblnr_mkpf;
												outboundRequest[i].werks = outbounddata[i].werks;
												outboundRequest[i].budat_mkpf = outbounddata[i].budat_mkpf;
											}
										} else {
											outboundRequest[i] = {};
											outboundRequest[i].xblnr_mkpf = outbounddata[i].xblnr_mkpf;
											outboundRequest[i].werks = outbounddata[i].werks;
											outboundRequest[i].budat_mkpf = outbounddata[i].budat_mkpf;
										}
									}
									// var posHdr = outboundRequest.filter(function (item, index) {
									// 	return outboundRequest.indexOf(item) >= index;
									// });
									// for (i = 0; i < outboundRequest.length; i++) {
									// 	if (posHdr.indexOf(outboundRequest[i].xblnr_mkpf) === -1) {
									// 		posHdr.push(outboundRequest[i]);
									// 	}
									// }

									var oPosReqModel = new JSONModel();
									oPosReqModel.setData(outboundRequest);
									oController.getView().setModel(oPosReqModel, 'OutboundHdrModel');
								}

							});
						}
					});
					this.OnAdd();
				}
			},

			onBackLaunchpad: function () {
				this.getOwnerComponent().getRouter().navTo("launchPad");
			},

			OnAdd: function (oEvent) {
				this.getOwnerComponent().getRouter().navTo("OutboundReqDetail", {
					xblnr_mkpf: "New"
				});
			},
			onListItemPress: function (oEvent) {
				this.getOwnerComponent().getRouter().navTo("OutboundReqDetail", {
					xblnr_mkpf: oEvent.getSource().getBindingContext("OutboundHdrModel").getObject().xblnr_mkpf
				});
			},

			onSearch: function (evt) {
				var initScope = this;
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var outboundRequestUrl = oBundle.getText("outboundRequestUrl");
				var sQuery = evt.getSource().getValue();
				if (sQuery !== "") {
					outboundRequestUrl = outboundRequestUrl + "?&xblnr_mkpf=in.(" + sQuery + ")&zuser=in.(" + zuser + ")";
				} else {
					outboundRequestUrl = outboundRequestUrl + "?&zuser=in.(" + zuser + ")";
				}
				jQuery.ajax({
					type: 'GET',
					url: outboundRequestUrl,
					success: function (outbounddata) {
						var duplicateInd;
						var outboundRequest = [];
						for (var i = 0; i < outbounddata.length; i++) {
							if (i > 0) {
								duplicateInd = false;
								for (var j = 0; j < outboundRequest.length; j++) {
									if (outboundRequest[j].xblnr_mkpf === outbounddata[i].xblnr_mkpf) {
										duplicateInd = true;
										break;
									}
								}
								if (duplicateInd === false) {
									outboundRequest[i] = {};
									outboundRequest[i].xblnr_mkpf = outbounddata[i].xblnr_mkpf;
									outboundRequest[i].werks = outbounddata[i].werks;
									outboundRequest[i].budat_mkpf = outbounddata[i].budat_mkpf;
									if (outbounddata[i].docstatus === "1") {
										outboundRequest[i].Editable = true;
									} else {
										outboundRequest[i].Editable = false;
									}
								}
							} else {
								outboundRequest[i] = {};
								outboundRequest[i].xblnr_mkpf = outbounddata[i].xblnr_mkpf;
								outboundRequest[i].werks = outbounddata[i].werks;
								outboundRequest[i].budat_mkpf = outbounddata[i].budat_mkpf;
								if (outbounddata[i].docstatus === "1") {
									outboundRequest[i].Editable = true;
								} else {
									outboundRequest[i].Editable = false;
								}
							}
						}
						var outboundModel = new JSONModel(outboundRequest);
						initScope.getView().setModel(outboundModel, "OutboundHdrModel");
					}
				});
			}

		});
	});