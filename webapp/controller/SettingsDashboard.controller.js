sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("PosClient.controller.SettingsDashboard", {

		 onInit: function() {
			var oSettingsModel = new JSONModel(jQuery.sap.getModulePath("PosClient.model", "/settings.json"));
				this.getView().setModel(oSettingsModel, "oSettingsModel");
		 /*	var oView = this.getView();
		 	this.oSettingsDashboard = oView.byId("settings_dashboard");
		 	var sdUrl = 'https://api.myjson.com/bins/dczv6';*/

		// 	jQuery.ajax({
		// 		type: 'GET',
		// 		url: sdUrl,
		// 		success: function(data) {
		// 			var settingsData = jQuery.sap.getModulePath("sap.suite.ui.commons.ProcessFlow", data);
		// 			var oModeSD = new JSONModel(settingsData);
		// 			oView.setModel(oModeSD,"sdData");
		// 			oModeSD.attachRequestCompleted(this.oSettingsDashboard.updateModel.bind(this.oSettingsDashboard));
		// 		}
		// 	});
		 },
		// onHeaderPress: function(event) {
			
		// }

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf PosClient.view.SettingsDashboard
		 */
		//	onInit: function() {
		//
		//	},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf PosClient.view.SettingsDashboard
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf PosClient.view.SettingsDashboard
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf PosClient.view.SettingsDashboard
		 */
		//	onExit: function() {
		//
		//	}

	});

});