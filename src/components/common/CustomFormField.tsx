/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormFieldType } from "@/types/types";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { E164Number } from "libphonenumber-js/core";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface CustomProps {
  control: Control<any>;
  fieldType: FormFieldType;
  name: string;
  type?: string;
  readOnly?: boolean;
  placeholder?: string;
  label?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
}

const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {props.iconSrc && (
            <img
              src={props.iconSrc}
              height={
                props.iconSrc === "/src/assets/icons/key.svg"
                  ? 16
                  : props.iconSrc === "/src/assets/icons/naira.svg"
                  ? 16
                  : 24
              }
              width={
                props.iconSrc === "/src/assets/icons/key.svg"
                  ? 16
                  : props.iconSrc === "/src/assets/icons/naira.svg"
                  ? 16
                  : 24
              }
              alt={props.iconAlt || "icon"}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              type={props.type === "number" ? "number" : "text"}
              readOnly={props.readOnly}
              className="shad-input border-0"
            />
          </FormControl>
        </div>
      );

    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            country="ng"
            disabled={props.readOnly}
            placeholder={props.placeholder}
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            buttonStyle={{
              backgroundColor: "#1a1d21",
              borderColor: "#363a3d",
            }}
            dropdownStyle={{
              backgroundColor: "#1a1d21",
              fontSize: 13,
            }}
            inputStyle={{
              height: "2.75rem",
              backgroundColor: "#1a1d21",
              borderColor: "#363a3d",
              borderRadius: "6px",
              width: "100%",
            }}
          />
        </FormControl>
      );

    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            readOnly={props.readOnly}
            className="shad-textArea"
            disabled={props.disabled}
          />
        </FormControl>
      );

    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={props.readOnly}
            />
            <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
          </div>
        </FormControl>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          <img
            src="/src/assets/icons/calendar.svg"
            height={24}
            width={24}
            alt="user"
            className="ml-2"
          />
          <FormControl>
            <ReactDatePicker
              showTimeSelect={props.showTimeSelect ?? false}
              selected={field.value}
              disabled={props.readOnly}
              onChange={(date: Date | null) => {
                field.onChange(date);
              }}
              timeInputLabel="Time:"
              dateFormat={props.dateFormat ?? "MM/dd/yyyy"}
              wrapperClassName="date-picker"
            />
          </FormControl>
        </div>
      );
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select
            disabled={props.readOnly}
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger className="shad-select-trigger">
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    default:
      return null;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, fieldType, name, label } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel>{label}</FormLabel>
          )}

          <RenderField field={field} props={props} />
          <FormMessage className="shad-error text-xs" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
