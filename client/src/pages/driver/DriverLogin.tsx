// src/pages/DriverLogin.tsx
import { useState } from "react";
import ReusableForm from "@/components/Form";
import FormInput from "@/components/Input";
import { Eye, EyeOff } from "lucide-react";
import type { FormikHelpers }  from "formik";
import { DriverLoginSchema } from "@/validators/driver";

const DriverLogin = () => {
  const initialValues = { mobile: "", password: "" };
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (
  values: typeof initialValues,
    helpers: FormikHelpers<typeof initialValues>
  ): Promise<void> => {
    try {
      console.log("Driver Login:", values);
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      helpers.resetForm();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Driver Login</h1>
          <p className="text-gray-500 text-sm">
            Use your registered mobile number to log in
          </p>
        </div>

        {/* Form */}
        <ReusableForm
          initialValues={initialValues}
          validationSchema={DriverLoginSchema}
          onSubmit={handleSubmit}
          submitButtonText="Login"
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
          }) => (
            <div className="space-y-5">
              {/* Mobile Number Field */}
              <FormInput
                label="Mobile Number"
                name="mobile"
                type="tel"
                placeholder="9876543210"
                value={values.mobile}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.mobile ? errors.mobile : undefined}
              />

              {/* Password Field with Eye Icon */}
              <div className="relative">
                <FormInput
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password ? errors.password : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          )}
        </ReusableForm>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          © 2025 Wholesale Delivery Management. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default DriverLogin;