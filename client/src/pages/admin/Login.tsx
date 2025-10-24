import { useState } from "react";
import ReusableForm from "@/components/Form";
import FormInput from "@/components/Input";
import { Eye, EyeOff } from "lucide-react";
import type { FormikHelpers } from "formik";
import { LoginSchema } from "@/validators/admin";

const AdminLogin = () => {
  const initialValues = { email: "", password: "" };
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (
    values: typeof initialValues,
    helpers: FormikHelpers<typeof initialValues>
  ): Promise<void> => {
    try {
      console.log(values);
      await new Promise<void>((resolve) => setTimeout(resolve, 2000));
      helpers.resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-500 text-sm">
            Enter your credentials to access the dashboard
          </p>
        </div>

        {/* Form */}
        <ReusableForm
          initialValues={initialValues}
          validationSchema={LoginSchema}
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
              {/* Email Field */}
              <FormInput
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email ? errors.email : undefined}
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

export default AdminLogin;
