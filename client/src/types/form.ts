import type { FormikHelpers } from "formik";
import type { ReactNode } from "react";

export interface ReusableFormProps<T> {
  initialValues: T;
  validationSchema: any; // yup schema
  onSubmit: (values: T, helpers: FormikHelpers<T>) => void | Promise<void>;
  children: (props: {
    values: T;
    errors: Record<string, any>;
    touched: Record<string, any>;
    handleChange: (e: any) => void;
    handleBlur: (e: any) => void;
  }) => ReactNode; // function-as-child that renders form fields
}



export interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: any;
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur?: (e: React.FocusEvent<any>) => void;
  error?: string | undefined;
}