import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { EyeIcon, EyeCloseIcon } from "../../icons";
import { resetPasswordApi } from "../../api/authApi";

type NewPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

const NewPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { state } = useLocation();

  //  adminId from OTP page or session (refresh-safe)
  const adminId =
    state?.adminId || sessionStorage.getItem("resetAdminId");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NewPasswordFormValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async (data: NewPasswordFormValues) => {
    if (!adminId) {
      toast.error("Invalid session. Please try again.");
      navigate("/forgot-password");
      return;
    }

    try {
      await resetPasswordApi({
        adminId, //  BACKEND EXPECTS THIS
        newPassword: data.password,
        confirmPassword: data.confirmPassword,
      });

      // cleanup
      sessionStorage.removeItem("resetAdminId");

      toast.success("Password updated successfully");
      navigate("/signin", { replace: true });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update password"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">
            Set New Password
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create a strong password for your account
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-6 bg-white rounded-lg shadow-theme-xs dark:bg-gray-900"
        >
          {/* New Password */}
          <div>
            <Label>
              New Password <span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                error={!!errors.password}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Minimum 8 characters required",
                  },
                })}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword ? (
                  <EyeIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                ) : (
                  <EyeCloseIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                )}
              </span>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-error-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label>
              Confirm Password <span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                error={!!errors.confirmPassword}
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === passwordValue || "Passwords do not match",
                })}
              />
              <span
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showConfirmPassword ? (
                  <EyeIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                ) : (
                  <EyeCloseIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                )}
              </span>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-error-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full">
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
