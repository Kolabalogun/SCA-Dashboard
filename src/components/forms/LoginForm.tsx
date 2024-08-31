import { auth } from "@/config/firebase";
import { LoginFormValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Form } from "../ui/form";
import { useDispatch } from "react-redux";
import { setCredentials, setIsAuthenticated } from "@/redux/features/authSlice";
import CustomFormField from "../common/CustomFormField";
import { FormFieldType } from "@/types/types";
import SubmitButton from "../common/SubmitButton";
import { email, Key } from "@/assets/icons";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Define your form.
  const form = useForm<z.infer<typeof LoginFormValidation>>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof LoginFormValidation>) {
    console.log(values);

    const { email, password } = values;

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      dispatch(setCredentials(user));
      dispatch(setIsAuthenticated(true));

      console.log("User  logged in successfully!");
      setIsLoading(false);
      navigate(`/dashboard`);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <div className="">
      <Form {...form}>
        <section className="mb-12 space-y-4">
          <h1 className="header">Welcome Back 👋</h1>
          <p className="text-dark-700">Enter your company email and password</p>
        </section>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 flex-1"
        >
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="email"
            label="Email"
            placeholder="johndoe@sca.com"
            iconSrc={email}
            iconAlt="email"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="password"
            label="Password"
            placeholder="***********"
            iconSrc={Key}
            iconAlt="user"
          />

          <SubmitButton isLoading={isLoading}>Sign In</SubmitButton>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
