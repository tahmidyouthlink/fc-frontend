import { sendPasswordResetEmail } from "firebase/auth";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { auth } from "@/firebase.config";
import { useLoading } from "@/app/contexts/loading";
import createErrorMessage from "@/app/utils/createErrorMessage";

export default function ForgotPasswordForm({ setIsAuthModalOpen }) {
  const { setIsPageLoading } = useLoading();
  const {
    register: registerForForgotPassword,
    handleSubmit: handleSubmitForForgotPassword,
    reset: resetForForgotPassword,
    formState: { errors: errorsForForgotPassword },
  } = useForm({
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  // Function that handles form submission (user sign in)
  const onSubmit = async (data) => {
    setIsPageLoading(true);

    try {
      await sendPasswordResetEmail(auth, data.email);
      resetForForgotPassword(); // Reset form
      toast.success("Email with password reset link sent.");
      setIsAuthModalOpen(false);
    } catch (error) {
      toast.error(createErrorMessage(error));
    }

    setIsPageLoading(false);
  };

  // Function that handles form submission error (displays error messages)
  const onError = (errors) => {
    const errorTypes = Object.values(errors).map((error) => error.type);

    if (errorTypes.includes("required"))
      toast.error("Please enter your email address.");
    else if (errorTypes.includes("pattern"))
      toast.error("Please provide email address.");
    else toast.error("Something went wrong. Please try again.");
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmitForForgotPassword(onSubmit, onError)}
      className="space-y-3"
    >
      {/* Email Input Field */}
      <div className="w-full space-y-2 font-semibold">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="john.doe@gmail.com"
          autoComplete="email"
          {...registerForForgotPassword("email", {
            pattern: {
              value:
                /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/,
              message: "Email is not valid.",
            },
            required: {
              value: true,
              message: "Email is required.",
            },
          })}
          className="h-11 w-full rounded-lg border-2 border-[#ededed] px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white md:text-[13px]"
          required
        />
        {/* Email Error Message */}
        {errorsForForgotPassword.email && (
          <p className="text-xs font-semibold text-red-500">
            {errorsForForgotPassword.email?.message}
          </p>
        )}
      </div>
      {/* Reset Password Button */}
      <button
        type="submit"
        className="!mt-7 w-full rounded-lg bg-[#d4ffce] py-3 text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[#bdf6b4] md:text-sm"
      >
        Send Email
      </button>
    </form>
  );
}
