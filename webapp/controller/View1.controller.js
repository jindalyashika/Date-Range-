sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast"
], function (Controller, JSONModel, DateFormat, MessageToast) {
    "use strict";

    const MAX_DAYS = 62;
    const ONE_DAY = 24 * 60 * 60 * 1000;

    return Controller.extend("project3.controller.View1", {

        onInit: function () {
            this.getView().setModel(new JSONModel({ rows: [] }));
        },

        onGenerate: function () {
            const oDRS = this.byId("drs");
            const dFrom = oDRS.getDateValue();
            const dTo = oDRS.getSecondDateValue();

            if (!dFrom || !dTo) {
                MessageToast.show("select date range ");
                return;
            }

            let n = Math.round((dTo - dFrom) / ONE_DAY) + 1;
            if (n > MAX_DAYS) {
                MessageToast.show("Max " + MAX_DAYS + " days can be visible");
                n = MAX_DAYS;
            }

            const oTable = this.byId("dynTable");
            const oColTemplate = this.byId("colTemplate");
            const oDateFmt = DateFormat.getDateInstance({ pattern: "dd MMM" });
            const oDayFmt = DateFormat.getDateInstance({ pattern: "EEE" });

            // remove old columns
            oTable.getColumns().slice(1).forEach(function (oCol) {
                oTable.removeColumn(oCol);
                oCol.destroy();
            });

            //make n columns
            for (let i = 0; i < n; i++) {
                const oDate = new Date(dFrom);
                oDate.setDate(oDate.getDate() + i);

                const oNewCol = oColTemplate.clone();
                const aLabels = oNewCol.getMultiLabels();

                aLabels[0].setText(oDateFmt.format(oDate)); // header: 05 Oct
                aLabels[1].setText(oDayFmt.format(oDate));  // sub header: Mon

          
                oNewCol.getTemplate().bindProperty("value", "values/" + i);

                oTable.addColumn(oNewCol);
            }

            // Rows data
            const aRows = ["Row 1", "Row 2"].map(function (sName) {
                return { name: sName, values: new Array(n).fill("") };
            });
            this.getView().getModel().setData({ rows: aRows });
        }
    });
});