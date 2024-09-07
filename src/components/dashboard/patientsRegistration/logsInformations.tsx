/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { formatDate } from "@/utils/formatJSDate";
import { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<any>;
};

const LogsInformations = ({ form }: Props) => {
  const { logs } = form.getValues();

  return (
    <div className="space-y-9">
      <section className="space-y-6">
        {logs && logs.length > 0 && (
          <section className="space-y-6">
            <h3 className="sub-header">Logs Information</h3>
            <ul className="space-y-4   ">
              {logs?.map((log: any) => (
                <li
                  key={log?.id}
                  className="space-y-4 flex flex-col border border-[#363a3d] rounded-lg p-4"
                >
                  <div className=" ">
                    <p className="text-sm">
                      Date: {formatDate(log?.updatedAt) || "N/A"}{" "}
                    </p>
                  </div>

                  <div className="  items-center flex gap-2">
                    <p className="text-xs">Patient Information Updated By: </p>
                    <p className="text-[14px]">{log?.updatedBy} </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </section>
    </div>
  );
};

export default LogsInformations;
