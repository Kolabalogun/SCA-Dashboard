"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Doctors } from "@/constants";
import { Appointment } from "@/types/appwrite.types";
import { formatDateTime } from "@/utils/formatDateTime";

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const appointment = row.original;
      return <p className="text-14-medium capitalize ">{appointment?.name}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Room",
    cell: ({ row }) => {
      const appointment = row.original;
      return <p className="text-14-medium capitalize ">{appointment?.room}</p>;
    },
  },
  {
    accessorKey: "schedule",
    header: "Date Admitted",
    cell: ({ row }) => {
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
    cell: ({ row }) => {
      const appointment = row.original;

      const doctor = Doctors.find(
        (doctor) => doctor.name === appointment?.primaryPhysician
      );

      return (
        <div className="flex items-center gap-3">
          <Image
            src={doctor?.image!}
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
    cell: ({ row }) => <ActionsCell appointment={row.original} />,
  },
];

// Create a new component to handle the actions with the useRouter hook
function ActionsCell({ appointment }: { appointment: Appointment }) {
  const router = useRouter();

  return (
    <button
      onClick={() =>
        router.push(`/admin/dashboard/patients/${appointment?.userId}`)
      }
      className="cursor-pointer"
    >
      <p className="text-14-medium text-green-500">View Profile</p>
    </button>
  );
}
