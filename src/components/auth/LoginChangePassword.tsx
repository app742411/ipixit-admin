import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { EyeIcon, EyeCloseIcon } from "../../icons";
import { changePasswordApi } from "../../api/authApi";

type ChangePasswordFormValues = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

const LoginChangePassword = () => {
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ChangePasswordFormValues>({
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const newPasswordValue = watch("newPassword");

    const onSubmit = async (data: ChangePasswordFormValues) => {
        try {
            await changePasswordApi({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            });

            toast.success("Password changed successfully. Please login again.");

            //  CLEAR AUTH DATA
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            localStorage.removeItem("user");

            //  REDIRECT TO LOGIN
            navigate("/signin", { replace: true });
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Failed to change password"
            );
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <div className="w-full max-w-md">
                <div className="mb-6 text-center">
                    <h1 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">
                        Change Password
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Update your account password
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-6 space-y-6 bg-white rounded-lg shadow-theme-xs dark:bg-gray-900"
                >
                    {/* Current Password */}
                    <div>
                        <Label>
                            Current Password <span className="text-error-500">*</span>
                        </Label>
                        <div className="relative">
                            <Input
                                type={showOld ? "text" : "password"}
                                placeholder="Enter current password"
                                error={!!errors.oldPassword}
                                {...register("oldPassword", {
                                    required: "Current password is required",
                                })}
                            />
                            <span
                                onClick={() => setShowOld(!showOld)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                            >
                                {showOld ? (
                                    <EyeIcon className="size-5 fill-gray-500" />
                                ) : (
                                    <EyeCloseIcon className="size-5 fill-gray-500" />
                                )}
                            </span>
                        </div>
                        {errors.oldPassword && (
                            <p className="mt-1 text-xs text-error-500">
                                {errors.oldPassword.message}
                            </p>
                        )}
                    </div>

                    {/* New Password */}
                    <div>
                        <Label>
                            New Password <span className="text-error-500">*</span>
                        </Label>
                        <div className="relative">
                            <Input
                                type={showNew ? "text" : "password"}
                                placeholder="Enter new password"
                                error={!!errors.newPassword}
                                {...register("newPassword", {
                                    required: "New password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Minimum 8 characters required",
                                    },
                                })}
                            />
                            <span
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                            >
                                {showNew ? (
                                    <EyeIcon className="size-5 fill-gray-500" />
                                ) : (
                                    <EyeCloseIcon className="size-5 fill-gray-500" />
                                )}
                            </span>
                        </div>
                        {errors.newPassword && (
                            <p className="mt-1 text-xs text-error-500">
                                {errors.newPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <Label>
                            Confirm New Password <span className="text-error-500">*</span>
                        </Label>
                        <div className="relative">
                            <Input
                                type={showConfirm ? "text" : "password"}
                                placeholder="Confirm new password"
                                error={!!errors.confirmPassword}
                                {...register("confirmPassword", {
                                    required: "Confirm password is required",
                                    validate: (value) =>
                                        value === newPasswordValue || "Passwords do not match",
                                })}
                            />
                            <span
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                            >
                                {showConfirm ? (
                                    <EyeIcon className="size-5 fill-gray-500" />
                                ) : (
                                    <EyeCloseIcon className="size-5 fill-gray-500" />
                                )}
                            </span>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-xs text-error-500">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <Button type="submit" className="w-full">
                        Update Password
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default LoginChangePassword;
