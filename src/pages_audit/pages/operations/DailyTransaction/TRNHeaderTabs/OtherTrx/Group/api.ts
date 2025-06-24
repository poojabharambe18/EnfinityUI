import { DefaultErrorObject } from "@acuteinfo/common-base";
import { AuthSDK } from "registry/fns/auth";

export const getGroupList = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDLYTRNGROUPACCTINFOTAB", {
      BRANCH_CD: reqData?.BRANCH_CD ?? "",
      COMP_CD: reqData?.COMP_CD ?? "",
      ACCT_TYPE: reqData?.ACCT_TYPE ?? "",
      ACCT_CD: reqData?.ACCT_CD ?? "",
    });
  if (status === "0") {
    let responseData = data;
    responseData.map((item, index) => {
      item.index = index;
      item.sr = index + 1;
    });
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
