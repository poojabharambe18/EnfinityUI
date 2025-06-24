import { utilFunction } from "@acuteinfo/common-base";
import { format, isValid } from "date-fns";
import { t } from "i18next";
import { GeneralAPI } from "registry/fns/functions";
import { getPassBookTemplate, passbookAccountDetails } from "./api";

export const PassbookPrintingInq = {
  form: {
    name: "PassbookStatementInq",
    label: "PassbookPrintingParameters",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
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
          spacing: 2,
        },
      },
    },
    componentProps: {
      textField: {
        fullWidth: true,
      },
      select: {
        fullWidth: true,
      },
      datePicker: {
        fullWidth: true,
      },
      numberFormat: {
        fullWidth: true,
      },
      inputMask: {
        fullWidth: true,
      },
      datetimePicker: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "autocomplete",
      },
      name: "BRANCH_CD",
      label: "BranchCode",
      placeholder: "BranchCodePlaceHolder",
      options: GeneralAPI.getBranchCodeList,
      _optionsKey: "getBranchCodeList",
      runPostValidationHookAlways: true,
      dependentFields: ["REPRINT"],
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (
          Boolean(dependentFieldsValues?.REPRINT?.value) ||
          dependentFieldsValues?.REPRINT?.value !== ""
        ) {
          return true;
        } else {
          return false;
        }
      },

      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldValues
      ) => {
        if (formState?.isSubmitting) return {};
        return {
          ACCT_NM: { value: "" },
          ACCT_TYPE: { value: "", ignoreUpdate: false },
          ACCT_CD: { value: "", ignoreUpdate: false },
          TRAN_CD: { value: "", ignoreUpdate: false },
        };
      },
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["BranchCodeReqired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "ACCT_TYPE",
      label: "AccountType",
      placeholder: "AccountTypePlaceHolder",
      dependentFields: ["BRANCH_CD", "REPRINT"],
      isFieldFocused: true,
      options: (dependentValue, formState, _, authState) => {
        return GeneralAPI.get_Account_Type({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
          USER_NAME: authState?.user?.id,
          DOC_CD: formState?.docCD ?? "",
        });
      },
      _optionsKey: "get_Account_Type",
      required: true,
      runPostValidationHookAlways: true,
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (
          Boolean(dependentFieldsValues?.REPRINT?.value) ||
          dependentFieldsValues?.REPRINT?.value !== ""
        ) {
          return true;
        } else {
          return false;
        }
      },
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (
          currentField?.value &&
          dependentFieldValues?.BRANCH_CD?.value?.length === 0
        ) {
          let buttonName = await formState?.MessageBox({
            messageTitle: "Alert",
            message: "EnterAccountBranch",
            buttonNames: ["Ok"],
            icon: "WARNING",
          });

          if (buttonName === "Ok") {
            return {
              ACCT_TYPE: {
                value: "",
                isFieldFocused: false,
                ignoreUpdate: true,
              },
              BRANCH_CD: {
                value: "",
                isFieldFocused: true,
                ignoreUpdate: false,
              },
            };
          }
        }
        return {
          ACCT_CD: { value: "", ignoreUpdate: false },
          ACCT_NM: { value: "", ignoreUpdate: false },
          TRAN_CD: { value: "", ignoreUpdate: false },
        };
      },

      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["AccountTypeReqired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },

    {
      render: {
        componentType: "autocomplete",
      },
      name: "TRAN_CD",
      label: "Template",
      defaultValueKey: "defaultValue",
      dependentFields: ["PID_DESCRIPION", "ACCT_TYPE", "BRANCH_CD"],
      fullWidth: true,
      disableCaching: true,
      postValidationSetCrossFieldValues: (curr, formState) => {
        if (formState?.isSubmitting) return {};
        if (curr?.optionData?.length > 0) {
          return {
            HIDDEN_TRAN_CD: {
              value: curr?.optionData?.[0]?.value ?? "",
              isFieldFocused: false,
              ignoreUpdate: false,
            },
            HIDDEN_DEFAULT_LINE: {
              value: curr?.optionData?.[0]?.DEFAULT_LINE ?? "",
              isFieldFocused: false,
              ignoreUpdate: false,
            },
            HIDDEN_SKIP_LINE: {
              value: curr?.optionData?.[0]?.SKIP_LINE ?? "",
              isFieldFocused: false,
              ignoreUpdate: false,
            },
            LINE_PER_PAGE: {
              value: curr?.optionData?.[0]?.LINE_PER_PAGE ?? "",
              isFieldFocused: false,
              ignoreUpdate: false,
            },
          };
        }
        if (!Boolean(curr?.optionData)) {
          return {
            HIDDEN_TRAN_CD: {
              value: "",
              isFieldFocused: false,
              ignoreUpdate: false,
            },
            HIDDEN_DEFAULT_LINE: {
              value: "",
              isFieldFocused: false,
              ignoreUpdate: false,
            },
            HIDDEN_SKIP_LINE: {
              value: "",
              isFieldFocused: false,
              ignoreUpdate: false,
            },
            LINE_PER_PAGE: {
              value: "",
              isFieldFocused: false,
              ignoreUpdate: false,
            },
          };
        }
      },
      options: async (dependentValue, formState, abcd, authState) => {
        if (dependentValue?.ACCT_TYPE?.value !== "") {
          // handleButonDisable use for disable "Ok" button while getPassBookTemplate api call
          formState.handleButonDisable(true);
          try {
            const data = await getPassBookTemplate({
              COMP_CD: authState?.companyID,
              BRANCH_CD: dependentValue?.BRANCH_CD?.value,
              ACCT_TYPE: dependentValue?.ACCT_TYPE?.value,
              FLAG: "PAS" + dependentValue?.PID_DESCRIPION?.value,
            });
            return data;
          } catch (err) {
            console.log("err", err);
            return [];
          } finally {
            formState.handleButonDisable(false);
          }
        } else {
          return [];
        }
      },
      _optionsKey: "getPassBookTemplate",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["TemplateRequired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_CD",
      label: "AccountNumber",
      placeholder: "AccountNumberPlaceHolder",
      addHandleKeyDownFromExtendedType: true,
      autoComplete: "off",
      dependentFields: [
        "ACCT_TYPE",
        "BRANCH_CD",
        "TRAN_CD",
        "HIDDEN_TRAN_CD",
        "HIDDEN_DEFAULT_LINE",
        "HIDDEN_SKIP_LINE",
        "REPRINT",
      ],
      required: true,
      runPostValidationHookAlways: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["AccountNumberReqired"] },
          {
            name: "max",
            params: [20, "Account code should not exceed 20 digits"],
          },
        ],
      },
      inputProps: {
        maxLength: 20,
        onInput: (event) => {
          event.target.value = event.target.value.replace(/[^0-9\s]/g, "");
        },
      },
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (
          Boolean(dependentFieldsValues?.REPRINT?.value) ||
          dependentFieldsValues?.REPRINT?.value !== ""
        ) {
          return true;
        } else {
          return false;
        }
      },
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (
          !Boolean(currentField?.displayValue) &&
          !Boolean(currentField?.value)
        ) {
          return {
            ACCT_NM: { value: "", ignoreUpdate: false },
          };
        } else if (!Boolean(currentField?.displayValue)) {
          return {};
        }

        if (
          currentField?.value &&
          !Boolean(dependentFieldsValues?.BRANCH_CD?.value)
        ) {
          let buttonName = await formState?.MessageBox({
            messageTitle: "Alert",
            message: "EnterAccountBranch",
            buttonNames: ["Ok"],
            icon: "WARNING",
          });

          if (buttonName === "Ok") {
            return {
              BRANCH_CD: {
                value: "",
                isFieldFocused: true,
                ignoreUpdate: false,
              },
              ACCT_CD: {
                value: "",
                ignoreUpdate: false,
              },
              ACCT_TYPE: {
                value: "",
                ignoreUpdate: false,
              },
            };
          }
        } else if (
          currentField?.value &&
          !Boolean(dependentFieldsValues?.ACCT_TYPE?.value)
        ) {
          let buttonName = await formState?.MessageBox({
            messageTitle: "Alert",
            message: "EnterAccountType",
            buttonNames: ["Ok"],
            icon: "WARNING",
          });

          if (buttonName === "Ok") {
            return {
              ACCT_TYPE: {
                value: "",
                isFieldFocused: true,
                ignoreUpdate: false,
              },
              ACCT_CD: { value: "", ignoreUpdate: false },
            };
          }
        } else if (
          currentField?.value &&
          !Boolean(dependentFieldsValues?.TRAN_CD?.value)
        ) {
          let buttonName = await formState?.MessageBox({
            messageTitle: "Alert",
            message: "SelectTemplate",
            buttonNames: ["Ok"],
            icon: "WARNING",
          });

          if (buttonName === "Ok") {
            return {
              TRAN_CD: {
                value: "",
                isFieldFocused: true,
                ignoreUpdate: false,
              },
              ACCT_CD: {
                value: "",
                isFieldFocused: false,
                ignoreUpdate: false,
              },
            };
          }
        } else if (
          currentField?.value &&
          dependentFieldsValues?.BRANCH_CD?.value &&
          dependentFieldsValues?.ACCT_TYPE?.value &&
          dependentFieldsValues?.TRAN_CD?.value &&
          (dependentFieldsValues?.HIDDEN_TRAN_CD?.value ||
            dependentFieldsValues?.HIDDEN_DEFAULT_LINE?.value ||
            dependentFieldsValues?.HIDDEN_SKIP_LINE?.value)
        ) {
          const reqParameters = {
            COMP_CD: authState?.companyID ?? "",
            BRANCH_CD: dependentFieldsValues?.BRANCH_CD?.value ?? "",
            ACCT_TYPE: dependentFieldsValues?.ACCT_TYPE?.value ?? "",
            ACCT_CD:
              utilFunction.getPadAccountNumber(
                currentField?.value,
                dependentFieldsValues?.ACCT_TYPE?.optionData?.[0] ?? ""
              ) ?? "",
            TRAN_CD: dependentFieldsValues?.HIDDEN_TRAN_CD?.value ?? "",
            DEFAULT_LINE:
              dependentFieldsValues?.HIDDEN_DEFAULT_LINE?.value ?? "",
            SKIP_LINE: dependentFieldsValues?.HIDDEN_SKIP_LINE?.value ?? "",
            SCREEN_REF: formState?.docCD ?? "",
            WORKING_DATE: authState?.workingDate ?? "",
            USERNAME: authState?.user?.id ?? "",
            USERROLE: authState?.role ?? "",
          };
          formState.handleButonDisable(true);

          const postData = await passbookAccountDetails(reqParameters);

          formState.handleButonDisable(false);

          if (postData?.status === "999") {
            let btnName = await formState.MessageBox({
              messageTitle: "ValidationFailed",
              message: postData?.messageDetails ?? "Somethingwenttowrong",
              icon: "ERROR",
            });
            if (btnName === "Ok") {
              return {
                ACCT_CD: {
                  value: "",
                  isFieldFocused: true,
                  ignoreUpdate: false,
                },
                ACCT_NM: { value: "", ignoreUpdate: false },
              };
            }
          } else {
            let btn99, returnVal;

            const getButtonName = async (obj) => {
              let btnName = await formState.MessageBox(obj);
              return { btnName, obj };
            };
            for (let i = 0; i < postData.length; i++) {
              if (postData[i]?.O_STATUS === "999") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: postData[i]?.O_MSG_TITLE ?? "ValidationFailed",
                  message: postData[i]?.O_MESSAGE,
                  icon: "ERROR",
                });
                returnVal = "";
              } else if (postData[i]?.O_STATUS === "99") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: postData[i]?.O_MSG_TITLE ?? "Confirmation",
                  message: postData[i]?.O_MESSAGE,
                  icon: "CONFIRM",
                  buttonNames: ["Yes", "No"],
                });
                btn99 = btnName;
                if (btnName === "No") {
                  returnVal = "";
                }
              } else if (postData[i]?.O_STATUS === "9") {
                if (btn99 !== "No") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: postData[i]?.O_MSG_TITLE ?? "Alert",
                    message: postData[i]?.O_MESSAGE,
                    icon: "WARNING",
                  });
                }
              } else if (postData[i]?.O_STATUS === "0") {
                if (btn99 !== "No") {
                  returnVal = postData[i];
                } else {
                  returnVal = "";
                }
              }
            }
            btn99 = 0;
            formState.setDataOnFieldChange("accountFromDate", {
              PASS_BOOK_DT: returnVal?.FROM_DT ?? "",
            });
            return {
              ACCT_CD:
                returnVal !== ""
                  ? {
                      value: utilFunction.getPadAccountNumber(
                        currentField?.value,
                        dependentFieldsValues?.ACCT_TYPE?.optionData?.[0] ?? ""
                      ),
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    }
                  : {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: false,
                    },
              ACCT_NM: {
                value: returnVal?.ACCT_NM ?? "",
                ignoreUpdate: false,
              },
              PASS_BOOK_LINE: {
                value: returnVal?.LINE_ID ?? "",
                ignoreUpdate: false,
              },
              LINE_ID: {
                value: returnVal?.LINE_ID ?? "",
                ignoreUpdate: false,
              },
              PASS_BOOK_DT: {
                value: returnVal?.FROM_DT ?? "",
                ignoreUpdate: false,
              },

              OP_DATE_HIDDEN: {
                value: returnVal?.OP_DATE ?? "",
                ignoreUpdate: false,
              },
            };
          }
        } else if (!currentField?.value) {
          return {
            ACCT_NM: {
              value: "",
              ignoreUpdate: false,
            },
            PASS_BOOK_LINE: {
              value: "",
              ignoreUpdate: false,
            },
            LINE_ID: {
              value: "",
              ignoreUpdate: false,
            },
            PASS_BOOK_DT: {
              value: "",
              ignoreUpdate: false,
            },
          };
        }
        return {};
      },
      fullWidth: true,
      GridProps: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6,
        xl: 6,
      },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "ENT_BRANCH_CD",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "HIDDEN_TRAN_CD",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "HIDDEN_DEFAULT_LINE",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "HIDDEN_SKIP_LINE",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "LINE_ID",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "LINE_PER_PAGE",
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "AccountHolder",
      placeholder: "AccountHolder",
      isReadOnly: true,
      fullWidth: true,
      GridProps: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6,
        xl: 6,
      },
    },

    {
      render: {
        componentType: "radio",
      },
      name: "PID_DESCRIPION",
      label: "",
      RadioGroupProps: { row: true },
      defaultValue: "D",
      validationRun: "onChange",
      dependentFields: ["TRAN_CD"],
      options: [
        {
          label: "FrontPage",
          value: "F",
        },
        { label: "FirstPage", value: "A" },
        { label: "Detail", value: "D" },
      ],

      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldValues
      ) => {
        if (formState?.isSubmitting) return {};

        if (currentField?.value) {
          return {
            TRAN_CD: {
              isFieldFocused: true,
              ignoreUpdate: false,
            },
          };
        }
      },

      GridProps: {
        xs: 12,
        md: 7,
        sm: 7,
        lg: 7,
        xl: 7,
      },
    },

    {
      render: {
        componentType: "numberFormat",
      },
      name: "PASS_BOOK_LINE",
      label: "LineNo",
      fullWidth: true,
      GridProps: {
        xs: 6,
        sm: 2.5,
        md: 2.5,
        lg: 2.5,
        xl: 2.5,
      },
      dependentFields: ["PID_DESCRIPION", "TRAN_CD", "REPRINT"],
      runValidationOnDependentFieldsChange: true,
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (
          !Boolean(dependentFieldsValues?.REPRINT?.value) ||
          dependentFieldsValues?.REPRINT?.value === ""
        ) {
          return true;
        } else {
          return false;
        }
      },

      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.PID_DESCRIPION?.value !== "D") {
          return true;
        } else {
          return false;
        }
      },
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        isAllowed: (values) => {
          if (values?.value?.length > 2) {
            return false;
          }
          return true;
        },
      },

      validate: (columnValue, dependentFields) => {
        if (
          dependentFields?.TRAN_CD?.optionData?.[0]?.DEFAULT_LINE &&
          Boolean(columnValue?.value)
        ) {
          if (
            Number(columnValue?.value) >=
              Number(dependentFields?.TRAN_CD?.optionData?.[0]?.DEFAULT_LINE) &&
            Number(columnValue?.value) <=
              Number(dependentFields?.TRAN_CD?.optionData?.[0]?.LINE_PER_PAGE)
          ) {
            return "";
          } else {
            return `${t(`LineNoValidation`, {
              from: dependentFields?.TRAN_CD?.optionData?.[0]?.DEFAULT_LINE,
              to: dependentFields?.TRAN_CD?.optionData?.[0]?.LINE_PER_PAGE,
            })}`;
          }
        }
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "LINE_NO_SPACER",
      GridProps: {
        xs: 6,
        sm: 2.5,
        md: 2.5,
        lg: 2.5,
        xl: 2.5,
      },
      dependentFields: ["PID_DESCRIPION"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.PID_DESCRIPION?.value !== "D") {
          return false;
        } else {
          return true;
        }
      },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "REPRINT_VALUE",
      dependentFields: ["REPRINT"],
      setValueOnDependentFieldsChange: (dependentFieldsValues) => {
        let value = Number(dependentFieldsValues?.REPRINT?.value);
        return value === 1 ? "Y" : "N";
      },
    },

    {
      render: {
        componentType: "formbutton",
      },
      name: "REPRINT",
      label: "Reprint",
      endsIcon: "Print",
      rotateIcon: "scale(1.4)",
      fullWidth: true,
      validationRun: "all",
      GridProps: {
        xs: 6,
        sm: 2.5,
        md: 2.5,
        lg: 2.5,
        xl: 2.5,
      },

      dependentFields: ["PID_DESCRIPION", "BRANCH_CD", "ACCT_TYPE", "ACCT_CD"],
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (
          currentField?.value &&
          !Boolean(dependentFieldsValues?.BRANCH_CD?.value)
        ) {
          let buttonName = await formState?.MessageBox({
            messageTitle: "Alert",
            message: "EnterAccountBranch",
            buttonNames: ["Ok"],
            icon: "WARNING",
          });
          if (buttonName === "Ok") {
            return {
              BRANCH_CD: {
                value: "",
                isFieldFocused: true,
                ignoreUpdate: false,
              },
              REPRINT: {
                value: "",
                isFieldFocused: false,
                ignoreUpdate: false,
              },
            };
          }
        } else if (
          currentField?.value &&
          !Boolean(dependentFieldsValues?.ACCT_TYPE?.value)
        ) {
          let buttonName = await formState?.MessageBox({
            messageTitle: "Alert",
            message: "EnterAccountType",
            buttonNames: ["Ok"],
            icon: "WARNING",
          });
          if (buttonName === "Ok") {
            return {
              ACCT_TYPE: {
                value: "",
                isFieldFocused: true,
                ignoreUpdate: false,
              },
              REPRINT: {
                value: "",
                isFieldFocused: false,
                ignoreUpdate: false,
              },
            };
          }
        } else if (
          currentField?.value &&
          !Boolean(dependentFieldsValues?.ACCT_CD?.value)
        ) {
          let buttonName = await formState?.MessageBox({
            messageTitle: "Alert",
            message: "AccountNumberPlaceHolder",
            buttonNames: ["Ok"],
            icon: "WARNING",
          });
          if (buttonName === "Ok") {
            return {
              ACCT_CD: {
                value: "",
                isFieldFocused: true,
                ignoreUpdate: false,
              },
              REPRINT: {
                value: "",
                isFieldFocused: false,
                ignoreUpdate: false,
              },
            };
          }
        } else if (
          currentField?.value &&
          Boolean(dependentFieldsValues?.BRANCH_CD?.value) &&
          Boolean(dependentFieldsValues?.ACCT_TYPE?.value) &&
          Boolean(dependentFieldsValues?.ACCT_CD?.value)
        ) {
          return {
            PASS_BOOK_LINE: {
              isFieldFocused: true,
              ignoreUpdate: false,
            },
          };
        }
        if (
          dependentFieldsValues?.PID_DESCRIPION?.value === "D" &&
          currentField?.value === "0"
        ) {
          return {
            REPRINT: {
              value: "",
            },
          };
        }
      },

      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.PID_DESCRIPION?.value !== "D" ||
          fieldData?.value !== ""
        ) {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "REPRINT_SPACER",
      GridProps: {
        xs: 6,
        sm: 2.5,
        md: 2.5,
        lg: 2.5,
        xl: 2.5,
      },
      dependentFields: ["PID_DESCRIPION"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.PID_DESCRIPION?.value !== "D" ||
          fieldData?.value !== ""
        ) {
          return false;
        } else {
          return true;
        }
      },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "OP_DATE_HIDDEN",
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "PASS_BOOK_DT",
      label: "FromDate",
      placeholder: "DD/MM/YYYY",
      maxDate: new Date(),
      dependentFields: ["REPRINT", "PID_DESCRIPION", "OP_DATE_HIDDEN"],
      runValidationOnDependentFieldsChange: true,
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (
          !Boolean(dependentFieldsValues?.REPRINT?.value) ||
          dependentFieldsValues?.REPRINT?.value === ""
        ) {
          return true;
        } else if (dependentFieldsValues?.PID_DESCRIPION?.value !== "D") {
          return true;
        } else {
          return false;
        }
      },

      onFocus: (date) => {
        date.target.select();
      },
      validate: (columnValue, dependentFields) => {
        if (Boolean(columnValue?.value) && !isValid(columnValue?.value)) {
          return "Mustbeavaliddate";
        } else if (
          new Date(columnValue?.value) <
          new Date(dependentFields?.OP_DATE_HIDDEN?.value)
        ) {
          return `${t(`DateValidation`, {
            date: format(
              new Date(dependentFields?.OP_DATE_HIDDEN?.value),
              "dd-MM-yyyy"
            ),
          })}`;
        } else {
          return "";
        }
      },

      GridProps: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6,
        xl: 6,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "PASS_BOOK_TO_DT",
      label: "ToDate",
      placeholder: "DD/MM/YYYY",
      defaultValue: new Date(),
      format: "dd/MM/yyyy",
      isReadOnly: true,
      onFocus: (date) => {
        date.target.select();
      },

      GridProps: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6,
        xl: 6,
      },
    },
  ],
};
