import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client.ts";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate, useParams } from "react-router-dom";

export type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
  userId:string;
  token:string;
};

const ResetPassword = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {userId,token} =useParams()
  const { showToast } = useAppContext();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();

  const mutation = useMutation(apiClient.resetPassword, {
    onSuccess: async () => {
      showToast({ message: "Reset Password Success!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate("/sign-in");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    data.token=token||"";
    data.userId=userId||"";
    mutation.mutate(data);
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <form className="w-full max-w-sm" onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
            <input
              type="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register("password", {
                required: "This field is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            ></input>
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
          </label>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Confirm Password
            <input
              type="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register("confirmPassword", {
                validate: (val) => {
                  if (!val) {
                    return "This field is required";
                  } else if (watch("password") !== val) {
                    return "Your passwords do no match";
                  }
                },
              })}
            ></input>
            {errors.confirmPassword && (
              <span className="text-red-500">{errors.confirmPassword.message}</span>
            )}
          </label>
        </div>
        <span>
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 w-full"
          >
            Reset Password
          </button>
        </span>
      </form>
    </div>
  );
};

export default ResetPassword;