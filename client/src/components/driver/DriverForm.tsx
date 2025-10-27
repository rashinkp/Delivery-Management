// src/components/driver/DriverForm.tsx
"use client";

import * as Yup from "yup";
import ReusableForm from "../Form";
import FormInput from "../Input";
import type { CreateTruckDriverDto, UpdateTruckDriverDto } from "@/types/truckDriver";

type Props = {
  initialValues?: Partial<CreateTruckDriverDto>;
  onSubmit: (values: CreateTruckDriverDto | UpdateTruckDriverDto) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
};

export const DriverForm = ({ initialValues, onSubmit, onClose, isLoading = false }: Props) => {
  const isEdit = !!initialValues?.name;

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
      .required("Full name is required"),
    mobile: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Mobile number must start with 6-9 and be exactly 10 digits")
      .required("Mobile number is required"),
    address: Yup.string()
      .min(10, "Address must be at least 10 characters")
      .max(200, "Address must be less than 200 characters")
      .matches(/^[a-zA-Z0-9\s,.-]+$/, "Address contains invalid characters")
      .required("Address is required"),
    licenseNumber: Yup.string()
      .min(5, "License number must be at least 5 characters")
      .max(20, "License number must be less than 20 characters")
      .matches(/^[A-Z]{2}\d{2}\d{4}\d{7}$/, "License number must be in format: XX99-9999-9999999")
      .required("Driving license number is required"),
    password: isEdit 
      ? Yup.string()
          .optional()
          .test('password-validation', 'Password must be at least 8 characters and contain uppercase, lowercase, and number', function(value) {
            if (!value || value.trim() === '') return true; // Allow empty for updates
            return value.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value);
          })
      : Yup.string()
          .min(8, "Password must be at least 8 characters")
          .max(50, "Password must be less than 50 characters")
          .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number")
          .required("Password is required"),
    status: Yup.string()
      .oneOf(['active', 'inactive'], "Status must be either active or inactive")
      .optional(),
  });
  const defaults = {
    name: "",
    mobile: "",
    address: "",
    licenseNumber: "",
    password: "",
    status: "active" as "active" | "inactive",
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
          throw error; // Re-throw so parent can handle it
        } finally {
          setSubmitting(false);
        }
      }}
      submitButtonText={isLoading ? "Saving..." : (initialValues?.name ? "Update Driver" : "Create Driver")}
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <>
          <FormInput
            label="Full Name"
            name="name"
            placeholder="Enter full name (letters and spaces only)"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name && errors.name ? errors.name : undefined}
          />
          
          <FormInput
            label="Mobile Number"
            name="mobile"
            type="tel"
            placeholder="Enter 10-digit mobile number (starts with 6-9)"
            value={values.mobile}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.mobile && errors.mobile ? errors.mobile : undefined}
          />
          
          <FormInput
            label="Address"
            name="address"
            placeholder="Enter complete address (10-200 characters)"
            value={values.address}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.address && errors.address ? errors.address : undefined}
          />
          
          <FormInput
            label="Driving License"
            name="licenseNumber"
            placeholder="Enter license number (format: XX99-9999-9999999)"
            value={values.licenseNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.licenseNumber && errors.licenseNumber ? errors.licenseNumber : undefined}
          />
          
          <FormInput
            label={isEdit ? "New Password (optional)" : "Password"}
            name="password"
            type="password"
            placeholder={isEdit ? "Leave blank to keep current password" : "Enter password (min 8 chars, must contain uppercase, lowercase, and number)"}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && errors.password ? errors.password : undefined}
          />
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={values.status}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {touched.status && errors.status && (
              <p className="text-xs text-red-500 mt-1">{errors.status}</p>
            )}
          </div>
        </>
      )}
    </ReusableForm>
  );
};
