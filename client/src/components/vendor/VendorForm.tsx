// src/components/vendor/VendorForm.tsx
"use client";

import * as Yup from "yup";
import ReusableForm from "../Form";
import FormInput from "../Input";
import type { CreateVendorDto, UpdateVendorDto } from "@/types/vendor";

type Props = {
  initialValues?: Partial<CreateVendorDto>;
  onSubmit: (values: CreateVendorDto | UpdateVendorDto) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
};

export const VendorForm = ({ initialValues, onSubmit, onClose, isLoading = false }: Props) => {
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .required("Vendor name is required"),
    location: Yup.string()
      .min(2, "Location must be at least 2 characters")
      .max(100, "Location must be less than 100 characters")
      .required("Location is required"),
    contactNumber: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Contact number must start with 6-9 and be exactly 10 digits")
      .required("Contact number is required"),
    email: Yup.string()
      .email("Must be a valid email")
      .required("Email is required"),
    address: Yup.string()
      .min(10, "Address must be at least 10 characters")
      .max(200, "Address must be less than 200 characters")
      .required("Address is required"),
  });

  const defaults = {
    name: "",
    location: "",
    contactNumber: "",
    email: "",
    address: "",
    ...initialValues,
  };

  return (
    <ReusableForm
      initialValues={defaults}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await onSubmit(values);
          onClose();
        } catch (error) {
          console.error("Form submission error:", error);
          throw error;
        } finally {
          setSubmitting(false);
        }
      }}
      submitButtonText={isLoading ? "Saving..." : (initialValues?.name ? "Update Vendor" : "Create Vendor")}
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <>
          <FormInput
            label="Vendor Name"
            name="name"
            placeholder="Enter vendor name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name && errors.name ? errors.name : undefined}
          />
          
          <FormInput
            label="Location"
            name="location"
            placeholder="Enter location"
            value={values.location}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.location && errors.location ? errors.location : undefined}
          />
          
          <FormInput
            label="Contact Number"
            name="contactNumber"
            type="tel"
            placeholder="Enter 10-digit contact number"
            value={values.contactNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.contactNumber && errors.contactNumber ? errors.contactNumber : undefined}
          />
          
          <FormInput
            label="Email"
            name="email"
            type="email"
            placeholder="Enter email address"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && errors.email ? errors.email : undefined}
          />
          
          <FormInput
            label="Address"
            name="address"
            placeholder="Enter complete address"
            value={values.address}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.address && errors.address ? errors.address : undefined}
          />
        </>
      )}
    </ReusableForm>
  );
};

