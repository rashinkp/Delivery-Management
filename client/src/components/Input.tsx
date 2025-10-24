import type { FC } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { FormInputProps } from "@/types/form";

const FormInput: FC<FormInputProps & { icon?: React.ReactNode }> = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  icon,
}) => {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
        <Input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`h-11 transition-colors ${
            icon ? "pl-10" : ""
          } ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default FormInput
