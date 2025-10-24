// components/ReusableForm.tsx
import { Formik, Form } from "formik";
import type { ReusableFormProps } from "@/types/form";



const ReusableForm = <T extends {}>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
}: ReusableFormProps<T>) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({
        errors,
        touched,
        handleChange,
        handleBlur,
        values,
        isSubmitting,
      }) => (
        <Form className="space-y-4">
          {children({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
          })}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ReusableForm;
