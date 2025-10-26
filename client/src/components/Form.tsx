import { Formik, Form, type FormikProps } from "formik";
import type { ReusableFormProps } from "@/types/form";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

const ReusableForm = <T extends {}>({
  initialValues,
  validationSchema,
  validationContext,
  onSubmit,
  children,
  submitButtonText = "Submit",
}: ReusableFormProps<T> & { submitButtonText?: string }) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validationContext={validationContext}
      onSubmit={onSubmit}
    >
      {(formik: FormikProps<T>) => (
        <Form className="space-y-6">
          {typeof children === "function"
            ? (children as (props: FormikProps<T>) => React.ReactNode)(formik)
            : children}

          <Button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full h-11 text-base font-medium flex items-center justify-center gap-2"
          >
            {formik.isSubmitting && <Loader2 className="animate-spin h-5 w-5" />}
            {submitButtonText}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ReusableForm;
