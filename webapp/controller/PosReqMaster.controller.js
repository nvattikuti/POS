var MasterController;
sap.ui.define(["sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/ui/model/json/JSONModel"
	],
	function (Controller, MessageToast, JSONModel) {
		"use strict";
		var zuser;
		return Controller.extend("PosClient.controller.PosReqMaster", {
			/**
			 *@memberOf PosClient.controller.Sales
			 */
			onInit: function () {
				MasterController = this;
				this.getOwnerComponent().getRouter().attachRouteMatched(this._onRouteMatched, this);
			},

			_onRouteMatched: function (oEvent) {
				if (oEvent.getParameter("name") === "PosReq" || oEvent.getParameter("name") === "PosReqMaster") {
					var oController = this;
					var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
					var posRequestUrl = oBundle.getText("posRequestUrl");
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
								url: posRequestUrl + "?&docstatus=in.(1)&zuser=in.(" + data[0].zuser + ")",
								success: function (posdata) {
									var posRequest = [];
									// var posHdr = [];
									var duplicateInd;
									for (var i = 0; i < posdata.length; i++) {
										if (i > 0) {
											duplicateInd = false;
											for (var j = 0; j < posRequest.length; j++) {
												if (posRequest[j].xblnr_mkpf === posdata[i].xblnr_mkpf) {
													duplicateInd = true;
													break;
												}
											}
											if (duplicateInd === false) {
												posRequest[i] = {};
												posRequest[i].xblnr_mkpf = posdata[i].xblnr_mkpf;
												posRequest[i].werks = posdata[i].werks;
												posRequest[i].budat_mkpf = posdata[i].budat_mkpf;
											}
										} else {
											posRequest[i] = {};
											posRequest[i].xblnr_mkpf = posdata[i].xblnr_mkpf;
											posRequest[i].werks = posdata[i].werks;
											posRequest[i].budat_mkpf = posdata[i].budat_mkpf;
										}
									}
									// var posHdr = posRequest.filter(function (item, index) {
									// 	return posRequest.indexOf(item) >= index;
									// });
									// for (i = 0; i < posRequest.length; i++) {
									// 	if (posHdr.indexOf(posRequest[i].xblnr_mkpf) === -1) {
									// 		posHdr.push(posRequest[i]);
									// 	}
									// }

									var oPosReqModel = new JSONModel();
									oPosReqModel.setData(posRequest);
									oController.getView().setModel(oPosReqModel, 'posHdrModel');
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
				this.getOwnerComponent().getRouter().navTo("PosReqDetail", {
					banfn: "New"
				});
			},
			onListItemPress: function (oEvent) {
				this.getOwnerComponent().getRouter().navTo("PosReqDetail", {
					banfn: oEvent.getSource().getBindingContext("posHdrModel").getObject().xblnr_mkpf
				});
			},

			onSearch: function (evt) {
				var initScope = this;
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var posRequestUrl = oBundle.getText("posRequestUrl");
				var sQuery = evt.getSource().getValue();
				if(sQuery !== ""){
		        	posRequestUrl = posRequestUrl + "?&xblnr_mkpf=in.(" + sQuery + ")&zuser=in.(" + zuser + ")";		
				}else{
				posRequestUrl=	posRequestUrl + "?&zuser=in.(" + zuser + ")";
				}
				jQuery.ajax({
					type: 'GET',
					url: posRequestUrl,
					success: function (posdata) {
						var duplicateInd;
						var posRequest = [];
						for (var i = 0; i < posdata.length; i++) {
							if (i > 0) {
								duplicateInd = false;
								for (var j = 0; j < posRequest.length; j++) {
									if (posRequest[j].xblnr_mkpf === posdata[i].xblnr_mkpf) {
										duplicateInd = true;
										break;
									}
								}
								if (duplicateInd === false) {
									posRequest[i] = {};
									posRequest[i].xblnr_mkpf = posdata[i].xblnr_mkpf;
									posRequest[i].werks = posdata[i].werks;
									posRequest[i].budat_mkpf = posdata[i].budat_mkpf;
									if (posdata[i].docstatus === "1") {
										posRequest[i].Editable = true;
									} else {
										posRequest[i].Editable = false;
									}
								}
							} else {
								posRequest[i] = {};
								posRequest[i].xblnr_mkpf = posdata[i].xblnr_mkpf;
								posRequest[i].werks = posdata[i].werks;
								posRequest[i].budat_mkpf = posdata[i].budat_mkpf;
								if (posdata[i].docstatus === "1") {
									posRequest[i].Editable = true;
								} else {
									posRequest[i].Editable = false;
								}
							}
						}
						var posModel = new JSONModel(posRequest);
						initScope.getView().setModel(posModel, "posHdrModel");
					}
				});
			}

		});
	});