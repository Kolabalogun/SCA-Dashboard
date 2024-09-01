/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Doctors } from "@/constants";

import { formatDateTime } from "@/utils/formatDateTime";
import { useNavigate } from "react-router-dom";

export const columns = [
  {
    header: "#",
    cell: ({ row }: { row: any }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }: { row: any }) => {
      const appointment = row.original;
      return <p className="text-14-medium capitalize ">{appointment?.name}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Room",
    cell: ({ row }: { row: any }) => {
      const appointment = row.original;
      return <p className="text-14-medium capitalize ">{appointment?.room}</p>;
    },
  },
  {
    accessorKey: "schedule",
    header: "Date Admitted",
    cell: ({ row }: { row: any }) => {
      const appointment = row.original;
      return (
        <p className="text-14-regular min-w-[100px]">
          {formatDateTime(appointment?.createdAt)}
        </p>
      );
    },
  },
  {
    accessorKey: "primaryPhysician",
    header: "Primary Physician",
    cell: ({ row }: { row: any }) => {
      const appointment = row.original;

      const doctor = Doctors.find(
        (doctor) => doctor.name === appointment?.primaryPhysician
      );

      return (
        <div className="flex items-center gap-3">
          <img
            src={doctor?.image}
            alt="doctor"
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }: { row: any }) => <ActionsCell appointment={row.original} />,
  },
];

// Create a new component to handle the actions with the useRouter hook
function ActionsCell({ appointment }: { appointment: any }) {
  const navigate = useNavigate();

  console.log(appointment);
  return (
    <button
      onClick={() => navigate(`/dashboard/patient/${appointment?.id}`)}
      className="cursor-pointer"
    >
      <p className="text-14-medium text-green-500">View Profile</p>
    </button>
  );
}
