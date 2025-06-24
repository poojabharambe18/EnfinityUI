import { greaterThanDate, utilFunction } from "@acuteinfo/common-base";
import * as API from "../api";
import { t } from "i18next";
import { GeneralAPI } from "registry/fns/functions";
import { validateHOBranch } from "components/utilFunction/function";

export const joint_tab_metadata = {
  form: {
    name: "joint_tab_form",
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
      name: "JOINT_HOLDER_DTL",
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
          defaultValue: "J   ",
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
                dependentFieldsValues?.["JOINT_HOLDER_DTL.HIDDEN_CUSTOMER_ID"]
                  ?.value
              ) {
                return {};
              }
              const data = await API.getCustomerData({
                CUSTOMER_ID: field.value,
                ACCT_TYPE: formState?.ACCT_TYPE ?? "",
                COMP_CD: authState?.companyID ?? "",
                SCREEN_REF: "J   ",
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
                        PIN_CODE: {
                          value: CustomerData?.PIN_CODE ?? "",
                          ignoreUpdate: false,
                        },
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
                        DIN_NO: { value: CustomerData?.DIN_NO ?? "" },
                        FORM_60: { value: CustomerData?.FORM_60 ?? "" },
                        PAN_NO: { value: CustomerData?.PAN_NO ?? "" },
                        MOBILE_NO: { value: CustomerData?.CONTACT2 ?? "" },
                        BIRTH_DATE: { value: CustomerData?.BIRTH_DT ?? "" },
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
                MASKED_UNIQUE_ID: { value: "" },
                ADD3: { value: "" },
                ADD1: { value: "" },
                ADD2: { value: "" },
                STATE_CD: { value: "" },
                MEM_ACCT_CD: { value: "" },
                ACCT_NM: { value: "" },
                DIST_CD: { value: "" },
                DISTRICT_ignoreField: { value: "" },
                GENDER: { value: "" },
                DIN_NO: { value: "" },
                FORM_60: { value: "" },
                PAN_NO: { value: "" },
                MOBILE_NO: { value: "" },
                BIRTH_DATE: { value: "" },
                PHONE: { value: "" },
                CKYC_NUMBER: { value: "" },
                STATE_ignoreField: { value: "" },
                COUNTRY_ignoreField: { value: "" },
              };
            }
          },
        },
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
        {
          render: {
            componentType: "datePicker",
          },
          name: "EVENT_DT",
          label: "Date",
          placeholder: "DD/MM/YYYY",
          type: "text",
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
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (fieldData?.value) {
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
          GridProps: { xs: 12, sm: 6, md: 3, lg: 2, xl: 2 },
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
              dependentFields?.["JOINT_HOLDER_DTL.CUSTOMER_ID"]?.value;
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
            required: false,
            runPostValidationHookAlways: true,
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
            schemaValidation: {},
            GridProps: { xs: 12, sm: 2, md: 1.5, lg: 1, xl: 1 },
          },
          accountTypeMetadata: {
            name: "MEM_ACCT_TYPE",
            dependentFields: ["PATH_SIGN"],
            runPostValidationHookAlways: true,
            label: "",
            required: false,
            disableCaching: true,
            options: (...arg) => {
              return GeneralAPI.get_Account_Type({
                COMP_CD: arg?.[3]?.companyID ?? "",
                BRANCH_CD:
                  arg?.[2]?.["JOINT_HOLDER_DTL.PATH_SIGN"]?.value ?? "",
                USER_NAME: arg?.[3]?.user?.id ?? "",
                DOC_CD: "SHARE",
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
                dependentFieldValues?.["JOINT_HOLDER_DTL.PATH_SIGN"]?.value
                  ?.length === 0
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
            schemaValidation: {},
            GridProps: { xs: 12, sm: 3, md: 1.5, lg: 1, xl: 1 },
          },
          accountCodeMetadata: {
            name: "MEM_ACCT_CD",
            autoComplete: "off",
            dependentFields: ["MEM_ACCT_TYPE", "PATH_SIGN", "CUSTOMER_ID"],
            label: "",
            required: false,
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
                dependentFieldValues?.["JOINT_HOLDER_DTL.MEM_ACCT_TYPE"]?.value
                  ?.length === 0
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
                dependentFieldValues?.["JOINT_HOLDER_DTL.PATH_SIGN"]?.value &&
                dependentFieldValues?.["JOINT_HOLDER_DTL.MEM_ACCT_TYPE"]?.value
              ) {
                const reqParameters = {
                  COMP_CD: authState?.companyID ?? "",
                  BRANCH_CD:
                    dependentFieldValues?.["JOINT_HOLDER_DTL.PATH_SIGN"]
                      ?.value ?? "",
                  ACCT_TYPE:
                    dependentFieldValues?.["JOINT_HOLDER_DTL.MEM_ACCT_TYPE"]
                      ?.value ?? "",
                  ACCT_CD:
                    utilFunction.getPadAccountNumber(
                      currentField?.value,
                      dependentFieldValues?.["JOINT_HOLDER_DTL.MEM_ACCT_TYPE"]
                        ?.optionData?.[0]
                    ) ?? "",
                  CUSTOMER_ID:
                    dependentFieldValues?.["JOINT_HOLDER_DTL.CUSTOMER_ID"]
                      ?.value ?? "",
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
                              "JOINT_HOLDER_DTL.MEM_ACCT_TYPE"
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
            schemaValidation: {},
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
            componentType: "rateOfInt",
          },
          name: "SHARE_PER",
          label: "Share",
          placeholder: "",
          type: "text",
          FormatProps: {
            isAllowed: (values) => {
              if (values?.floatValue > 100) {
                return false;
              }
              return true;
            },
          },
          GridProps: { xs: 12, sm: 3, md: 2, lg: 1, xl: 1.5 },
        },
        {
          render: {
            componentType: "divider",
          },
          name: "PersonaldtlDivider_ignoreField",
          label: "",
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
          label: "PersonName",
          placeholder: "EnterPersonName",
          autoComplete: "off",
          txtTransform: "uppercase",
          maxLength: 50,
          required: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["PersonNameIsRequired"] }],
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
          dependentFields: ["CUSTOMER_TYPE", "GENDER"],
          setFieldLabel: (dependentValue) => {
            const custType =
              dependentValue?.["JOINT_HOLDER_DTL.CUSTOMER_TYPE"]?.value ?? "";
            const gender =
              dependentValue?.["JOINT_HOLDER_DTL.GENDER"]?.value ?? "";
            if (Boolean(custType)) {
              if (
                custType === "I" &&
                (gender === "M" || gender === "F" || gender === "T")
              ) {
                return {
                  label: "DateOfBirth",
                  placeholder: "",
                };
              } else {
                return {
                  label: "InceptionDate",
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
          _optionsKey: "designJointOP",
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
          GridProps: { xs: 12, sm: 6, md: 3, lg: 2.4, xl: 2.1 },
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
              _?.["JOINT_HOLDER_DTL.PIN_CODE"]?.value,
              formState,
              _,
              authState
            ),
          _optionsKey: "AreaDDW",
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
              dependentFields?.["JOINT_HOLDER_DTL.AREA_CD"].optionData;
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
              dependentFields?.["JOINT_HOLDER_DTL.AREA_CD"].optionData;
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
              dependentFields?.["JOINT_HOLDER_DTL.AREA_CD"].optionData;
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
              dependentFields?.["JOINT_HOLDER_DTL.AREA_CD"].optionData;
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
              dependentFields?.["JOINT_HOLDER_DTL.AREA_CD"].optionData;
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
          label: "hiddenState",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["JOINT_HOLDER_DTL.AREA_CD"].optionData;
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
              dependentFields?.["JOINT_HOLDER_DTL.AREA_CD"].optionData;
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
          label: "hiddenCountry",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["JOINT_HOLDER_DTL.AREA_CD"].optionData;
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
          type: "text",
          txtTransform: "uppercase",
          isReadOnly: true,
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
          dependentFields: ["FORM_60"],
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (
              !Boolean(
                dependentFieldsValues?.["JOINT_HOLDER_DTL.FORM_60"]?.value
              ) ||
              dependentFieldsValues?.["JOINT_HOLDER_DTL.FORM_60"]?.value === "N"
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
            componentType: "numberFormat",
          },
          name: "DIN_NO",
          label: "DIN",
          placeholder: "EnterDIN",
          maxLength: 8,
          FormatProps: {
            allowNegative: false,
            isAllowed: (values) => {
              if (values?.value?.length > 8) {
                return false;
              }
              return true;
            },
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
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
