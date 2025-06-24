import { greaterThanDate, utilFunction } from "@acuteinfo/common-base";
import * as API from "../api";
import { t } from "i18next";
import { GeneralAPI } from "registry/fns/functions";
import { validateHOBranch } from "components/utilFunction/function";

export const collateraljoint_tab_metadata = {
  form: {
    name: "collateraljoint_tab_form",
    label: "",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "sequence",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 6,
        },
        container: {
          direction: "row",
          spacing: 0.5,
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
      Divider: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "hidden",
      },
      name: "HIDDEN_COMP_CD",
      ignoreInSubmit: true,
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "HIDDEN_IsFreshEntry",
      ignoreInSubmit: true,
    },
    {
      render: {
        componentType: "arrayField",
      },
      name: "JOINT_HYPOTHICATION_DTL",
      // fixedRows: 1,
      changeRowOrder: true,
      hideRemoveIconOnSingleRecord: false,
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "hidden",
          },
          name: "SR_CD",
          ignoreInSubmit: false,
          __NEW__: {
            ignoreInSubmit: true,
          },
        },
        {
          render: {
            componentType: "hidden",
          },
          defaultValue: "M   ",
          name: "J_TYPE",
        },
        {
          render: {
            componentType: "divider",
          },
          name: "referenceDivider_ignoreField",
          label: "Reference",
          DividerProps: {
            sx: { color: "var(--theme-color1)", fontWeight: "500" },
          },
          GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "HIDDEN_CUSTOMER_ID",
          ignoreInSubmit: true,
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "CUSTOMER_ID",
          label: "CustomerId",
          placeholder: "EnterCustomerID",
          maxLength: 12,
          autoComplete: "off",
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 12) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
          },
          GridProps: { xs: 12, sm: 3, md: 3, lg: 2, xl: 2 },
          dependentFields: ["HIDDEN_CUSTOMER_ID"],
          postValidationSetCrossFieldValues: async (
            field,
            formState,
            authState,
            dependentFieldsValues
          ) => {
            if (formState?.isSubmitting) return {};
            if (Boolean(field?.value)) {
              if (
                field?.value ===
                dependentFieldsValues?.[
                  "JOINT_HYPOTHICATION_DTL.HIDDEN_CUSTOMER_ID"
                ]?.value
              ) {
                return {};
              }
              const data = await API.getCustomerData({
                CUSTOMER_ID: field.value,
                ACCT_TYPE: formState?.ACCT_TYPE ?? "",
                COMP_CD: authState?.companyID ?? "",
                SCREEN_REF: "M   ",
              });
              let response_messages: any[] = [];
              if (data && data?.[0]?.MSG && Array.isArray(data?.[0]?.MSG)) {
                response_messages = data?.[0]?.MSG;
              }
              if (response_messages?.length > 0) {
                const messagebox = async (
                  msgTitle,
                  msg,
                  buttonNames,
                  status
                ) => {
                  let buttonName = await formState.MessageBox({
                    messageTitle: msgTitle,
                    message: msg,
                    buttonNames: buttonNames,
                    icon:
                      status === "9"
                        ? "WARNING"
                        : status === "99"
                        ? "CONFIRM"
                        : status === "999"
                        ? "ERROR"
                        : status === "0" && "SUCCESS",
                  });
                  return { buttonName, status };
                };

                for (let i = 0; i < response_messages?.length; i++) {
                  if (response_messages[i]?.O_STATUS !== "0") {
                    let btnName = await messagebox(
                      response_messages[i]?.O_STATUS === "999"
                        ? "ValidationFailed"
                        : response_messages[i]?.O_STATUS === "99"
                        ? "Confirmation"
                        : "Alert",
                      response_messages[i]?.O_MESSAGE,
                      response_messages[i]?.O_STATUS === "99"
                        ? ["Yes", "No"]
                        : ["Ok"],
                      response_messages[i]?.O_STATUS
                    );
                    if (
                      btnName?.status === "999" ||
                      btnName?.buttonName === "No"
                    ) {
                      return {
                        CUSTOMER_ID: {
                          value: "",
                          isFieldFocused: true,
                          ignoreUpdate: false,
                        },
                      };
                    }
                  } else {
                    if (data?.[0]?.ACCOUNT_DTL) {
                      const CustomerData = data?.[0]?.ACCOUNT_DTL;
                      return {
                        HIDDEN_CUSTOMER_ID: { value: field?.value },
                        CUSTOMER_TYPE: { value: CustomerData?.CUSTOMER_TYPE },
                        REMARKS: { value: CustomerData?.REMARKS ?? "" },
                        PIN_CODE: { value: CustomerData?.PIN_CODE ?? "" },
                        COUNTRY_CD: { value: CustomerData?.COUNTRY_CD ?? "" },
                        AREA_CD: {
                          value: CustomerData?.AREA_CD ?? "",
                          ignoreUpdate: true,
                        },
                        // CUSTOMER_ID: {value: CustomerData?.CUSTOMER_ID},
                        CITY_CD: { value: CustomerData?.CITY_CD ?? "" },
                        CITY_ignoreField: {
                          value: CustomerData?.CITY_NM ?? "",
                        },
                        MEM_ACCT_TYPE: {
                          value: CustomerData?.MEM_ACCT_TYPE ?? "",
                          ignoreUpdate: true,
                        },
                        REF_PERSON_NAME: { value: CustomerData?.ACCT_NM ?? "" },
                        UNIQUE_ID: { value: CustomerData?.UNIQUE_ID ?? "" },
                        MASKED_UNIQUE_ID: {
                          value: CustomerData?.MASKED_UNIQUE_ID ?? "",
                        },
                        ADD3: { value: CustomerData?.ADD3 ?? "" },
                        ADD1: { value: CustomerData?.ADD1 ?? "" },
                        ADD2: { value: CustomerData?.ADD2 ?? "" },
                        STATE_CD: { value: CustomerData?.STATE_CD ?? "" },
                        MEM_ACCT_CD: {
                          value: CustomerData?.MEM_ACCT_CD ?? "",
                          ignoreUpdate: true,
                        },
                        DIST_CD: { value: CustomerData?.DISTRICT_CD ?? "" },
                        DISTRICT_ignoreField: {
                          value: CustomerData?.DISTRICT_CD ?? "",
                        },
                        GENDER: { value: CustomerData?.GENDER ?? "" },
                        FORM_60: { value: CustomerData?.FORM_60 ?? "" },
                        PAN_NO: { value: CustomerData?.PAN_NO ?? "" },
                        BIRTH_DATE: { value: CustomerData?.BIRTH_DT ?? "" },
                        MOBILE_NO: { value: CustomerData?.CONTACT2 ?? "" },
                        PHONE: { value: CustomerData?.CONTACT1 ?? "" },
                        CKYC_NUMBER: { value: CustomerData?.KYC_NUMBER ?? "" },
                        STATE_ignoreField: {
                          value: CustomerData?.STATE_CD ?? "",
                        },
                        COUNTRY_ignoreField: {
                          value: CustomerData?.COUNTRY_CD ?? "",
                        },
                        PATH_PHOTO: { value: CustomerData?.MEM_COMP_CD ?? "" },
                        ACCT_NM: { value: CustomerData?.PATH_PHOTO ?? "" },
                        PATH_SIGN: {
                          value: CustomerData?.MEM_BRANCH_CD ?? "",
                          ignoreUpdate: true,
                        },
                      };
                    }
                  }
                }
              }
            } else {
              return {
                HIDDEN_CUSTOMER_ID: { value: "" },
                CUSTOMER_TYPE: { value: "" },
                REMARKS: { value: "" },
                PIN_CODE: { value: "" },
                COUNTRY_CD: { value: "" },
                AREA_CD: { value: "" },
                // CUSTOMER_ID: {value: ""},
                CITY_CD: { value: "" },
                CITY_ignoreField: { value: "" },
                MEM_ACCT_TYPE: { value: "" },
                REF_PERSON_NAME: { value: "" },
                BIRTH_DATE: { value: "" },
                MASKED_UNIQUE_ID: { value: "" },
                ADD3: { value: "" },
                ADD1: { value: "" },
                ADD2: { value: "" },
                STATE_CD: { value: "" },
                MEM_ACCT_CD: { value: "" },
                ACCT_NM: { value: "" },
                DIST_CD: { value: "" },
                DISTRICT_ignoreField: {
                  value: "",
                },
                GENDER: { value: "" },
                DIN_NO: { value: "" },
                FORM_60: { value: "" },
                PAN_NO: { value: "" },
                CKYC_NUMBER: { value: "" },
                STATE_ignoreField: { value: "" },
                COUNTRY_ignoreField: { value: "" },
              };
            }
          },
        },
        {
          render: {
            componentType: "checkbox",
          },
          name: "ACTIVE_FLAG",
          label: "Active",
          GridProps: { xs: 3, sm: 2, md: 1.5, lg: 1, xl: 1 },
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (fieldData?.value === "Y") {
              return false;
            } else {
              return true;
            }
          },
          __NEW__: {
            shouldExclude() {
              return true;
            },
          },
        },
        // {
        //     render: {
        //         componentType: "typography"
        //     },
        //     name: "INTRODUCTOR",
        //     label: "Introductor A/C"
        // },
        // {
        //     render: {
        //         componentType: "autocomplete"
        //     },
        //     name: "NG_RELATION",
        //     label: "Guardian Relation",
        //     options: [], //api
        //     _optionsKey: "",
        //     GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        // },
        // {
        //     render: {
        //         componentType: "checkbox"
        //     },
        //     name: "ACTIVE",
        //     label: "Active",
        //     GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        // },
        // {
        //     render: {
        //         componentType: "datePicker"
        //     },
        //     name: "EVENT_DT",
        //     label: "Date",
        //     GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        // },
        // {
        //     render: {
        //         componentType: "numberFormat"
        //     },
        //     name: "NG_CUSTOMER_ID",
        //     label: "Guardian Customer Id",
        //     GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        // },
        // {
        //     render: {
        //         componentType: "textField"
        //     },
        //     name: "NG_NAME",
        //     label: "Guardian Name",
        //     GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        // },
        {
          render: {
            componentType: "textField",
          },
          name: "CUSTOMER_TYPE",
          ignoreInSubmit: true,
          shouldExclude: true,
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "MORTGAGE_ID",
          label: "MortgageNo",
          placeholder: "EnterMortgageNo",
          maxLength: 10,
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 10) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
          },
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            if (currentField?.value) {
              let postData = await API.getMortgageNoData({
                COMP_CD: authState?.companyID ?? "",
                TRAN_CD: currentField?.value ?? "",
              });

              let btn99, returnVal;

              const getButtonName = async (obj) => {
                let btnName = await formState.MessageBox(obj);
                return { btnName, obj };
              };

              for (let i = 0; i < postData.length; i++) {
                if (postData[i]?.O_STATUS === "999") {
                  await getButtonName({
                    messageTitle: postData[i]?.O_MSG_TITLE?.length
                      ? postData[i]?.O_MSG_TITLE
                      : "ValidationFailed",
                    message: postData[i]?.O_MESSAGE,
                    icon: "ERROR",
                  });
                  returnVal = "";
                } else if (postData[i]?.O_STATUS === "9") {
                  if (btn99 !== "No") {
                    await getButtonName({
                      messageTitle: postData[i]?.O_MSG_TITLE?.length
                        ? postData[i]?.O_MSG_TITLE
                        : "Alert",
                      message: postData[i]?.O_MESSAGE,
                      icon: "WARNING",
                    });
                  }
                  returnVal = postData[i];
                } else if (postData[i]?.O_STATUS === "99") {
                  const { btnName } = await getButtonName({
                    messageTitle: postData[i]?.O_MSG_TITLE?.length
                      ? postData[i]?.O_MSG_TITLE
                      : "Confirmation",
                    message: postData[i]?.O_MESSAGE,
                    buttonNames: ["Yes", "No"],
                    icon: "CONFIRM",
                  });
                  btn99 = btnName;
                  if (btnName === "No") {
                    returnVal = "";
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
              return {
                MORTGAGE_ID:
                  returnVal !== ""
                    ? {
                        value: currentField?.value ?? "",
                        ignoreUpdate: true,
                      }
                    : {
                        value: "",
                        isFieldFocused: true,
                        ignoreUpdate: false,
                      },
              };
            } else if (!currentField?.value) {
              return {};
            }
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },

        {
          render: {
            componentType: "divider",
          },
          name: "MembershipDivider_ignoreField",
          label: "Membership",
          DividerProps: {
            sx: { color: "var(--theme-color1)", fontWeight: "500" },
          },
          GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "PATH_PHOTO",
          label: "ACNo",
          placeholder: "COMPCD",
          dependentFields: [
            "HIDDEN_COMP_CD",
            "HIDDEN_IsFreshEntry",
            "CUSTOMER_ID",
          ],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const isFreshEntry = dependentFields?.HIDDEN_IsFreshEntry?.value;
            const compCD = dependentFields?.HIDDEN_COMP_CD?.value;
            const CustomerId =
              dependentFields?.["JOINT_HYPOTHICATION_DTL.CUSTOMER_ID"]?.value;
            if (Boolean(isFreshEntry) || !CustomerId) {
              return compCD;
            }
          },
          maxLength: 4,
          autoComplete: "off",
          GridProps: { xs: 12, sm: 2, md: 1.5, lg: 1, xl: 1 },
        },
        {
          render: { componentType: "_accountNumber" },
          branchCodeMetadata: {
            name: "PATH_SIGN",
            label: "",
            maxLength: 4,
            required: false,
            placeholder: "BRANCHCD",
            autoComplete: "off",
            runPostValidationHookAlways: true,
            isFieldFocused: true,
            postValidationSetCrossFieldValues: async (
              currentField,
              formState,
              authState,
              dependentFieldValues
            ) => {
              const isHOBranch = await validateHOBranch(
                currentField,
                formState?.MessageBox,
                authState
              );
              if (isHOBranch) {
                return {
                  PATH_SIGN: {
                    value: "",
                    isFieldFocused: true,
                    ignoreUpdate: false,
                  },
                };
              }
              return {
                ACCT_NM: { value: "" },
                MEM_ACCT_TYPE: { value: "" },
                MEM_ACCT_CD: { value: "", ignoreUpdate: false },
              };
            },
            schemaValidation: {
              type: "string",
              rules: [{ name: "", params: [""] }],
            },
            GridProps: { xs: 12, sm: 2, md: 1.5, lg: 1, xl: 1 },
          },
          accountTypeMetadata: {
            name: "MEM_ACCT_TYPE",
            dependentFields: ["PATH_SIGN"],
            runPostValidationHookAlways: true,
            label: "",
            required: false,
            placeholder: "AcctType",
            maxLength: 4,
            autoComplete: "off",
            disableCaching: true,
            options: (dependentValue, formState, _, authState) => {
              return GeneralAPI.get_Account_Type({
                COMP_CD: authState?.companyID,
                BRANCH_CD: authState?.user?.branchCode,
                USER_NAME: authState?.user?.id,
                DOC_CD: formState?.docCD ?? "",
              });
            },
            postValidationSetCrossFieldValues: async (
              currentField,
              formState,
              authState,
              dependentFieldValues
            ) => {
              if (currentField?.displayValue !== currentField?.value) {
                return {};
              }
              if (
                currentField?.value &&
                dependentFieldValues?.["JOINT_HYPOTHICATION_DTL.PATH_SIGN"]
                  ?.value?.length === 0
              ) {
                let buttonName = await formState?.MessageBox({
                  messageTitle: "Alert",
                  message: "EnterAccountBranch",
                  buttonNames: ["Ok"],
                  icon: "WARNING",
                });

                if (buttonName === "Ok") {
                  return {
                    MEM_ACCT_TYPE: {
                      value: "",
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    },
                    PATH_SIGN: {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
                  };
                }
              } else {
                return {
                  MEM_ACCT_CD: { value: "", ignoreUpdate: false },
                  ACCT_NM: { value: "" },
                };
              }
            },
            schemaValidation: {
              type: "string",
              rules: [{ name: "", params: [""] }],
            },
            GridProps: { xs: 12, sm: 3, md: 1.5, lg: 1, xl: 1 },
          },
          accountCodeMetadata: {
            name: "MEM_ACCT_CD",
            autoComplete: "off",
            dependentFields: ["MEM_ACCT_TYPE", "PATH_SIGN", "CUSTOMER_ID"],
            label: "",
            required: false,
            placeholder: "ACNo",
            maxLength: 8,
            runPostValidationHookAlways: true,
            postValidationSetCrossFieldValues: async (
              currentField,
              formState,
              authState,
              dependentFieldValues
            ) => {
              if (formState?.isSubmitting) return {};
              if (
                currentField.value &&
                dependentFieldValues?.["JOINT_HYPOTHICATION_DTL.MEM_ACCT_TYPE"]
                  ?.value?.length === 0
              ) {
                let buttonName = await formState?.MessageBox({
                  messageTitle: "Alert",
                  message: "EnterAccountType",
                  buttonNames: ["Ok"],
                  icon: "WARNING",
                });
                if (buttonName === "Ok") {
                  return {
                    MEM_ACCT_CD: {
                      value: "",
                      isFieldFocused: false,
                      ignoreUpdate: false,
                    },
                    MEM_ACCT_TYPE: {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
                  };
                }
              } else if (
                currentField?.value &&
                dependentFieldValues?.["JOINT_HYPOTHICATION_DTL.PATH_SIGN"]
                  ?.value &&
                dependentFieldValues?.["JOINT_HYPOTHICATION_DTL.MEM_ACCT_TYPE"]
                  ?.value
              ) {
                const reqParameters = {
                  COMP_CD: authState?.companyID ?? "",
                  BRANCH_CD:
                    dependentFieldValues?.["JOINT_HYPOTHICATION_DTL.PATH_SIGN"]
                      ?.value ?? "",
                  ACCT_TYPE:
                    dependentFieldValues?.[
                      "JOINT_HYPOTHICATION_DTL.MEM_ACCT_TYPE"
                    ]?.value ?? "",
                  ACCT_CD:
                    utilFunction.getPadAccountNumber(
                      currentField?.value,
                      dependentFieldValues?.[
                        "JOINT_HYPOTHICATION_DTL.MEM_ACCT_TYPE"
                      ]?.optionData?.[0]
                    ) ?? "",
                  CUSTOMER_ID:
                    dependentFieldValues?.[
                      "JOINT_HYPOTHICATION_DTL.CUSTOMER_ID"
                    ]?.value ?? "",
                  WORKING_DATE: authState?.workingDate ?? "",
                  USERNAME: authState?.user?.id ?? "",
                  USERROLE: authState?.role ?? "",
                  SCREEN_REF: formState?.docCD ?? "",
                };
                const postData = await API.validateShareMemAcct(reqParameters);
                let returnVal;
                for (const obj of postData?.MSG ?? []) {
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
                      buttonNames:
                        obj?.O_STATUS === "99" ? ["Yes", "No"] : ["Ok"],
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
                    returnVal = postData;
                  }
                }
                return {
                  MEM_ACCT_CD: returnVal
                    ? {
                        value:
                          utilFunction.getPadAccountNumber(
                            currentField?.value,
                            dependentFieldValues?.[
                              "JOINT_HYPOTHICATION_DTL.MEM_ACCT_TYPE"
                            ]?.optionData?.[0]
                          ) ?? "",
                        isFieldFocused: false,
                        ignoreUpdate: true,
                      }
                    : {
                        value: "",
                        isFieldFocused: true,
                        ignoreUpdate: true,
                      },
                  ACCT_NM: {
                    value: returnVal?.ACCT_NM ?? "",
                    ignoreUpdate: true,
                  },
                };
              } else if (!currentField?.value) {
                return {
                  ACCT_NM: { value: "", isFieldFocused: false },
                };
              }
              return {};
            },
            fullWidth: true,
            schemaValidation: {
              type: "string",
              rules: [{ name: "", params: [""] }],
            },
            GridProps: { xs: 12, sm: 5, md: 2, lg: 2.3, xl: 1.5 },
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ACCT_NM",
          label: "",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 6, md: 5.5, lg: 4, xl: 3 },
        },
        {
          render: {
            componentType: "formbutton",
          },
          name: "CRDT_WORTHINESS_ignoreField",
          label: "CreditWorthiness",
          type: "text",
          dependentFields: [
            "PATH_PHOTO",
            "PATH_SIGN",
            "MEM_ACCT_TYPE",
            "MEM_ACCT_CD",
          ],
          isReadOnly: (fieldValue, dependentFields, formState) => {
            if (
              Boolean(formState?.formMode) &&
              formState?.formMode === "view"
            ) {
              return true;
            } else {
              return false;
            }
          },
          GridProps: { xs: 12, sm: 3, md: 2, lg: 1.5, xl: 1.5 },
        },

        {
          render: {
            componentType: "divider",
          },
          name: "PersonaldtlDivider_ignoreField",
          label: "personaldtlDivider",
          DividerProps: {
            sx: { color: "var(--theme-color1)", fontWeight: "500" },
          },
          GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "REF_PERSON_NAME",
          label: "HolderName",
          placeholder: "EnterPersonName",
          autoComplete: "off",
          txtTransform: "uppercase",
          maxLength: 50,
          required: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["HolderNameIsRequired"] }],
          },
          preventSpecialChars: sessionStorage.getItem("specialChar") || "",
          GridProps: { xs: 12, sm: 8, md: 4.5, lg: 4.8, xl: 3 },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "BIRTH_DATE",
          label: "InceptionDate",
          placeholder: "DD/MM/YYYY",
          dependentFields: ["CUSTOMER_TYPE"],
          setFieldLabel: (dependentValue) => {
            const custType =
              dependentValue?.["JOINT_HYPOTHICATION_DTL.CUSTOMER_TYPE"]?.value;
            if (Boolean(custType)) {
              if (custType === "C") {
                return {
                  label: "InceptionDate",
                  placeholder: "",
                };
              } else {
                return {
                  label: "DateOfBirth",
                  placeholder: "",
                };
              }
            }
          },
          isMaxWorkingDate: true,
          validate: (value) => {
            if (
              Boolean(value?.value) &&
              !utilFunction.isValidDate(
                utilFunction.getParsedDate(value?.value)
              )
            ) {
              return "Mustbeavaliddate";
            } else if (
              greaterThanDate(value?.value, value?._maxDt, {
                ignoreTime: true,
              })
            ) {
              return t("DateShouldBeLessThanEqualToWorkingDT");
            }
            return "";
          },
          GridProps: { xs: 12, sm: 4, md: 2.5, lg: 2.4, xl: 1.5 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "GENDER",
          label: "Gender",
          options: [
            { label: "MALE", value: "M" },
            { label: "FEMALE", value: "F" },
            { label: "OTHER", value: "O" },
            { label: "TRANSGENDER", value: "T" },
          ],
          placeholder: "SelectGender",
          type: "text",
          GridProps: { xs: 12, sm: 6, md: 2.5, lg: 2.4, xl: 1.5 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "DESIGNATION",
          label: "DesignationRelation",
          options: (dependentValue, formState, _, authState) =>
            API.getGuardianorRelationTypeOp({
              COMP_CD: authState?.companyID,
              BRANCH_CD: authState?.user?.branchCode,
            }),
          _optionsKey: "designCollateralOp",
          placeholder: "SelectDesignationRelation",
          GridProps: { xs: 12, sm: 6, md: 2.5, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ADD1",
          label: "add1",
          placeholder: "EnterAdd1",
          maxLength: 100,
          autoComplete: "off",
          type: "text",
          txtTransform: "uppercase",
          preventSpecialChars: sessionStorage.getItem("specialChar") || "",
          GridProps: { xs: 12, sm: 6, md: 6, lg: 4, xl: 4 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ADD2",
          label: "add2",
          placeholder: "EnterAdd2",
          maxLength: 100,
          autoComplete: "off",
          type: "text",
          txtTransform: "uppercase",
          preventSpecialChars: sessionStorage.getItem("specialChar") || "",
          GridProps: { xs: 12, sm: 6, md: 6, lg: 4, xl: 4.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ADD3",
          label: "add3",
          placeholder: "EnterAdd3",
          maxLength: 55,
          autoComplete: "off",
          type: "text",
          txtTransform: "uppercase",
          preventSpecialChars: sessionStorage.getItem("specialChar") || "",
          GridProps: { xs: 12, sm: 6, md: 6, lg: 4, xl: 3.5 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "PIN_CODE",
          label: "PIN",
          placeholder: "EnterPIN",
          autoComplete: "off",
          maxLength: 6,
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 6) {
                return false;
              }
              return true;
            },
          },
          validate: (columnValue) => {
            const PIN = columnValue.value;
            if (Boolean(PIN) && PIN.length !== 6) {
              return "PinCodeShouldBeOfSixDigits";
            }
          },
          type: "text",
          GridProps: { xs: 12, sm: 6, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          runPostValidationHookAlways: true,
          name: "AREA_CD",
          label: "Area",
          enableVirtualized: true,
          dependentFields: ["PIN_CODE"],
          disableCaching: true,
          options: (dependentValue, formState, _, authState) =>
            API.getAreaListDDW(
              _?.["JOINT_HYPOTHICATION_DTL.PIN_CODE"]?.value,
              formState,
              _,
              authState
            ),
          _optionsKey: "collateralDtlAreaDDW",
          // setValueOnDependentFieldsChange: (dependentFields) => {
          // const pincode = dependentFields["JOINT_HOLDER_DTL.PIN_CODE"]?.value;
          //   if (Boolean(pincode)) {
          //     if (pincode.length < 6) {
          //       return "";
          //     }
          //   } else return null;
          // },
          postValidationSetCrossFieldValues: async (
            field,
            formState,
            authState,
            dependentFieldsValues
          ) => {
            return {
              PIN_CODE: {
                value: Boolean(field.value)
                  ? field?.optionData?.[0]?.PIN_CODE
                  : "",
              },
            };
          },
          placeholder: "selectArea",
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "CITY_ignoreField",
          label: "City",
          isReadOnly: true,
          placeholder: "",
          type: "text",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["JOINT_HYPOTHICATION_DTL.AREA_CD"].optionData;
            if (optionData && optionData.length > 0) {
              return optionData[0].CITY_NM;
            } else return "";
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "CITY_CD",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["JOINT_HYPOTHICATION_DTL.AREA_CD"].optionData;
            if (optionData && optionData.length > 0) {
              return optionData[0].CITY_CD;
            } else return "";
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "DISTRICT_ignoreField",
          label: "DistrictName",
          isReadOnly: true,
          placeholder: "",
          type: "text",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["JOINT_HYPOTHICATION_DTL.AREA_CD"].optionData;
            if (optionData && optionData.length > 0) {
              return optionData[0].DIST_NM;
            } else return "";
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "DIST_CD",
          label: "hiddendistrict",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["JOINT_HYPOTHICATION_DTL.AREA_CD"].optionData;
            if (optionData && optionData.length > 0) {
              return optionData[0].DISTRICT_CD;
            } else return "";
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "STATE_ignoreField",
          label: "State",
          isReadOnly: true,
          ignoreInSubmit: true,
          placeholder: "",
          type: "text",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["JOINT_HYPOTHICATION_DTL.AREA_CD"].optionData;
            if (optionData && optionData.length > 0) {
              return optionData[0].STATE_NM;
            } else return "";
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "STATE_CD",
          label: "hiddendistrict",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["JOINT_HYPOTHICATION_DTL.AREA_CD"].optionData;
            if (optionData && optionData.length > 0) {
              return optionData[0].STATE_CD;
            } else return "";
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "COUNTRY_ignoreField",
          label: "Country",
          isReadOnly: true,
          ignoreInSubmit: true,
          placeholder: "",
          type: "text",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["JOINT_HYPOTHICATION_DTL.AREA_CD"].optionData;
            if (optionData && optionData.length > 0) {
              return optionData[0].COUNTRY_NM;
            } else return "";
          },
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "COUNTRY_CD",
          label: "hiddendistrict",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["JOINT_HYPOTHICATION_DTL.AREA_CD"].optionData;
            if (optionData && optionData.length > 0) {
              return optionData[0].COUNTRY_CD;
            } else return "";
          },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "CKYC_NUMBER",
          label: "CkycNo",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "MOBILE_NO",
          label: "MobileNum",
          isReadOnly: true,
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "PHONE",
          label: "phone",
          placeholder: "EnterPhone",
          autoComplete: "off",
          maxLength: 20,
          validate: (value) => {
            if (Boolean(value?.value) && value?.value.length < 11) {
              return "PhoneNumberMinimumdigitValidation";
            }
            return "";
          },
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "MASKED_UNIQUE_ID",
          label: "UIDAadhaar",
          isReadOnly: true,
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "FORM_60",
          label: "Form6061",
          isReadOnly: true,
          placeholder: "",
          defaultValue: "N",
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
          options: [
            { label: "Form 60", value: "Y" },
            { label: "Form 61", value: "F" },
            { label: "No", value: "N" },
          ],
        },
        {
          render: {
            componentType: "panCard",
          },
          name: "PAN_NO",
          label: "PanNum",
          isReadOnly: true,
          type: "text",
          txtTransform: "uppercase",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
          schemaValidation: {
            type: "string",
            rules: [
              {
                name: "pancard",
                params: ["PleaseEnterValidPANNumber"],
              },
            ],
          },
          validate: (columnValue) => API.validatePAN(columnValue),
          dependentFields: ["FORM_60"],
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (
              !Boolean(
                dependentFieldsValues?.["JOINT_HYPOTHICATION_DTL.FORM_60"]
                  ?.value
              ) ||
              dependentFieldsValues?.["JOINT_HYPOTHICATION_DTL.FORM_60"]
                ?.value === "N"
            ) {
              return false;
            } else {
              return true;
            }
          },
          maxLength: 10,
        },
        {
          render: {
            componentType: "textField",
          },
          name: "REMARKS",
          label: "Remarks",
          placeholder: "EnterRemarks",
          autoComplete: "off",
          maxLength: 300,
          preventSpecialChars: sessionStorage.getItem("specialChar") || "",
          GridProps: { xs: 12, sm: 8, md: 6, lg: 6, xl: 4 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "CKYC_NUMBER",
          label: "CKYCNO",
          type: "text",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        // {
        //     render: {
        //         componentType: "datePicker"
        //     },
        //     name: "",
        //     label: "Date of Death",
        //     GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        // },
        {
          render: {
            componentType: "divider",
          },
          name: "MortgageDivider_ignoreField",
          label: "MortgageHypothicationSecurityDetail",
          DividerProps: {
            sx: { color: "var(--theme-color1)", fontWeight: "500" },
          },
          GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "MORT_DESCRIPTION",
          label: "Description",
          maxLength: 200,
          placeholder: "EnterDescription",
          GridProps: { xs: 12, sm: 10, md: 8, lg: 6, xl: 3 },
        },
        {
          render: {
            componentType: "formbutton",
          },
          name: "PROPERTY_ignoreField",
          label: "Property",
          type: "text",
          isReadOnly: (fieldValue, dependentFields, formState) => {
            if (
              Boolean(formState?.formMode) &&
              formState?.formMode === "view"
            ) {
              return true;
            } else {
              return false;
            }
          },
          GridProps: { xs: 12, sm: 2, md: 1, lg: 1, xl: 1 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "MORT_TYPE",
          label: "MortType",
          options: (dependentValue, formState, _, authState) =>
            API.getMortgageTypeOp({
              COMP_CD: authState?.companyID,
              BRANCH_CD: authState?.user?.branchCode,
            }),
          _optionsKey: "mortTypeCollateralOp",
          placeholder: "SelectMortType",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "SECURITY_TYPE",
          label: "SecurityType",
          options: [
            { label: "Prime", value: "P" },
            { label: "Collateral", value: "C" },
          ],
          placeholder: "SelectSecurityType",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 2 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "SECURITY_CD",
          label: "Security",
          options: (dependentValue, formState, _, authState) =>
            API.getCollateralSecurityDataDDW({
              COMP_CD: authState?.companyID,
              BRANCH_CD: authState?.user?.branchCode,
            }),
          _optionsKey: "securityCollateralOp",
          placeholder: "SelectSecurity",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "formbutton",
          },
          name: "OTHRSECURITY_ignoreField",
          label: "OtherSecurity",
          dependentFields: ["SECURITY_CD", "SECURITY_TYPE"],
          type: "text",
          isReadOnly: (fieldValue, dependentFields, formState) => {
            if (
              Boolean(formState?.formMode) &&
              formState?.formMode === "view"
            ) {
              return true;
            } else {
              return false;
            }
          },
          GridProps: { xs: 12, sm: 4, md: 2, lg: 1.5, xl: 1 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "MORT_AMT",
          label: "CostValue",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 2 },
        },
        {
          render: {
            componentType: "divider",
          },
          name: "ValuerDivider_ignoreField",
          label: "Valuer",
          DividerProps: {
            sx: { color: "var(--theme-color1)", fontWeight: "500" },
          },
          GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "VALUER_CODE",
          label: "Name",
          placeholder: "SelectName",
          options: (dependentValue, formState, _, authState) =>
            API.getValuerTypeOp({
              COMP_CD: authState?.companyID,
              BRANCH_CD: authState?.user?.branchCode,
            }),
          _optionsKey: "valuerCollateralOp",
          GridProps: { xs: 12, sm: 6, md: 3, lg: 2.5, xl: 2 },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "VALUATION_DT",
          label: "ValuationDate",
          placeholder: "DD/MM/YYYY",
          validate: (value) => {
            if (
              Boolean(value?.value) &&
              !utilFunction.isValidDate(
                utilFunction.getParsedDate(value?.value)
              )
            ) {
              return "Mustbeavaliddate";
            }
            return "";
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 2 },
        },
        {
          render: {
            componentType: "formbutton",
          },
          name: "MACHINERY_ignoreField",
          label: "Machinery",
          type: "text",
          isReadOnly: (fieldValue, dependentFields, formState) => {
            if (
              Boolean(formState?.formMode) &&
              formState?.formMode === "view"
            ) {
              return true;
            } else {
              return false;
            }
          },
          GridProps: { xs: 12, sm: 2, md: 1, lg: 1, xl: 1 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "VALUE_AMT",
          label: "Value",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 2 },
        },
        {
          render: {
            componentType: "divider",
          },
          name: "TitleClearanceDivider_ignoreField",
          label: "TitleClearance",
          DividerProps: {
            sx: { color: "var(--theme-color1)", fontWeight: "500" },
          },
          GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "ADVOCATE_CODE",
          label: "Advocate",
          options: (dependentValue, formState, _, authState) =>
            API.getAdvocateTypeOp({
              COMP_CD: authState?.companyID,
              BRANCH_CD: authState?.user?.branchCode,
            }),
          _optionsKey: "advocateCollateralOp",
          placeholder: "SelectAdvocate",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 2 },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "TITLE_CLEAR_DT",
          label: "ClearanceDate",
          placeholder: "DD/MM/YYYY",
          validate: (value) => {
            if (
              Boolean(value?.value) &&
              !utilFunction.isValidDate(
                utilFunction.getParsedDate(value?.value)
              )
            ) {
              return "Mustbeavaliddate";
            }
            return "";
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 2 },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "UNIQUE_ID", // Original Unique Id
          label: "UIDAadhaar",
        },
      ],
    },
  ],
};
