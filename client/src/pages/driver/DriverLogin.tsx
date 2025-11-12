// src/pages/DriverLogin.tsx
import { useEffect, useState } from "react";
import ReusableForm from "@/components/Form";
import FormInput from "@/components/Input";
import Alert from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";
import type { FormikHelpers }  from "formik";
import { DriverLoginSchema } from "@/validators/driver";
import { useDriverLogin } from "@/hooks/useDriverLogin";

const DriverLogin = () => {
  const initialValues = { mobile: "", password: "" };
  const [showPassword, setShowPassword] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);

  const { mutateAsync: login, isPending, error } = useDriverLogin();

  useEffect(() => {
    const storedMessage = localStorage.getItem('auth-blocked-message');
    if (storedMessage) {
      setBlockedMessage(storedMessage);
      localStorage.removeItem('auth-blocked-message');
    }
  }, []);

  const handleSubmit = async (
    values: typeof initialValues,
    helpers: FormikHelpers<typeof initialValues>
  ): Promise<void> => {
    try {
      await login(values);
      helpers.resetForm();
    } catch (error: any) {
      console.error("Driver login failed:", error);
      // Log the full error structure for debugging
      if (error?.response?.data) {
        console.log("Error response data:", error.response.data);
      }
      // Error is handled by the mutation and displayed below
    }
  };

  // Extract error message from the mutation error
  const getErrorMessage = () => {
    if (!error) return null;
    
    // NestJS default exception format: { statusCode: 401, message: "..." }
    // Check response data structure
    const responseData = error.response?.data;
    let errorMessage = '';
    
    if (responseData) {
      // NestJS default format: response.data.message
      if (responseData.message) {
        errorMessage = Array.isArray(responseData.message) 
          ? responseData.message[0] 
          : responseData.message;
      }
      // Alternative formats
      else if (responseData.error) {
        errorMessage = typeof responseData.error === 'string' 
          ? responseData.error 
          : responseData.error?.message || '';
      }
    }
    
    // Fallback to axios error message
    if (!errorMessage && error.message) {
      errorMessage = error.message;
    }
    
    // Check for blocked account message first (case-insensitive)
    if (errorMessage && (errorMessage.toLowerCase().includes('blocked') || 
                         errorMessage.toLowerCase().includes('contact the administrator'))) {
      return errorMessage;
    }
    
    // Handle different HTTP status codes
    if (error.response?.status === 401) {
      // If we have a specific error message, use it; otherwise use generic
      return errorMessage || "Invalid mobile number or password. Please check your credentials and try again.";
    }
    
    if (error.response?.status === 404) {
      return "Driver account not found. Please contact your administrator.";
    }
    
    if (error.response?.status >= 500) {
      return "Server error. Please try again later.";
    }
    
    // Return the extracted error message or a generic fallback
    return errorMessage || "Login failed. Please try again.";
  };

  const errorMessage = getErrorMessage();

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

        {/* Blocked account message */}
        {blockedMessage && (
          <Alert type="error" message={blockedMessage} />
        )}

        {/* Error Message */}
        {errorMessage && (
          <Alert type="error" message={errorMessage} />
        )}

        {/* Form */}
        <ReusableForm
          initialValues={initialValues}
          validationSchema={DriverLoginSchema}
          onSubmit={handleSubmit}
          submitButtonText={isPending ? "Logging in..." : "Login"}
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