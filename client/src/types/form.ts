import type { FormikErrors, FormikHelpers, FormikTouched } from "formik";

export interface ReusableFormProps<T> {
  initialValues: T;
  validationSchema?: any; // Yup schema
  validationContext?: any; // For conditional validation
  onSubmit: (values: T, helpers: FormikHelpers<T>) => void | Promise<void>;
  children: (props: {
    values: T;
    errors: FormikErrors<T>; // ✅ Use FormikErrors
    touched: FormikTouched<T>; // ✅ Use FormikTouched
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
    isSubmitting: boolean;
  }) => React.ReactNode;
  submitButtonText?: string;
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