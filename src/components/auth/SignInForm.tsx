/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

import axiosInstance from "../../utils/axios";
import { API_ROUTES } from "../../config/api";

type LoginFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export default function SignInForm() {
  const navigate = useNavigate();
  const { t } = useTranslation(['auth', 'common']);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true);

      const response = await axiosInstance.post(API_ROUTES.LOGIN, {
        email: data.email,
        password: data.password,
      });

      const { token, message } = response.data;

      // save token
      if (data.rememberMe == false) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      toast.success(message || "Login successful");
      // navigate("/");
      navigate("/", { replace: true });

    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || t('auth:loginError')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-6 text-center">
          <img
            className="mx-auto mb-4"
            src="/images/logo/logofull.png"
            alt="Logo"
            width={150}
            height={40}
          />
          <h1 className="mb-2 font-bold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            {t('auth:signIn')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('auth:enterEmailPassword')}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <Label>{t('auth:email')} *</Label>
            <Input
              placeholder={t('auth:emailPlaceholder')}
              {...register("email", {
                required: t('auth:emailRequired'),
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: t('auth:invalidEmail'),
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label>{t('auth:password')} *</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={t('auth:passwordPlaceholder')}
                {...register("password", {
                  required: t('auth:passwordRequired'),
                  minLength: {
                    value: 6,
                    message: t('auth:passwordMinLength'),
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
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3">
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <span className="text-sm text-gray-700 dark:text-gray-400">
                {t('auth:rememberMe')}
              </span>
            </label>

            <Link
              to="/reset-password"
              className="text-sm text-brand-500 hover:text-brand-600"
            >
              {t('auth:forgotPassword')}
            </Link>
          </div>

          <Button
            type="submit"   //  THIS IS REQUIRED
            className="w-full"
            size="sm"
            disabled={loading}
          >
            {loading ? t('auth:signingIn') : t('auth:signInButton')}
          </Button>
        </form>
      </div>
    </div>
  );
}
