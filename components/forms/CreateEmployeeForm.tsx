"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useEffect, useState } from "react";
import { CreateEmployeeFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setCredentials } from "@/redux/features/authSlice";
import { useDispatch } from "react-redux";

export enum FormFieldType {
  INPUT = "input",
  CHECKBOX = "checkbox",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

const CreateEmployeeForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 5000);
  }, [error]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof CreateEmployeeFormValidation>>({
    resolver: zodResolver(CreateEmployeeFormValidation),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof CreateEmployeeFormValidation>
  ) => {
    setIsLoading(true);

    const { email, password } = values;

    try {
      const userData = {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        createdAt: serverTimestamp(),
      };

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), userData);

      console.log("User created successfully!");

      dispatch(setCredentials(user));

      router.push(`/`);
      setIsLoading(false);
    } catch (error) {
      console.error(error);

      setError("An unknown error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <Form {...form}>
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Register a New Employee</p>
        </section>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 flex-1"
        >
          <div className="flex gap-4 ">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="firstName"
              label="First Name"
              placeholder="John"
              iconSrc="/assets/icons/user.svg"
              iconAlt="user"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="lastName"
              label="Last Name"
              placeholder="Doe"
              iconSrc="/assets/icons/user.svg"
              iconAlt="user"
            />
          </div>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="email"
            label="Email"
            placeholder="johndoe@sca.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.PHONE_INPUT}
            name="phone"
            label="Phone Number"
            placeholder="080 123 4567 890"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="password"
            label="Password"
            placeholder="***********"
            iconSrc="/assets/icons/key.svg"
            iconAlt="user"
          />
          <SubmitButton isLoading={isLoading}>Proceed</SubmitButton>
        </form>
      </Form>
    </div>
  );
};

export default CreateEmployeeForm;
