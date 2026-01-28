import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { LockIcon } from "../../icons";
import { forgotPasswordApi } from "../../api/authApi";

type ChangePasswordFormValues = {
  email: string;
};

const ChangePassword = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      const response = await forgotPasswordApi(data.email);

      const adminId = response.data?.adminId; //  IMPORTANT

      toast.success(response.data?.message || "OTP sent");

      navigate("/otp-verification", {
        replace: true,
        state: { adminId },
      });
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
      };

      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-10 space-y-6 bg-white rounded-lg shadow-theme-xs dark:bg-gray-900">
        <div className="mb-6 text-center">
          <LockIcon className="w-10 h-10 mx-auto text-brand-500 mb-3" />
          <h1 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">
            Change Password
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your registered email to receive password reset instructions
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="mb-5">
            <Label>
              Email <span className="text-error-500">*</span>
            </Label>
            <Input
              type="email"
              placeholder="info@gmail.com"
              error={!!errors.email}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-error-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full">
            Send OTP
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
