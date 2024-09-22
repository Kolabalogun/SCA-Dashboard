import { Loader } from "@/assets/icons";
import { Button } from "../ui/button";

interface ButtonProps {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
  type?: "button" | "reset" | "submit";
}

const SubmitButton = ({
  type,
  isLoading,
  className,
  children,
}: ButtonProps) => {
  return (
    <Button
      type={type ?? "submit"}
      disabled={isLoading}
      className={className ?? "shad-primary-btn w-full"}
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <img
            src={Loader}
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />
          Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
