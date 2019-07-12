sap.ui.define(["sap/ui/core/mvc/Controller",
		"sap/m/MessageToast"
	],
	function (Controller, MessageToast) {
		"use strict";
		return Controller.extend("PosClient.controller.Inbound", {
			/**
			 *@memberOf PosClient.controller.Sales
			 */

			onInit: function () {
				this.getOwnerComponent().getRouter().attachRouteMatched(this._onRouteMatched, this);
			},

			_onRouteMatched: function (oEvent) {
				if (oEvent.getParameter("name") === "inbound") {

				}
			},

			onBackLaunchpad: function () {
				this.getOwnerComponent().getRouter().navTo("launchPad");
			}

		});
	});