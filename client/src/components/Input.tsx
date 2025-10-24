import type { FC } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { FormInputProps } from "@/types/form";

const FormInput: FC<FormInputProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
}) => {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`h-11 transition-colors ${
          error ? "border-red-500 focus-visible:ring-red-500" : ""
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;
