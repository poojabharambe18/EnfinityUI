import { MasterDetailsMetaData } from "@acuteinfo/common-base";

export const disbursEntryConfirmMetadata: MasterDetailsMetaData = {
  masterForm: {
    form: {
      name: "disburse-entry-confirm-MetaData",
      label: "",
      resetFieldOnUnmount: false,
      validationRun: "onBlur",
      render: {
        ordering: "auto",
        renderType: "simple",
        gridConfig: {
          item: {
            xs: 12,
            sm: 4,
            md: 4,
          },
          container: {
            direction: "row",
            spacing: 1,
          },
        },
      },
    },
    fields: [
      {
        render: {
          componentType: "textField",
        },
        name: "AC_NO",
        label: "A/C No.",
        isReadOnly: true,
        fullWidth: true,
        GridProps: { xs: 12, sm: 5, md: 3, lg: 3, xl: 3 },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "ACCT_NM",
        label: "A/C Name",
        isReadOnly: true,
        fullWidth: true,
        GridProps: { xs: 12, sm: 5, md: 3, lg: 3, xl: 3 },
      },
      {
        render: { componentType: "amountField" },
        name: "SANCTIONED_AMT",
        label: "Sanction Amount",
        isReadOnly: true,
        fullWidth: true,
        GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
      },
      {
        render: { componentType: "rateOfInt" },
        name: "INT_RATE",
        label: "Int. Rate%",
        isReadOnly: true,
        fullWidth: true,
        GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
      },
      {
        render: { componentType: "textField" },
        name: "INST_TYPE_DISP",
        label: "Int. Frequency",
        isReadOnly: true,
        fullWidth: true,
        GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
      },
      {
        render: { componentType: "textField" },
        name: "TYPE_CD_DISP",
        label: "Installement Type",
        isReadOnly: true,
        fullWidth: true,
        GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
      },
      {
        render: { componentType: "amountField" },
        name: "LIMIT_AMOUNT",
        label: "Total Disbursed Amount",
        isReadOnly: true,
        fullWidth: true,
        GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
      },
      {
        render: { componentType: "textField" },
        name: "INT_FUNDED",
        label: "Int. Funded",
        isReadOnly: true,
        fullWidth: true,
        GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
      },
      {
        render: { componentType: "numberFormat" },
        name: "INT_SKIP_REASON_TRAN_CD",
        label: "Moratorium Months",
        isReadOnly: true,
        fullWidth: true,
        GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
      },
      {
        render: { componentType: "numberFormat" },
        name: "INST_NO",
        label: "No. of Int.",
        isReadOnly: true,
        fullWidth: true,
        GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
      },
      {
        render: { componentType: "amountField" },
        name: "REMAIN_DISB",
        label: "Remaining Disbursement",
        isReadOnly: true,
        fullWidth: true,
        GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
        FormatProps: {
          allowNegative: true,
        },
      },
    ],
  },
  detailsGrid: {
    gridConfig: {
      dense: true,
      gridLabel: "Disbursement Transaction Details",
      rowIdColumn: "SR_CD",
      allowColumnReordering: true,
      hideHeader: false,
      disableGroupBy: true,
      containerHeight: { min: "30vh", max: "67vh" },
      allowRowSelection: false,
      hiddenFlag: "_hidden",
      hideFooter: true,
      disableLoader: true,
      paginationText: "Configured Messages",
    },
    columns: [
      {
        accessor: "SR_CD",
        columnName: "Sr.",
        componentType: "default",
        sequence: 1,
        alignment: "center",
        width: 50,
        maxWidth: 80,
        minWidth: 70,
        isAutoSequence: true,
      },
      {
        accessor: "TYPE_CD",
        columnName: "Tran. Type",
        componentType: "default",
        sequence: 2,
        alignment: "center",
        width: 100,
        maxWidth: 200,
        minWidth: 100,
        isDisplayTotal: true,
        footerLabel: "Rows:",
        setFooterValue(total, rows) {
          return [rows.length];
        },
      },
      {
        accessor: "DISB_AMT",
        columnName: "Amount",
        componentType: "currency",
        sequence: 2,
        alignment: "right",
        width: 150,
        maxWidth: 180,
        minWidth: 150,
        isDisplayTotal: true,
        footerLabel: "Debit:",
        setFooterValue(total, rows) {
          const sum = rows.reduce((acc, row) => {
            const typeCd = row?.values?.TYPE_CD?.trim().toUpperCase();
            const disbAmt = parseFloat(row?.values?.DISB_AMT) || 0;
            const gstAmt = parseFloat(row?.values?.GST) || 0;

            if (typeCd !== "3") {
              return acc + disbAmt + gstAmt;
            }
            return acc;
          }, 0);

          return sum.toFixed(2);
        },
      },
      {
        accessor: "GST",
        columnName: "GST",
        componentType: "currency",
        placeholder: " ",
        sequence: 2,
        alignment: "right",
        width: 110,
        maxWidth: 150,
        minWidth: 110,
      },
      {
        accessor: "REMARKS",
        columnName: "Remarks",
        componentType: "default",
        sequence: 2,
        alignment: "left",
        width: 160,
        maxWidth: 200,
        minWidth: 160,
        isDisplayTotal: true,
        footerLabel: "Credit:",
        setFooterValue(total, rows) {
          const sum = rows.reduce((acc, row) => {
            const typeCd = row?.values?.TYPE_CD?.trim();
            const disbAmt = parseFloat(row?.values?.DISB_AMT) || 0;
            const gstAmt = parseFloat(row?.values?.GST) || 0;

            if (typeCd === "3") {
              acc += disbAmt + gstAmt;
            }

            return acc;
          }, 0);

          return sum.toFixed(2);
        },
      },
      {
        accessor: "OPP_BRANCH_CD",
        columnName: "Opp. Branch Code",
        componentType: "default",
        sequence: 2,
        alignment: "left",
        width: 130,
        maxWidth: 200,
        minWidth: 130,
      },
      {
        accessor: "OPP_ACCT_TYPE",
        columnName: "Opp. Acct. Type",
        componentType: "default",
        sequence: 2,
        alignment: "left",
        width: 130,
        maxWidth: 180,
        minWidth: 130,
        isDisplayTotal: true,
        footerLabel: "Net Debit:",
        setFooterValue(total, rows) {
          const { credit, debit } = rows.reduce(
            (acc, row) => {
              const typeCd = row?.values?.TYPE_CD?.trim();
              const disbAmt = parseFloat(row?.values?.DISB_AMT) || 0;
              const gstAmt = parseFloat(row?.values?.GST) || 0;
              const total = disbAmt + gstAmt;

              if (typeCd === "3") acc.credit += total;
              else if (typeCd !== "3") acc.debit += total;

              return acc;
            },
            { credit: 0, debit: 0 }
          );

          return (debit - credit).toFixed(2);
        },
      },
      {
        accessor: "OPP_ACCT_CD",
        columnName: "Opp. Acct. Code",
        componentType: "default",
        placeholder: " ",
        sequence: 2,
        alignment: "left",
        width: 140,
        maxWidth: 180,
        minWidth: 140,
      },
      {
        accessor: "OPP_ACCT_NM",
        columnName: "Opp. Acct. Name",
        componentType: "default",
        placeholder: " ",
        sequence: 2,
        alignment: "left",
        width: 200,
        maxWidth: 200,
        minWidth: 200,
      },
      {
        accessor: "NEFT_THROUGH_BANK",
        columnName: "From Bank",
        componentType: "default",
        placeholder: " ",
        sequence: 2,
        alignment: "left",
        width: 200,
        maxWidth: 200,
        minWidth: 200,
      },
    ],
  },
};
