import { Skeleton } from "@chakra-ui/react";

const TableLoader = () => {
  return (
    <div className="flex flex-col mt-8 space-y-3">
      <Skeleton className="h-9 bg-fade mb-3" />
      <div className="space-y-4">
        <Skeleton className="h-10 bg-fade " />
        <Skeleton className="h-10 bg-fade  " />
        <Skeleton className="h-10 bg-fade  " />
        <Skeleton className="h-10 bg-fade  " />
        <Skeleton className="h-10 bg-fade  " />
      </div>
    </div>
  );
};

export default TableLoader;
