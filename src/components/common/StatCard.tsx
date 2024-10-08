import clsx from "clsx";

type StatCardProps = {
  type: "appointments" | "pending" | "cancelled";
  count: number | string;
  label: string;
  icon: string;
};

export const StatCard = ({ count = 0, label, icon, type }: StatCardProps) => {
  return (
    <div
      className={clsx("stat-card", {
        "bg-appointments": type === "appointments",
        "bg-pending": type === "pending",
        "bg-cancelled": type === "cancelled",
      })}
    >
      <div className="flex items-center bg-transparent gap-4">
        <img
          src={icon}
          height={32}
          width={32}
          alt="appointments"
          className="size-8 w-fit bg-transparent"
        />
        <h2
          className={`text-32-bold bg-transparent ${
            label === "Total Expenditure" ? "text-[#fb0000] " : "text-white"
          } `}
        >
          {count?.toLocaleString()}
        </h2>
      </div>

      <p className="text-14-regular bg-transparent">{label}</p>
    </div>
  );
};
