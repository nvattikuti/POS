sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		
		sideNaveModel: function () {
			var oModel = new JSONModel({
				"titleMenu": [{
					"title": "Material Master",
					"icon": "sap-icon://activity-items"
				}, {
					"title": "Customer Master",
					"icon": "sap-icon://customer"
				}, {
					"title": "Promotions",
					"icon": "sap-icon://activate"
				},
				{
					"title": "Data Sync",
					"icon": "sap-icon://synchronize"
				}, {
					"title": "Inventory",
					"icon": "sap-icon://inventory"
				}, {
					"title": "Return",
					"icon": "sap-icon://undo"
				},
				{
					"title": "Purchasing",
					"icon": "sap-icon://credit-card"
				}]
			});
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		
		
		launchPadSideModel: function () {
			var olpsModel = new JSONModel({
				"titleMenu": [{
					"title": "Users Creation",
					"icon": "sap-icon://add-employee"
				}, {
					"title": "User Change",
					"icon": "sap-icon://user-edit"
				}, {
					"title": "Form Setup",
					"icon": "sap-icon://form"
				},
				{
					"title": "Settings",
					"icon": "sap-icon://action-settings"
				}]
			});
			olpsModel.setDefaultBindingMode("OneWay");
			return olpsModel;
		}

	};
});