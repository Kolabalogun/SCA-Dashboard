import { PatientForm } from "@/components/forms/PatientForm";
import AuthLayout from "@/layout/authLayout";

const PatientRegistration = () => {
  return (
    <AuthLayout>
      <PatientForm />
    </AuthLayout>
  );
};

export default PatientRegistration;
