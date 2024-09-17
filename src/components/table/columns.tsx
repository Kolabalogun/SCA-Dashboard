/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { formatDateTime } from "@/utils/formatDateTime";
import { useNavigate } from "react-router-dom";

export const columns = [
  {
    header: "#",
    cell: ({ row }: { row: any }) => {
      return <p className="text-14-medium py-2 ">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }: { row: any }) => {
      const appointment = row.original;
      return <p className="text-14-medium uppercase ">{appointment?.name}</p>;
    },
  },
  {
    accessorKey: "patientStatus",
    header: "Status",
    cell: ({ row }: { row: any }) => {
      const appointment = row.original;
      return (
        <p className="text-14-medium capitalize ">
          {appointment?.patientStatus}
        </p>
      );
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

      return (
        <div className="flex items-center gap-3">
          <p className="whitespace-nowrap">
            Dr. {appointment?.primaryPhysician}
          </p>
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

  return (
    <button
      onClick={() => navigate(`/dashboard/patient/${appointment?.id}`)}
      className="cursor-pointer"
    >
      <p className="text-14-medium text-green-500">View Profile</p>
    </button>
  );
}

export const staffsColumns = [
  {
    header: "#",
    cell: ({ row }: { row: any }) => {
      return <p className="text-14-medium py-2 ">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: ({ row }: { row: any }) => {
      const appointment = row.original;
      return (
        <p className="text-14-medium capitalize ">{appointment?.firstName}</p>
      );
    },
  },

  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: ({ row }: { row: any }) => {
      const appointment = row.original;
      return (
        <p className="text-14-medium capitalize ">{appointment?.lastName}</p>
      );
    },
  },

  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }: { row: any }) => {
      const appointment = row.original;
      return (
        <p className="text-14-medium cursor-pointer lowercase ">
          <a href={`mailto:${appointment?.email}`}> {appointment?.email}</a>
        </p>
      );
    },
  },

  {
    accessorKey: "occupation",
    header: "Occupation",
    cell: ({ row }: { row: any }) => {
      const appointment = row.original;
      return (
        <p className="text-14-regular capitalize ">{appointment?.occupation}</p>
      );
    },
  },

  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }: { row: any }) => (
      <StaffActionsCell appointment={row.original} />
    ),
  },
];

function StaffActionsCell({ appointment }: { appointment: any }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/dashboard/staff/${appointment?.id}`)}
      className="cursor-pointer"
    >
      <p className="text-14-medium text-green-500">View Profile</p>
    </button>
  );
}

export const revenueColumns = [
  {
    header: "#",
    cell: ({ row }: { row: any }) => {
      return <p className="text-14-medium py-2 ">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }: { row: any }) => {
      const appointment = row.original;
      return <p className="text-14-medium capitalize ">{appointment?.type}</p>;
    },
  },

  {
    accessorKey: "Date Issued",
    header: "Date Issued",
    cell: ({ row }: { row: any }) => {
      const appointment = row.original;
      return (
        <p className="text-14-medium capitalize ">
          {formatDateTime(appointment?.createdAt)}
        </p>
      );
    },
  },

  {
    accessorKey: "from",
    header: "From",
    cell: ({ row }: { row: any }) => {
      const appointment = row.original;
      return (
        <p className="text-14-regular uppercase ">{appointment?.patient}</p>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }: { row: any }) => {
      const appointment = row.original;
      return (
        <p
          className={` font-bold ${
            appointment?.id.includes("expenses")
              ? "text-red-500"
              : "text-green-700 "
          }`}
        >
          ₦{appointment?.amount}
        </p>
      );
    },
  },

  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }: { row: any }) => (
      <RevenueActionsCell appointment={row.original} />
    ),
  },
];

function RevenueActionsCell({ appointment }: { appointment: any }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() =>
        navigate(
          `/dashboard/${
            appointment?.id.includes("expenses") ? "expense" : "revenue"
          }/${appointment?.id}`
        )
      }
      className="cursor-pointer"
    >
      <p className="text-14-medium text-green-500">View Details</p>
    </button>
  );
}
