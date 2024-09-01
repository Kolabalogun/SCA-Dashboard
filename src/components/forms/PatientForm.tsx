/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormMessage } from "@/components/ui/form";
import { UserFormValidation } from "@/lib/validation";
import "react-phone-number-input/style.css";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useSelector } from "react-redux";
import CustomFormField from "../common/CustomFormField";
import { FormFieldType } from "@/types/types";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../common/SubmitButton";
import { email, User } from "@/assets/icons";

export const PatientForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 5000);
  }, [error]);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);
    try {
      const { name, email, phone } = values;

      // Check if a document with the same email already exists
      const q = query(collection(db, "patients"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return setError("A patient with this email already exists.");
      }

      // Add the new document
      const docRef = await addDoc(collection(db, "patients"), {
        name,
        email,
        phone,
        createdAt: new Date(),
        registeredBy: `${user?.firstName} ${user?.lastName}`,
      });

      if (docRef.id) {
        navigate(`/patients/${docRef.id}`);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding document: ", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">
            Get started with Patient's Registration.
          </p>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          placeholder="John Doe"
          iconSrc={User}
          iconAlt="user"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="johndoe@gmail.com"
          iconSrc={email}
          iconAlt="email"
        />

        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone number"
          placeholder="(555) 123-4567"
        />

        {error && (
          <FormMessage className="shad-error text-xs">{error}</FormMessage>
        )}

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};
