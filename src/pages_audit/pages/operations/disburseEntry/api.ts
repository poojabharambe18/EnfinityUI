import { DefaultErrorObject } from "@acuteinfo/common-base";
import { AuthSDK } from "registry/fns/auth";

export const validateDisAcct = async (req) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATEDISBACCT", {
      ...req,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const validateNewDisbAmt = async (req) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATENEWDISBAMT", {
      ...req,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const validateDisbtrnAmt = async (req) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATEDISBTRNAMT", {
      ...req,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const validateDisbentry = async (req) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATEDISBENTRY", {
      ...req,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getDisbSchedule = async (req) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDISBSCHEDULE", {
      ...req,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getSubmemifScac = async (req) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSUBMEMIFSCAC", {
      ...req,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

// --TRANSACTION grid data
export const getDisbConfTrn = async (req) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDISBCONFTRNDATA", {
      ...req,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

// Confirm
export const entryConfirm = async (req) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DODISBENTRYCONFIRMATION", {
      ...req,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

// View Memo
export const viewmemo = async (req) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VIEWMEMODETAILS", {
      ...req,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const insertAPi = async (req) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DODISBURSEMENTENTRY", {
      ...req,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
