import { GridMetaDataType } from "@acuteinfo/common-base";
export const StopPayGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "ChequeStopDetail",
    rowIdColumn: "TRAN_CD",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    disableGroupBy: true,
    enablePagination: true,
    hideFooter: false,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "calc(100vh - 282px)",
      max: "calc(100vh - 282px)",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    // searchPlaceholder: "Stop Cheque Detail",
    footerNote: "StopPayFooterNote",
  },
  filters: [],
  columns: [
    {
      accessor: "ID",
      columnName: "SrNo",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      width: 77,
      minWidth: 70,
      maxWidth: 100,
      isAutoSequence: true,
    },
    {
      accessor: "TRAN_DT",
      columnName: "IntimateDate",
      sequence: 2,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 117,
      minWidth: 100,
      maxWidth: 130,
    },
    {
      accessor: "CHEQUE_FROM",
      columnName: "FromChequeNo",
      sequence: 4,
      alignment: "center",
      componentType: "default",
      width: 142,
      minWidth: 90,
      maxWidth: 180,
    },
    {
      accessor: "CHEQUE_TO",
      columnName: "ToChequeNo",
      sequence: 4,
      alignment: "center",
      componentType: "default",
      width: 129,
      minWidth: 90,
      maxWidth: 170,
    },
    {
      accessor: "CHEQUE_DT",
      columnName: "ChequeDate",
      sequence: 4,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 115,
      minWidth: 90,
      maxWidth: 140,
    },

    {
      accessor: "CHEQUE_AMOUNT",
      columnName: "ChequeAmount",
      sequence: 5,
      alignment: "right",
      componentType: "currency",
      width: 120,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 250,
      minWidth: 200,
      maxWidth: 300,
    },
    {
      accessor: "FLAG",
      columnName: "ChequeStopType",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 125,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "CONFIRMED_DISPLAY",
      columnName: "Status",
      sequence: 6,
      alignment: "center",
      componentType: "default",
      width: 80,
      minWidth: 60,
      maxWidth: 100,
    },
    {
      accessor: "ALLOW_DELETE",
      columnName: "Action",
      buttonLabel: "Delete",
      sequence: 8,
      alignment: "center",
      componentType: "buttonRowCell",
      shouldExclude: (initialValue, original, prevRows, nextRows) => {
        if (initialValue === "Y") {
          return false;
        }
        return true;
      },
      width: 90,
      minWidth: 60,
      maxWidth: 130,
    },
    // {
    //   accessor: "RELEASE",
    //   columnName: "Release",
    //   buttonLabel: "Release",
    //   sequence: 8,
    //   alignment: "center",
    //   componentType: "buttonRowCell",
    //   // shouldExclude: (initialValue, original, prevRows, nextRows) => {
    //   //   if (initialValue === "Y") {
    //   //     return false;
    //   //   }
    //   //   return true;
    //   // },
    //   width: 90,
    //   minWidth: 60,
    //   maxWidth: 130,
    // },
    // {
    //   accessor: "PRINT",
    //   columnName: "Print",
    //   buttonLabel: "Print",
    //   sequence: 8,
    //   alignment: "center",
    //   componentType: "buttonRowCell",
    //   // shouldExclude: (initialValue, original, prevRows, nextRows) => {
    //   //   if (initialValue === "Y") {
    //   //     return false;
    //   //   }
    //   //   return true;
    //   // },
    //   width: 90,
    //   minWidth: 60,
    //   maxWidth: 130,
    // },
  ],
};
