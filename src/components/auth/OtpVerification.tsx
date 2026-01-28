import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../components/ui/button/Button";
import { validateOtpApi } from "../../api/authApi";

type OtpFormValues = {
  otp: string[];
};

const OtpVerification = () => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();
  const { state } = useLocation();

  //  adminId passed from ChangePassword page
  const adminId = state?.adminId;

  const {
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm<OtpFormValues>({
    defaultValues: {
      otp: ["", "", "", "", "", ""],
    },
  });

  const otpValues = watch("otp");

  const onSubmit = async (data: OtpFormValues) => {
    const otp = data.otp.join("");

    if (!adminId) {
      toast.error("Session expired. Please resend OTP.");
      navigate("/reset-password");
      return;
    }

    try {
      await validateOtpApi({ adminId, otp });

      sessionStorage.setItem("resetAdminId", adminId);

      toast.success("OTP verified");

      navigate("/change-password", { replace: true });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Invalid OTP");
    }
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    setValue(`otp.${index}`, value, { shouldValidate: true });

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md text-center">


        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 bg-white rounded-lg shadow-theme-xs dark:bg-gray-900"
        ><h1 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">
            OTP Verification
          </h1>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Enter the 6-digit code sent to your email
          </p>
          {/* Hidden register for RHF validation */}
          <input
            type="hidden"
            {...register("otp", {
              validate: (v) => v.join("").length === 6 || "Invalid OTP",
            })}
          />

          {/* OTP Inputs */}
          <div className="flex justify-between gap-2 mb-4">
            {otpValues.map((_, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                maxLength={1}
                value={otpValues[index]}
                onChange={(e) => handleChange(e.target.value, index)}
                inputMode="numeric"
                className={`h-12 w-12 rounded-lg border text-center text-lg font-semibold focus:outline-none focus:ring-2
                  ${errors.otp
                    ? "border-error-500 focus:ring-error-500/20"
                    : "border-gray-300 focus:ring-brand-500/20 dark:border-gray-700"
                  }
                `}
              />
            ))}
          </div>

          {errors.otp && (
            <p className="mb-4 text-sm text-error-500">{errors.otp.message}</p>
          )}

          <Button type="submit" className="w-full">
            Verify OTP
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
