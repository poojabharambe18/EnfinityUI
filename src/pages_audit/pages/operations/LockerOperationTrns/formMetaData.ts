import { utilFunction } from "@acuteinfo/common-base";
import { GeneralAPI } from "registry/fns/functions";
import {
  getLockerOperationDDWdata,
  getLockerSizeDDWdata,
  getLockerTrxDDWdata,
  validateLockerNo,
  validateLockerOperation,
} from "./api";
import { getRelationshipManagerOptions } from "../c-kyc/api";
import { t } from "i18next";
export const handleDisplayMessages = async (data, formState) => {
  for (const obj of data?.MSG ?? []) {
    if (obj?.O_STATUS === "999") {
      await formState.MessageBox({
        messageTitle: obj?.O_MSG_TITLE?.length
          ? obj?.O_MSG_TITLE
          : "ValidationFailed",
        message: obj?.O_MESSAGE ?? "",
        icon: "ERROR",
      });
      break;
    } else if (obj?.O_STATUS === "9") {
      await formState.MessageBox({
        messageTitle: obj?.O_MSG_TITLE?.length ? obj?.O_MSG_TITLE : "Alert",
        message: obj?.O_MESSAGE ?? "",
        icon: "WARNING",
      });
      continue;
    } else if (obj?.O_STATUS === "99") {
      const buttonName = await formState.MessageBox({
        messageTitle: obj?.O_MSG_TITLE?.length
          ? obj?.O_MSG_TITLE
          : "Confirmation",
        message: obj?.O_MESSAGE ?? "",
        buttonNames: ["Yes", "No"],
        defFocusBtnName: "Yes",
        icon: "CONFIRM",
      });
      // if (buttonName === "No") {
      //   break;
      // }
    } else if (obj?.O_STATUS === "0") {
      return "success";
    }
  }
};
export const lockerTrnsViewFormMetadata = {
  form: {
    name: "LOCKER DATA VIEW FORM",
    label: "",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 12,
          md: 12,
        },
        container: {
          direction: "row",
          spacing: 1,
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
        componentType: "textField",
      },
      name: "ACCT_TYPE",
      label: "Type",
      placeholder: "Type",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 6, md: 4, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "LOCKER_NO",
      label: "lockerNumber",
      placeholder: "lockerNumber",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "ACCT_CD",
      label: "ACNo",
      placeholder: "ACNo",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "OP_DATE",
      label: "OpenDate",
      isReadOnly: true,
      GridProps: { xs: 2, sm: 2, md: 4, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SIZE_NM",
      label: "lockerSize",
      placeholder: "lockerSize",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 3, xl: 3 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "LOC_KEY_NO",
      label: "keyNumber",
      placeholder: "keyNumber",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "INST_DUE_DT",
      label: "DueDate",
      isReadOnly: true,
      GridProps: { xs: 2, sm: 2, md: 4, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "REF_AC",
      label: "ReferenceAccount",
      placeholder: "ReferenceAccount",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "REF_AC_BAL",
      label: "referenceAccountBalance",
      placeholder: "referenceAccountBalance",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "AccountName",
      placeholder: "AccountName",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "INST_RS",
      label: "totalRentPaid",
      placeholder: "totalRentPaid",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD1",
      label: "Add1",
      placeholder: "Add1",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "LAST_BAL",
      label: "OpeningBalance",
      placeholder: "OpeningBalance",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD2",
      label: "Add2",
      placeholder: "Add2",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "CONF_BAL",
      label: "ClosingBalance",
      placeholder: "ClosingBalance",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CITY_CD",
      label: "City",
      placeholder: "City",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "STATE_CD",
      label: "State",
      placeholder: "State",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "RENT_AMT",
      label: "dueRent",
      placeholder: "dueRent",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CUSTOMER_ID",
      label: "CustomerId",
      placeholder: "CustomerId",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CONTACT",
      label: "Contact",
      placeholder: "Contact",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PAN_NO",
      label: "PAN",
      placeholder: "PAN",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CATEG_NM",
      label: "Category",
      placeholder: "Category",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "INT_SKIP_FLAG",
      label: "keyEmboss",
      placeholder: "keyEmboss",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_MODE",
      label: "Mode",
      placeholder: "Mode",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "UNIQUE_ID",
      label: "UniqueId",
      placeholder: "UniqueId",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
    },
  ],
};
export const lockerTrnsEntryFormMetadata = {
  form: {
    name: "lOCKER ENTRY",
    label: "",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 12,
          md: 12,
        },
        container: {
          direction: "row",
          spacing: 1,
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
      name: "ACCT_TYPE_",
      label: "AccountType",
      placeholder: "AccountTypePlaceHolder",
      options: (dependentValue, formState, _, authState) => {
        return GeneralAPI.get_Account_Type({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
          USER_NAME: authState?.user?.id,
          DOC_CD: formState?.docCD,
        });
      },
      _optionsKey: "get_Account_Type",
      required: "true",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["AccountTypeReqired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "MAIN_ACCT_TYPE",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "MAIN_ACCT_CD",
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "LOCKER_NO_",
      label: "lockerNumber",
      placeholder: "lockerNumber",
      dependentFields: ["ACCT_TYPE_"],
      AlwaysRunPostValidationSetCrossFieldValues: {
        alwaysRun: true,
        touchAndValidate: true,
      },
      runPostValidationHookAlways: true,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 9) {
            return false;
          }

          return true;
        },
      },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFieldsValues
      ) => {
        if (field.value && dependentFieldsValues?.ACCT_TYPE_?.value.length) {
          if (formState?.isSubmitting) return {};
          let postData = await validateLockerNo({
            ACCT_TYPE: dependentFieldsValues?.ACCT_TYPE_?.value,
            COMP_CD: auth?.companyID ?? "",
            BRANCH_CD: auth?.user?.branchCode ?? "",
            LOCKER_NO: field.value,
            DOC_CD: formState?.docCD,
          });
          if (postData?.status === "999") {
            let btnName = await formState?.MessageBox({
              messageTitle: "ValidationFailed",
              message: postData?.messageDetails?.length
                ? postData?.messageDetails
                : "Somethingwenttowrong",
              icon: "ERROR",
            });
            if (btnName === "Ok") {
              formState?.handleDisableButton(false);
              return {
                ACCT_CD: {
                  value: "",
                  ignoreUpdate: false,
                  isFieldFocused: true,
                },
                ACCT_NM: { value: "" },
              };
            }
          }

          for (const obj of postData ?? []) {
            if (obj?.O_STATUS === "999") {
              await formState.MessageBox({
                messageTitle: obj?.O_MSG_TITLE?.length
                  ? obj?.O_MSG_TITLE
                  : "ValidationFailed",
                message: obj?.O_MESSAGE ?? "",
                icon: "ERROR",
              });
              return {
                LOC_SIZE_CD: {
                  value: "",
                  isFieldFocused: false,
                  ignoreUpdate: false,
                },
                LOCKER_NO_: {
                  value: "",
                },
              };
              break;
            } else if (obj?.O_STATUS === "9") {
              await formState.MessageBox({
                messageTitle: obj?.O_MSG_TITLE?.length
                  ? obj?.O_MSG_TITLE
                  : "Alert",
                message: obj?.O_MESSAGE ?? "",
                icon: "WARNING",
              });
              continue;
            } else if (obj?.O_STATUS === "99") {
              const buttonName = await formState.MessageBox({
                messageTitle: obj?.O_MSG_TITLE?.length
                  ? obj?.O_MSG_TITLE
                  : "Confirmation",
                message: obj?.O_MESSAGE ?? "",
                buttonNames: ["Yes", "No"],
                defFocusBtnName: "Yes",
                icon: "CONFIRM",
              });
              if (buttonName === "No") {
                break;
              }
            } else if (obj?.O_STATUS === "0") {
              return {
                REMARKS: {
                  value: postData[0]?.ACCT_NM ?? "",
                  isFieldFocused: false,
                  ignoreUpdate: false,
                },
                LOC_SIZE_CD: {
                  // value: postData[0]?.LOC_SIZE_CD ?? "",
                  value: "",
                  isFieldFocused: true,
                  ignoreUpdate: false,
                },
                OPER_STATUS: {
                  value: "",
                  isFieldFocused: false,
                  ignoreUpdate: false,
                },
              };
            }
          }
        }
        return {
          LOC_SIZE_CD: {
            value: "",
            isFieldFocused: false,
            ignoreUpdate: false,
          },
        };
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "SIGN",
      label: "Signature",
      dependentFields: ["MAIN_ACCT_CD"],
      GridProps: {
        xs: 1,
        sm: 1,
        md: 1,
        lg: 1,
        xl: 1,
      },
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.MAIN_ACCT_CD?.value !== "") {
          return false;
        } else {
          return true;
        }
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "LOC_SIZE_CD",
      label: "lockerSize",
      placeholder: "AccountTypePlaceHolder",
      disableCaching: true,
      required: true,
      runPostValidationHookAlways: true,
      AlwaysRunPostValidationSetCrossFieldValues: {
        alwaysRun: true,
        touchAndValidate: true,
      },
      validationRun: "onBlur",
      dependentFields: ["LOCKER_NO_", "ACCT_TYPE_", "REMARKS"],
      options: async (dependentFields, formState, _, authState) => {
        const optionData = await getLockerSizeDDWdata({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode ?? "",
          LOCKER_NO: dependentFields?.LOCKER_NO_?.value ?? "",
          ACCT_TYPE: dependentFields?.ACCT_TYPE_?.value ?? "",
          ALLOTED: "Y",
        });
        formState.setDataOnFieldChange("DROPDOWN_DATA", optionData);
        return optionData;
      },

      _optionsKey: "getLockerSizeDDWdata",
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldValues
      ) => {
        // const optionData = formState?.getOptionData();
        // const defaultObj = optionData.find(
        //   (el) => el.value === currentField?.value
        // );
        // console.log(defaultObj, "defaultObj");

        if (!currentField?.value) {
          formState.setDataOnFieldChange("VIEWMST_PAYLOAD", {});
          return {
            MAIN_ACCT_CD: {
              value: "",
            },
            MAIN_ACCT_TYPE: {
              value: "",
            },
          };
        }

        if (currentField?.value) {
          const postData = await GeneralAPI.getAccNoValidation({
            BRANCH_CD: authState?.user?.branchCode,
            COMP_CD: authState?.companyID,
            ACCT_TYPE: currentField?.optionData[0]?.ACCT_TYPE,
            ACCT_CD: currentField?.optionData[0]?.LST_ACCT_CD,
            SCREEN_REF: formState?.docCD,
          });
          if (postData?.status === "999") {
            let btnName = await formState?.MessageBox({
              messageTitle: "ValidationFailed",
              message: postData?.messageDetails?.length
                ? postData?.messageDetails
                : "Somethingwenttowrong",
              icon: "ERROR",
            });
            if (btnName === "Ok") {
              formState?.handleDisableButton(false);
              return {
                ACCT_CD: {
                  value: "",
                  ignoreUpdate: false,
                  isFieldFocused: true,
                },
                ACCT_NM: { value: "" },
              };
            }
          }
          let returnVal;
          for (const obj of postData?.MSG ?? []) {
            if (obj?.O_STATUS === "999") {
              await formState.MessageBox({
                messageTitle: obj?.O_MSG_TITLE?.length
                  ? obj?.O_MSG_TITLE
                  : "ValidationFailed",
                message: obj?.O_MESSAGE ?? "",
                icon: "ERROR",
              });
              await formState.MessageBox({
                messageTitle: "ValidationFailed",
                message: "No Transaction Allowed.",
                icon: "ERROR",
              });
              formState.setDataOnFieldChange("VIEWMST_PAYLOAD", {});

              return {
                LOC_SIZE_CD: {
                  value: "",
                  isFieldFocused: false,
                },
                LOCKER_NO_: {
                  value: "",
                  isFieldFocused: true,
                },
                REMARKS: {
                  value: "",
                },
                MAIN_ACCT_CD: {
                  value: "",
                },
                MAIN_ACCT_TYPE: {
                  value: "",
                },
              };
              break;
            } else if (obj?.O_STATUS === "9") {
              await formState.MessageBox({
                messageTitle: obj?.O_MSG_TITLE?.length
                  ? obj?.O_MSG_TITLE
                  : "Alert",
                message: obj?.O_MESSAGE ?? "",
                icon: "WARNING",
              });
            } else if (obj?.O_STATUS === "99") {
              if (obj?.O_COLUMN_NM === "FREEZE_AC") {
                const buttonName = await formState.MessageBox({
                  messageTitle: obj?.O_MSG_TITLE?.length
                    ? obj?.O_MSG_TITLE
                    : "Confirmation",
                  message: obj?.O_MESSAGE ?? "",
                  buttonNames: ["Yes", "No"],
                  defFocusBtnName: "No",
                  loadingBtnName: ["Yes"],
                  icon: "CONFIRM",
                });

                if (buttonName === "Yes") {
                  try {
                    const freezeResponse = await GeneralAPI.doAccountFreeze({
                      ENT_COMP_CD: authState?.companyID ?? "",
                      ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
                      BRANCH_CD: authState?.user?.branchCode ?? "",
                      COMP_CD: authState?.companyID ?? "",
                      ACCT_TYPE: currentField?.optionData[0]?.ACCT_TYPE ?? "",
                      ACCT_CD: currentField?.optionData[0]?.LST_ACCT_CD ?? "",
                    });
                    if (freezeResponse) {
                      formState?.CloseMessageBox();
                    }

                    if (freezeResponse?.error) {
                      await formState.MessageBox({
                        messageTitle: "Error",
                        message:
                          freezeResponse?.errorMessage ?? "Unknownerroroccured",
                        icon: "ERROR",
                        buttonNames: ["OK"],
                      });
                    }
                  } catch (error: any) {
                    await formState.MessageBox({
                      messageTitle: "Error",
                      message: error?.error_msg ?? "Unknownerroroccured",
                      icon: "ERROR",
                      buttonNames: ["OK"],
                    });
                  }
                }
              } else {
                const buttonName = await formState.MessageBox({
                  messageTitle: obj?.O_MSG_TITLE?.length
                    ? obj?.O_MSG_TITLE
                    : "Confirmation",
                  message: obj?.O_MESSAGE ?? "",
                  buttonNames: ["Yes", "No"],
                  defFocusBtnName: "Yes",
                  icon: "CONFIRM",
                });
                if (buttonName === "No") {
                  returnVal = "";
                  break;
                }
              }
            } else if (obj?.O_STATUS === "0") {
              returnVal = postData[0];
            }
          }

          if (
            currentField?.optionData[0]?.LST_ACCT_CD &&
            currentField?.optionData[0]?.ACCT_TYPE
          ) {
            const payload = {
              ACCT_TYPE: currentField?.optionData[0]?.ACCT_TYPE,
              ACCT_CD: currentField?.optionData[0]?.LST_ACCT_CD,
              LOCKER_NO: currentField?.optionData[0]?.LOCKER_NO,
              ACCT_NM: postData?.ACCT_NM,
            };

            formState.setDataOnFieldChange("VIEWMST_PAYLOAD", payload);

            return {
              MAIN_ACCT_CD: {
                value: currentField?.optionData[0]?.LST_ACCT_CD ?? "",
              },
              MAIN_ACCT_TYPE: {
                value: currentField?.optionData[0]?.ACCT_TYPE ?? "",
              },
            };
          }
        }

        return {
          MAIN_ACCT_CD: {
            value: "",
          },
          MAIN_ACCT_TYPE: {
            value: "",
          },
        };
      },

      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["selectLockerSize"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "OPER_STATUS",
      label: "Operation",
      validationRun: "onChange",
      placeholder: "Operation",
      options: () => getLockerOperationDDWdata(),
      _optionsKey: "getLockerOperationDDWdata",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["selectOperation"] }],
      },
      dependentFields: ["LOC_SIZE_CD", "ACCT_TYPE_", "OPER_STATUS"],
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (
          currentField?.value &&
          dependentFieldsValues?.LOC_SIZE_CD?.optionData[0]?.ACCT_TYPE &&
          dependentFieldsValues?.LOC_SIZE_CD?.optionData[0]?.LST_ACCT_CD
        ) {
          let response = await validateLockerOperation({
            BRANCH_CD: authState?.user?.branchCode ?? "",
            COMP_CD: authState?.companyID ?? "",
            ACCT_TYPE:
              dependentFieldsValues?.LOC_SIZE_CD?.optionData[0]?.ACCT_TYPE ??
              "",
            ACCT_CD:
              dependentFieldsValues?.LOC_SIZE_CD?.optionData[0]?.LST_ACCT_CD ??
              "",
            OPER_STATUS: currentField?.value ?? "",
            WORKING_DT: authState?.workingDate ?? "",
          });
          let postData = response[0];

          const returnValue = await handleDisplayMessages(postData, formState);
          if (postData?.status === "999") {
            let btnName = await formState?.MessageBox({
              messageTitle: "ValidationFailed",
              message: postData?.messageDetails?.length
                ? postData?.messageDetails
                : "Somethingwenttowrong",
              icon: "ERROR",
            });
            if (btnName === "Ok") {
              formState?.handleDisableButton(false);
              return {
                ACCT_CD: {
                  value: "",
                  ignoreUpdate: false,
                  isFieldFocused: true,
                },
                ACCT_NM: { value: "" },
              };
            }
          }
          if (returnValue === "success")
            return {
              ST_TIME: {
                value: postData?.ST_TIME ?? "",
              },
              CL_TIME: {
                value: postData?.CL_TIME ?? "",
              },
              GST_ROUND: {
                value: postData?.GST_ROUND ?? "",
              },
              TAX_RATE: {
                value: postData?.TAX_RATE ?? "",
              },
              OPER_STATUS: {
                value: postData?.OPER_STATUS ?? "",
                ignoreUpdate: true,
              },
              CHRG_AMT: {
                value: postData?.CHRG_AMT ?? "",
                isReadOnly: (fieldValue, dependentFields, formState) => {
                  if (postData?.ENABLE_DISABLE === "Y") {
                    return true;
                  } else return false;
                },
              },
              SERVICE_CHRGE_AUTO: {
                value: postData?.SERVICE_TAX ?? "",
                isReadOnly: (fieldValue, dependentFields, formState) => {
                  if (postData?.ENABLE_DISABLE === "Y") {
                    return true;
                  } else return false;
                },
              },
            };
        } else {
          return {
            ST_TIME: {
              value: "",
            },
            CL_TIME: {
              value: "",
            },
            GST_ROUND: {
              value: "",
            },
            TAX_RATE: {
              value: "",
            },
            OPER_STATUS: {
              value: "",
              ignoreUpdate: false,
            },
            CHRG_AMT: {
              value: "",
            },
            SERVICE_CHRGE_AUTO: {
              value: "",
            },
          };
        }
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      label: "Remarks",
      placeholder: "Remarks",
      type: "text",
      dependentFields: ["OPER_STATUS"],
      GridProps: { xs: 6, sm: 6, md: 4, lg: 3, xl: 3 },
    },
    {
      render: {
        componentType: "datetimePicker",
      },
      name: "ST_TIME",
      label: "timeIn",
      placeholder: "timeIn",
      format: "HH:mm:ss",
      type: "text",
      isReadOnly: true,
      dependentFields: ["OPER_STATUS"],
      GridProps: { xs: 6, sm: 6, md: 4, lg: 1.4, xl: 1.4 },
    },
    {
      render: {
        componentType: "datetimePicker",
      },
      name: "CL_TIME",
      label: "timeOut",
      placeholder: "timeOut",
      format: "HH:mm:ss",
      dependentFields: ["OPER_STATUS"],
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 1.4, xl: 1.4 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "TRX_CD",
      label: "Type",
      placeholder: "Type",
      dependentFields: ["OPER_STATUS"],
      options: () => getLockerTrxDDWdata(),
      _optionsKey: "getLockerTrxDDWdata",
      required: "true",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["AccountTypeReqired"] }],
      },
      shouldExclude: (val1, dependentFields) => {
        if (dependentFields?.OPER_STATUS?.value === "B") {
          return false;
        }
        return true;
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 1.2, xl: 1.2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "TAX_RATE",
      label: "TAX_RATE",
      dependentFields: ["OPER_STATUS"],
      GridProps: { xs: 12, sm: 4, md: 4, lg: 1.2, xl: 1.2 },
      shouldExclude: (val1, dependentFields) => {
        if (dependentFields?.OPER_STATUS?.value === "B") {
          return false;
        }
        return true;
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "GST_ROUND",
      label: "GST_ROUND",
      dependentFields: ["OPER_STATUS"],
      GridProps: { xs: 12, sm: 4, md: 4, lg: 1.2, xl: 1.2 },
      shouldExclude: (val1, dependentFields) => {
        if (dependentFields?.OPER_STATUS?.value === "B") {
          return false;
        }
        return true;
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "CHRG_AMT",
      label: "Charge",
      validationRun: "onBlur",
      maxLength: 13,
      placeholder: "",
      type: "text",
      fullWidth: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 1.5, xl: 1.5 },
      dependentFields: ["TAX_RATE", "GST_ROUND", "OPER_STATUS"],
      AlwaysRunPostValidationSetCrossFieldValues: {
        alwaysRun: true,
        touchAndValidate: false,
      },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFields
      ) => {
        return {
          SERVICE_CHRGE_AUTO: {
            value:
              dependentFields?.GST_ROUND?.value === "3"
                ? Math.floor(
                    (parseInt(field?.value) *
                      parseInt(dependentFields?.TAX_RATE?.value)) /
                      100
                  ) ?? ""
                : dependentFields?.GST_ROUND?.value === "2"
                ? Math.ceil(
                    (parseInt(field?.value) *
                      parseInt(dependentFields?.TAX_RATE?.value)) /
                      100
                  ) ?? ""
                : dependentFields?.GST_ROUND?.value === "1"
                ? Math.round(
                    (parseInt(field?.value) *
                      parseInt(dependentFields?.TAX_RATE?.value)) /
                      100
                  ) ?? ""
                : (parseInt(field?.value) *
                    parseInt(dependentFields?.TAX_RATE?.value)) /
                  100,
          },
        };
      },
      shouldExclude: (val1, dependentFields) => {
        if (dependentFields?.OPER_STATUS?.value === "B") {
          return false;
        }
        return true;
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "SERVICE_CHRGE_AUTO",
      label: "GST",
      placeholder: "",
      maxLength: 13,
      type: "text",
      fullWidth: true,
      GridProps: { xs: 6, sm: 6, md: 4, lg: 1.5, xl: 1.5 },
      dependentFields: ["OPER_STATUS"],

      shouldExclude: (val1, dependentFields) => {
        if (dependentFields?.OPER_STATUS?.value === "B") {
          return false;
        }
        return true;
      },
    },
    {
      render: { componentType: "_accountNumber" },
      branchCodeMetadata: {
        name: "TRF_BRANCH_CD",
        label: "transferBranchCd",
        dependentFields: ["TRX_CD", "OPER_STATUS"],
        shouldExclude: (val1, dependentFields) => {
          if (
            dependentFields?.TRX_CD?.value === "3" &&
            dependentFields?.OPER_STATUS?.value === "B"
          ) {
            return false;
          }
          return true;
        },
        GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
      },
      accountTypeMetadata: {
        options: (dependentValue, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID,
            BRANCH_CD: dependentValue?.["TRF_BRANCH_CD"]?.value,
            USER_NAME: authState?.user?.id,
            DOC_CD: "LOC_DR",
          });
        },
        name: "TRF_ACCT_TYPE",
        label: "transferAcctType",
        dependentFields: ["TRX_CD", "OPER_STATUS", "TRF_BRANCH_CD"],
        shouldExclude: (val1, dependentFields) => {
          if (
            dependentFields?.TRX_CD?.value === "3" &&
            dependentFields?.OPER_STATUS?.value === "B"
          ) {
            return false;
          }
          return true;
        },
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (currentField?.value) {
            formState.setDataOnFieldChange("SHORTCUTKEY_REQPARA", {
              ACCT_TYPE: currentField?.value,
              BRANCH_CD: dependentFieldValues?.TRF_BRANCH_CD?.value,
              COMP_CD: authState?.companyID,
            });
          }
          if (
            currentField?.value &&
            dependentFieldValues?.TRF_BRANCH_CD?.value?.length === 0
          ) {
            let buttonName = await formState?.MessageBox({
              messageTitle: t("ValidationFailed"),
              message: t("enterBranchCode"),
              buttonNames: ["Ok"],
              icon: "ERROR",
            });

            if (buttonName === "Ok") {
              return {
                TRF_ACCT_TYPE: {
                  value: "",
                  isFieldFocused: false,
                  ignoreUpdate: true,
                },
                TRF_BRANCH_CD: {
                  value: "",
                  isFieldFocused: true,
                  ignoreUpdate: true,
                },
              };
            }
          }
          return {
            TRF_ACCT_CD: { value: "", ignoreUpdate: false },
            ACCT_NM: { value: "" },
          };
        },
        GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
      },
      accountCodeMetadata: {
        name: "TRF_ACCT_CD",
        label: "transferAccNo",
        autoComplete: "off",
        maxLength: 20,
        dependentFields: [
          "TRX_CD",
          "TRF_ACCT_CD",
          "TRF_ACCT_TYPE",
          "TRF_BRANCH_CD",
          "OPER_STATUS",
        ],
        // runPostValidationHookAlways: true,
        // AlwaysRunPostValidationSetCrossFieldValues: {
        //   alwaysRun: true,
        //   touchAndValidate: true,
        // },
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (
            currentField?.value &&
            dependentFieldValues?.["TRF_BRANCH_CD"]?.value &&
            dependentFieldValues?.["TRF_ACCT_TYPE"]?.value
          ) {
            const reqParameters = {
              BRANCH_CD: dependentFieldValues?.TRF_BRANCH_CD?.value,
              COMP_CD: authState?.companyID,
              ACCT_TYPE: dependentFieldValues?.TRF_ACCT_TYPE?.value,
              ACCT_CD: utilFunction.getPadAccountNumber(
                currentField?.value,
                dependentFieldValues?.ACCT_TYPE?.optionData?.[0] ?? {}
              ),
              SCREEN_REF: formState?.docCD,
            };
            let postData = await GeneralAPI.getAccNoValidation(reqParameters);
            if (postData?.status === "999") {
              let btnName = await formState?.MessageBox({
                messageTitle: "ValidationFailed",
                message: postData?.messageDetails?.length
                  ? postData?.messageDetails
                  : "Somethingwenttowrong",
                icon: "ERROR",
              });
              if (btnName === "Ok") {
                formState?.handleDisableButton(false);
                return {
                  ACCT_CD: {
                    value: "",
                    ignoreUpdate: false,
                    isFieldFocused: true,
                  },
                  ACCT_NM: { value: "" },
                };
              }
            }
            let btn99, returnVal;
            for (const obj of postData?.MSG ?? []) {
              if (obj?.O_STATUS === "999") {
                await formState.MessageBox({
                  messageTitle: obj?.O_MSG_TITLE?.length
                    ? obj?.O_MSG_TITLE
                    : "ValidationFailed",
                  message: obj?.O_MESSAGE ?? "",
                  icon: "ERROR",
                });
                returnVal = "";
                break;
              } else if (obj?.O_STATUS === "9") {
                await formState.MessageBox({
                  messageTitle: obj?.O_MSG_TITLE?.length
                    ? obj?.O_MSG_TITLE
                    : "Alert",
                  message: obj?.O_MESSAGE ?? "",
                  icon: "WARNING",
                });
              } else if (obj?.O_STATUS === "99") {
                if (obj?.O_COLUMN_NM === "FREEZE_AC") {
                  const buttonName = await formState.MessageBox({
                    messageTitle: obj?.O_MSG_TITLE?.length
                      ? obj?.O_MSG_TITLE
                      : "Confirmation",
                    message: obj?.O_MESSAGE ?? "",
                    buttonNames: ["Yes", "No"],
                    defFocusBtnName: "No",
                    loadingBtnName: ["Yes"],
                    icon: "CONFIRM",
                  });

                  if (buttonName === "Yes") {
                    try {
                      const freezeResponse = await GeneralAPI.doAccountFreeze({
                        ENT_COMP_CD: authState?.companyID ?? "",
                        ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
                        BRANCH_CD:
                          dependentFieldValues?.TRF_BRANCH_CD?.value ?? "",
                        COMP_CD: authState?.companyID ?? "",
                        ACCT_TYPE:
                          dependentFieldValues?.TRF_ACCT_TYPE?.value ?? "",
                        ACCT_CD: utilFunction.getPadAccountNumber(
                          currentField?.value,
                          dependentFieldValues?.ACCT_TYPE?.optionData?.[0] ?? {}
                        ),
                      });

                      if (freezeResponse?.error) {
                        await formState.MessageBox({
                          messageTitle: "Error",
                          message:
                            freezeResponse?.errorMessage ??
                            "Unknownerroroccured",
                          icon: "ERROR",
                          buttonNames: ["OK"],
                        });
                      }
                    } catch (error: any) {
                      await formState.MessageBox({
                        messageTitle: "Error",
                        message: error?.error_msg ?? "Unknownerroroccured",
                        icon: "ERROR",
                        buttonNames: ["OK"],
                      });
                    }
                  }
                } else {
                  const buttonName = await formState.MessageBox({
                    messageTitle: obj?.O_MSG_TITLE?.length
                      ? obj?.O_MSG_TITLE
                      : "Confirmation",
                    message: obj?.O_MESSAGE ?? "",
                    buttonNames: ["Yes", "No"],
                    defFocusBtnName: "Yes",
                    icon: "CONFIRM",
                  });
                  if (buttonName === "No") {
                    break;
                  }
                }
              } else if (obj?.O_STATUS === "0") {
                returnVal = postData[0];
              }
            }
            btn99 = 0;
            if (postData) {
              formState.setDataOnFieldChange("SHORTCUTKEY_REQPARA", {
                ...reqParameters,
              });
            }
            return {
              TRF_ACCT_CD:
                returnVal !== ""
                  ? {
                      value: utilFunction.getPadAccountNumber(
                        currentField?.value,
                        dependentFieldValues?.ACCT_TYPE?.optionData?.[0] ?? {}
                      ),
                      ignoreUpdate: true,
                      isFieldFocused: false,
                    }
                  : {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
              ACCT_NM: {
                value: postData?.ACCT_NM ?? "",
              },
            };
          } else if (!currentField?.value) {
            return {
              ACCT_NM: { value: "" },
            };
          }
        },
        shouldExclude: (val1, dependentFields) => {
          if (
            dependentFields?.TRX_CD?.value === "3" &&
            dependentFields?.OPER_STATUS?.value === "B"
          ) {
            return false;
          }
          return true;
        },
        fullWidth: true,
        GridProps: { xs: 6, sm: 6, md: 4, lg: 2, xl: 2 },
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "TYPE_CD",
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CHEQUE_NO",
      label: "chequeNo",
      placeholder: "Cheque No.",
      type: "text",
      fullWidth: true,
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        isAllowed: (values) => {
          if (values?.value?.length > 6) {
            return false;
          }

          return true;
        },
      },
      GridProps: { xs: 6, sm: 6, md: 4, lg: 1, xl: 1 },
      dependentFields: [
        "TRF_ACCT_CD",
        "TYPE_CD",
        "TRF_ACCT_TYPE",
        "TRF_BRANCH_CD",
        "TRX_CD",
        "OPER_STATUS",
      ],
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ChequeNoisrequired"] }],
      },
      shouldExclude: (val1, dependentFields) => {
        if (
          dependentFields?.TRX_CD?.value === "3" &&
          dependentFields?.OPER_STATUS?.value === "B"
        ) {
          return false;
        }
        return true;
      },
      AlwaysRunPostValidationSetCrossFieldValues: {
        alwaysRun: true,
        touchAndValidate: false,
      },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFieldsValues
      ) => {
        if (
          field.value &&
          dependentFieldsValues?.TRF_ACCT_CD?.value.length === 0
        ) {
          let buttonName = await formState?.MessageBox({
            messageTitle: "Error",
            message: "Enter Account Information",
            buttonNames: ["Ok"],
            icon: "ERROR",
          });

          if (buttonName === "Ok") {
            return {
              CHEQUE_NO: {
                value: "",
                isFieldFocused: false,
                ignoreUpdate: true,
              },
              TRF_ACCT_TYPE: {
                value: "",
                isFieldFocused: true,
                ignoreUpdate: true,
              },
            };
          }
        } else if (
          field.value &&
          dependentFieldsValues?.TRF_ACCT_CD?.value.length
        ) {
          console.log(dependentFieldsValues?.TRF_ACCT_CD?.value, "");

          if (formState?.isSubmitting) return {};
          let postData = await GeneralAPI.getChequeNoValidation({
            BRANCH_CD: dependentFieldsValues?.TRF_BRANCH_CD?.value,
            ACCT_TYPE: dependentFieldsValues?.TRF_ACCT_TYPE?.value,
            ACCT_CD: utilFunction.getPadAccountNumber(
              dependentFieldsValues?.TRF_ACCT_CD?.value,
              dependentFieldsValues?.TRF_ACCT_TYPE?.optionData?.[0] ?? {}
            ),
            CHEQUE_NO: field.value,
            TYPE_CD: dependentFieldsValues?.TYPE_CD?.value,

            SCREEN_REF: formState?.docCD,
          });

          let returnVal;
          for (const obj of postData) {
            if (
              obj?.O_STATUS === "999" ||
              obj?.O_STATUS === "99" ||
              obj?.O_STATUS === "9"
            ) {
              const buttonName = await formState?.MessageBox({
                messageTitle: obj?.O_MSG_TITLE?.length
                  ? obj?.O_MSG_TITLE
                  : obj?.O_STATUS === "9"
                  ? "Alert"
                  : obj?.O_STATUS === "99"
                  ? "Confirmation"
                  : "ValidationFailed",
                message: obj?.O_MESSAGE ?? "",
                buttonNames: obj?.O_STATUS === "99" ? ["Yes", "No"] : ["Ok"],
                loadingBtnName: ["Yes"],
                icon:
                  obj?.O_STATUS === "999"
                    ? "ERROR"
                    : obj?.O_STATUS === "99"
                    ? "CONFIRM"
                    : obj?.O_STATUS === "9"
                    ? "WARNING"
                    : "INFO",
              });
              if (
                obj?.O_STATUS === "999" ||
                (obj?.O_STATUS === "99" && buttonName === "No")
              ) {
                break;
              }
            } else if (obj?.O_STATUS === "0") {
              returnVal = postData[0];
            }
          }
          return {
            CHEQUE_NO: returnVal
              ? {
                  value: field?.value,
                  isFieldFocused: false,
                  ignoreUpdate: true,
                }
              : {
                  value: "",
                  isFieldFocused: true,
                  ignoreUpdate: false,
                },
          };
        }
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "accountName",
      isReadOnly: true,
      type: "text",
      fullWidth: true,
      dependentFields: ["TRX_CD", "OPER_STATUS"],
      shouldExclude: (val1, dependentFields) => {
        if (
          dependentFields?.TRX_CD?.value === "3" &&
          dependentFields?.OPER_STATUS?.value === "B"
        ) {
          return false;
        }
        return true;
      },
      GridProps: { xs: 6, sm: 6, md: 4, lg: 2.5, xl: 2.5 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "EMP_ID",
      label: "accompanyEmployeeName",
      placeholder: "accompanyEmployeeName",
      disableCaching: true,
      options: (dependentValue, formState, _, authState) =>
        getRelationshipManagerOptions(authState?.companyID),
      _optionsKey: "getEmployeeName",
      dependentFields: ["OPER_STATUS"],
      shouldExclude: (val1, dependentFields) => {
        if (
          dependentFields?.OPER_STATUS?.value === "I" ||
          dependentFields?.OPER_STATUS?.value === "B"
        ) {
          return false;
        }
        return true;
      },
      validationRun: "onBlur",
      AlwaysRunPostValidationSetCrossFieldValues: {
        alwaysRun: true,
        touchAndValidate: true,
      },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        authState,
        dependentValue
      ) => {
        if (formState?.saveFn && field?.value) {
          formState?.saveFn();
        }
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },
  ],
};
