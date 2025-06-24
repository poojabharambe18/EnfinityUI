import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, isValid } from "date-fns";
import { isArray } from "lodash";
import { FormHelperText, Tooltip } from "@mui/material";
import { t } from "i18next";
import { parseDate } from "../utils/helper";
import { usePropertiesConfigContext } from "@acuteinfo/common-base";

const CustomDatePickerEditor = forwardRef((props: any, ref) => {
  const {
    value,
    colDef: { field, cellEditorParams },
    node,
    api,
    onValueChange,
    context,
  } = props;

  const { postValidationSetCrossAccessorValues } = cellEditorParams || {};
  const { commonDateFormat = "dd/MM/yyyy" } = usePropertiesConfigContext();

  const getInitialDate = () => {
    const parsedDate = parseDate(value);
    return isValid(parsedDate) ? parsedDate : null;
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(getInitialDate);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useImperativeHandle(ref, () => ({
    getValue: () =>
      selectedDate ? format(selectedDate, commonDateFormat) : "",
  }));

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, []);

  useEffect(() => {
    if (!value) {
      const today = new Date();
      setSelectedDate(today);
      const formattedDate = format(today, commonDateFormat);
      const newData = {
        ...node.data,
        [field]: formattedDate,
      };
      node.setData(newData);
      onValueChange?.(formattedDate);
    }
  }, [value]);

  const handleChange = (newDate: Date | null) => {
    if (!newDate || !isValid(newDate)) {
      const today = new Date();
      setSelectedDate(today);
      const formattedDate = format(today, commonDateFormat);
      const newData = {
        ...node.data,
        [field]: formattedDate,
      };
      node.setData(newData);
      onValueChange?.(formattedDate);
      return;
    }

    setSelectedDate(newDate);
    const formattedDate = format(newDate, commonDateFormat);
    const newData = {
      ...node.data,
      [field]: formattedDate,
    };
    node.setData(newData);
    onValueChange?.(formattedDate);
  };

  const handleBlurDate = async (event: React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (typeof postValidationSetCrossAccessorValues === "function") {
      //* Set loader true
      const existingLoaders = node.data.loader || [];

      const updatedLoader = [
        ...existingLoaders.filter((err) => err.field !== field),
      ];

      node.setData({
        ...node.data,
        loader: [...updatedLoader, { field, loader: true }],
      });

      await postValidationSetCrossAccessorValues(
        selectedDate,
        node,
        api,
        field,
        onValueChange,
        context
      );
      //* Set loader false
      node.setData({
        ...node.data,
        loader: [...updatedLoader, { field, loader: false }],
      });
    }
  };

  if (node?.rowPinned) {
    return null;
  }
  const fieldError = node.data?.errors?.find((item) => item.field === field);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          defaultValue={new Date()}
          format="dd/MM/yyyy"
          value={selectedDate}
          onChange={handleChange}
          slotProps={{
            textField: {
              onBlur: handleBlurDate,
              variant: "outlined",
              fullWidth: true,
              size: "small",
              inputRef: inputRef,
            },
          }}
          sx={{
            "& input": {
              border: "none",
              padding: "4px 4px",
              textAlign: "center",
            },
            "& fieldset": { border: "none" },
          }}
        />
      </LocalizationProvider>
      {isArray(node.data?.errors) && fieldError ? (
        <Tooltip title={t(fieldError.message)} arrow>
          <FormHelperText
            style={{
              marginTop: "0px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            error={true}
          >
            {t(fieldError.message)}
          </FormHelperText>
        </Tooltip>
      ) : null}
    </>
  );
});

export default CustomDatePickerEditor;
