sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function(Controller, JSONModel, MessageToast) {
	"use strict";

	return Controller.extend("PosClient.controller.SettingsView", {

		onInit: function() {
			var me = this;
			var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var settingsUrl = oBundle.getText("settingsUrl");
			var settingsStoreUrl = oBundle.getText("settingsStoreUrl");
			 var storeListData = {};

			jQuery.ajax({
				type: 'GET',
				url: settingsUrl,
				success: function(data) {
					//					console.log(data.length);
					if (data[0].base_url != null) {
						me.getView().byId("__tile0").setInfo("Connected");
						me.getView().byId("__tile0").setInfoState("Success");
						me.getView().byId("__tile0").mEventRegistry.press = [];
					}
				}
			});

			jQuery.ajax({
				type: 'GET',
				//				url: settingsStoreUrl,
				url: settingsUrl,
				success: function(data) {
					//					storeListData.items = data;
					if (data[0].plantname != null) {
						var storeName = (data[0].plantname);
						//if(data.length) {
						me.getView().byId("__tile1").setInfo(storeName);
						me.getView().byId("__tile1").setInfoState("Success");
						me.getView().byId("__tile1").mEventRegistry.press = [];
						//					var storeListModel = new JSONModel(storeListData);
						//					me.getView().setModel(storeListModel, "storeListModel");
						//					console.log(storeListModel.getData());
					} else {
						jQuery.ajax({
							type: 'GET',
							url: settingsStoreUrl,
							success: function(data) {
								if (data.length != null) {
									storeListData.items = data;
									var storeListModel = new JSONModel(storeListData);
									me.getView().setModel(storeListModel, "storeListModel");
								}
							}
						});
					}
				}
			});
		},

		showCreateDialog: function() {
			var view = this.getView();
			var me = this;
			var createDialog = view.byId("CreateDialog");
			var oDummyController = {
				submitDialog: function() {
					var serviceBaseUrl = view.byId("hostAddress").getValue();
					serviceBaseUrl = serviceBaseUrl + "/sap/opu/odata/sap/";
					var hostClientID = view.byId("hostClientID").getValue();
					var hostUsername = view.byId("hostUsername").getValue();
					var hostPassword = view.byId("hostPassword").getValue();

					var oBundle = me.getOwnerComponent().getModel("i18n").getResourceBundle();
					var getOdataUrl = oBundle.getText("getOdataUrl");

					let oDataConnection = getOdataUrl + "?username=" + hostUsername +
						"&password=" + hostPassword + "&host=" + serviceBaseUrl + "&client=" + hostClientID;

					jQuery.ajax({
						type: 'GET',
						url: oDataConnection,
						success: function(data) {
							if (data.statusCode === 201) {
								MessageToast.show("Connection Successful");
								me.getView().byId("__tile0").setInfo("Connected");
								me.getView().byId("__tile0").setInfoState("Success");
								me.getView().byId("__tile0").mEventRegistry.press = [];
								createDialog.close();
							} else if (data.statusCode === 200) {
								MessageToast.show("Problem in storing the Connection Details");
							} else {
								MessageToast.show("Invalid Connection Details");
							}
						},
						error: function(e) {
							MessageToast.show("Invalid Connection Details");
						}
					});

				},
				closeDialog: function() {
					createDialog.close();
				}
			};
			if (!createDialog) {
				createDialog = sap.ui.xmlfragment(view.getId(), "PosClient.fragment.ConnectivityDialog", oDummyController);
			}
			view.addDependent(createDialog);
			createDialog.open();
			if (!createDialog.isOpen()) {
				//do sth
			}
		},
// Number Range Data
		showConfigDialog: function() {
			var view = this.getView();
			var me = this;
			var configDialog = view.byId("ConfigDialog");
			var oDummyController = {
				submitDialog: function() {
					var serviceBaseUrl = view.byId("hostAddress").getValue();
					serviceBaseUrl = serviceBaseUrl + "/sap/opu/odata/sap/";
					var hostClientID = view.byId("hostClientID").getValue();
					var hostUsername = view.byId("hostUsername").getValue();
					var hostPassword = view.byId("hostPassword").getValue();

					var oBundle = me.getOwnerComponent().getModel("i18n").getResourceBundle();
					var getOdataUrl = oBundle.getText("getOdataUrl");

					let oDataConnection = getOdataUrl + "?username=" + hostUsername +
						"&password=" + hostPassword + "&host=" + serviceBaseUrl + "&client=" + hostClientID;

					jQuery.ajax({
						type: 'GET',
						url: oDataConnection,
						success: function(data) {
							if (data.statusCode === 201) {
								MessageToast.show("Connection Successful");
								me.getView().byId("__tile0").setInfo("Connected");
								me.getView().byId("__tile0").setInfoState("Success");
								me.getView().byId("__tile0").mEventRegistry.press = [];
								createDialog.close();
							} else if (data.statusCode === 200) {
								MessageToast.show("Problem in storing the Connection Details");
							} else {
								MessageToast.show("Invalid Connection Details");
							}
						},
						error: function(e) {
							MessageToast.show("Invalid Connection Details");
						}
					});

				},
				closeDialog: function() {
					configDialog.close();
				}
			};
			if (!configDialog) {
				configDialog = sap.ui.xmlfragment(view.getId(), "PosClient.fragment.ConfigureDialog", oDummyController);
			}
			view.addDependent(configDialog);
			configDialog.open();
			if (!configDialog.isOpen()) {
				//do sth
			}
		},


//End of Number Range Data
		
		
		showStoreDialog: function() {
			var view = this.getView();
			var me = this;
			var storeDialog = view.byId("StoreDialog");
			var oStoreController = {
				submitStoreDialog: function() {
					var oBundle = me.getOwnerComponent().getModel("i18n").getResourceBundle();
					var settingDataURL = oBundle.getText("settingsDataUrl");
					var storeID = me.getView().byId("storeSelectBox").getSelectedKey();
					var storeName = me.getView().byId("storeSelectBox")._getSelectedItemText();
					var setting = [];

					//Store Name
					var storeID = {
						"id": "8",
						"setting_key": "plant",
						"setting_value": storeID

					};
					setting.push(storeID);
					//Store Name
					var storeName = {
						"id": "9",
						"setting_key": "plantname",
						"setting_value": storeName

					};
					setting.push(storeName);

					$.ajax({
						type: 'POST',
						url: settingDataURL,
						data: JSON.stringify(setting),
						contentType: "application/json; charset=utf-8",
						success: function(data) {
							//							console.log(data.length);
							//							if (data.length > 0) {
							MessageToast.show("Store Selected");
							storeDialog.close();
							me.getView().byId("__tile1").setInfo(me.getView().byId("storeSelectBox")._getSelectedItemText());
							//							}

						}
					});

					//jQuery.ajax({
					// type: 'POST',
					// url: settingDataURL,
					// data: JSON.stringify(setting),

					//)};	

					// var getOdataUrl = oBundle.getText("getOdataUrl");

					//             let oDataConnection = getOdataUrl + "?username=" + hostUsername +
					//             "&password=" + hostPassword + "&host=" + serviceBaseUrl + "&client=" + hostClientID;

					//             jQuery.ajax({
					// 	type: 'GET',
					// 	url: oDataConnection,
					// 	success: function(data) {
					// 		if(data.statusCode === 201) {
					// 			MessageToast.show("Connection Successful");
					// 			me.getView().byId("__tile0").setInfo("Connected");
					// 			me.getView().byId("__tile0").setInfoState("Success");
					// 	    	me.getView().byId("__tile0").mEventRegistry.press = [];
					// 			storeDialog.close();
					// 		} else if (data.statusCode === 200) {
					// 			MessageToast.show("Problem in storing the Connection Details");
					// 		} else {
					// 			MessageToast.show("Invalid Connection Details");
					// 		}
					// 	}, 
					// 	error: function(e) {
					// 		MessageToast.show("Invalid Connection Details");
					// 	}
					// });

				},
				onStoreChange: function() {
					alert("JK");
				},
				closeDialog: function() {
					storeDialog.close();
				}
			};
			if (!storeDialog) {
				storeDialog = sap.ui.xmlfragment(view.getId(), "PosClient.fragment.StoreSelectionDialog", oStoreController);
			}
			view.addDependent(storeDialog);
			storeDialog.open();
			if (!storeDialog.isOpen()) {
				//do sth
			}
		}

	});

});