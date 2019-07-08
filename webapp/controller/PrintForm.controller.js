/* global print.min:true */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"PosClient/libs/print.min"
], function(Controller, printJS, MessageToast) { 
	"use strict";

	return Controller.extend("PosClient.controller.PrintForm", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf PosClient.view.PrintForm
		 */
		onInit: function() {
          
		},
		printInvoice: function(oEvent) {

			this.getView().byId("backBtn").setVisible(false);
			this.getView().byId("ptnInvBtn").setVisible(false);
			this.getView().byId("ptnReceiptBtn").setVisible(false);
			/*	var oTarget = this.getView(),
			sTargetId = oEvent.getSource().data("targetId");
			if (sTargetId) {
				oTarget = oTarget.byId(sTargetId);
			}*/
			var oTarget = this.getView().byId("printInvoiceReceipt");
			if (oTarget) {
				var $domTarget = oTarget.getItems()[0],
					//var $domTarget = oTarget.$()[0],
					sTargetContent = $domTarget.innerHTML,
					sOriginalContent = $domTarget.innerHTML;

				$domTarget.innerHTML = sTargetContent;
				alert($domTarget.innerHTML);
				window.print();
//                printJS('printInvoiceReceipt', 'html');
				$domTarget.innerHTML = sOriginalContent;
			} else {
				jQuery.sap.log.error("onPrint needs a valid target container [view|data:targetId=\"SID\"]");
			}
			// var oRouter = this.getOwnerComponent().getRouter();
			// oRouter.navTo("print");

 		},
		printReceipt: function() {
//            var print_Url = $.sap.getModulePath("PosClient", "/css/");
//            var printCssUrl = print_Url + "style.css";

//var win = window;
var toPrint = this.getView().byId("printInvoiceReceipt");;
var printCssUrl;
var sprintCss;
$.each(document.styleSheets, function(index, oStyleSheet) {
//$document.styleSheets.each ( function(index, oStyleSheet) {	
//	alert("JK");
  if(oStyleSheet.href){
    var link = document.createElement("link");
    link.type = oStyleSheet.type;
    link.rel = "stylesheet";
    link.href = oStyleSheet.href;
    var printCss = link.outerHTML;
    sprintCss = printCss;
    printCssUrl = printCssUrl + sprintCss;
    //win.document.head.appendChild(link); --> this doesn't work in IE
//    win.document.getElementsByTagName("head")[0].innerHTML = win.document.getElementsByTagName("head")[0].innerHTML + link.outerHTML;
//    alert(win.document.getElementsByTagName("head")[0].innerHTML);
  // if (printCssUrl=undefined) {
  // 	 printCssUrl = link.outerHTML;
  // 	 alert(1)
  // } else
  //	 var printCssUrl = printCssUrl + link.outerHTML;
  //	alert(printCssUrl);
  }
  //if (printCssUrl!=undefined) {  
  //  printCssUrl.push(printCss);
  //} 
});

//alert (printCssUrl);
//           var printCssUrl = win.document.getElementsByTagName("head")[0].innerHTML;
//            var win = window.open("", "PrintWindow");
            var toPrint = document.getElementById('printInvoiceReceipt'); 
            printCssUrl = printCssUrl.replace(undefined, "");
            printCssUrl.trim();
            var hContent = '<html><head>' + printCssUrl + '</head><body>';	
//          	var hContent = '<html><head></head><body>';
			var bodyContent = $(".outerWrapper").html();
			var closeContent = "</body></html>";
			var htmlpage = hContent + bodyContent + closeContent;
//			printJS(htmlpage, 'html');
			window.document.write(htmlpage);
			window.print();
			window.stop();
//			alert(htmlpage);

//var win = window.open("", "PrintWindow");
// $.each(document.styleSheets, function(index, oStyleSheet) {
// //$document.styleSheets.each ( function(index, oStyleSheet) {	
// //	alert("JK");
//   if(oStyleSheet.href){
//     var link = document.createElement("link");
//     link.type = oStyleSheet.type;
//     link.rel = "stylesheet";
//     link.href = oStyleSheet.href;
//     //win.document.head.appendChild(link); --> this doesn't work in IE
//     win.document.getElementsByTagName("head")[0].innerHTML = win.document.getElementsByTagName("head")[0].innerHTML + link.outerHTML;
//     alert(win.document.getElementsByTagName("head")[0].innerHTML);
  	
//   }
// });
//			win.document.write(htmlpage);
//			win.print();
//			win.stop();
		},

// 		gotoprintView: function() {
// 				this.getOwnerComponent().getRouter().navTo("pos");
// 			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf PosClient.view.PrintForm
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf PosClient.view.PrintForm
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf PosClient.view.PrintForm
		 */
		//	onExit: function() {
		//
		//	}
// 			onPrint: function() {
//             var print_Url = $.sap.getModulePath("PosClient", "/css/");
//             var printCssUrl = print_Url + "style.css";
//             var hContent = '<html><head><link rel="stylesheet" href=' + printCssUrl +' type="text/css" /></head><body>';	
// //          	var hContent = '<html><head></head><body>';
// 			var bodyContent = $(".printArea").html();
// 			var closeContent = "</body></html>";
// 			var htmlpage = hContent + bodyContent + closeContent;

// 			var win = window.open("", "PrintWindow");
// 			win.document.write(htmlpage);
// 			win.print();
// 			win.stop();
// 			},
	});
});