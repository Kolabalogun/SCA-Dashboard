/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import showToast from "@/components/common/toast";
import { db } from "@/config/firebase";
import { AccessRole } from "@/types/types";
import { formatDate } from "@/utils/formatJSDate";
import { Skeleton, useToast } from "@chakra-ui/react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Activities = () => {
  const toast = useToast();
  const { user } = useSelector((state: any) => state.auth);
  const [activities, setActivities] = useState<any[]>();

  const [loading, setIsLoading] = useState<boolean>(false);

  async function fetchActivities() {
    const activitiesRef = collection(db, "activites");
    setIsLoading(true);

    try {
      let q;

      if (
        user?.accessRole === AccessRole.Admin ||
        user?.accessRole === AccessRole.Viewer
      ) {
        q = query(activitiesRef, orderBy("createdAt", "desc"), limit(10));
      } else {
        q = query(
          activitiesRef,
          orderBy("createdAt", "desc"),
          where("activtyCarriedOutEmailBy", "==", user.email),
          limit(10)
        );
      }

      const querySnapshot = await getDocs(q);
      const activities = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setActivities(activities);
    } catch (error) {
      console.error("Error fetching staffs:", error);
      setActivities([]);
      showToast(toast, "SCA", "error", "Error fetching activitiess");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <section className="flex space-y-3 flex-col w-full">
      <h1 className="subheader">Recent Activites</h1>
      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-20 bg-fade " />
          <Skeleton className="h-20 bg-fade  " />
          <Skeleton className="h-20 bg-fade  " />
          <Skeleton className="h-20 bg-fade  " />
          <Skeleton className="h-20 bg-fade  " />
        </div>
      ) : (
        <div className="space-y-6">
          {activities?.map((activity) => (
            <div key={activity?.id} className={` bb space-y-3 `}>
              <div className={`flex justify-between items-center`}>
                <p
                  className={`text-14-medium ${
                    activity?.type === "Patient Admission"
                      ? "text-[#16dcfa] "
                      : activity?.type === "Profile Update"
                      ? "text-[#f5d23e] "
                      : activity?.type === "Expenses"
                      ? "text-[#fa1228] "
                      : "text-[#2fd163]"
                  }  `}
                >
                  {activity?.type}{" "}
                </p>

                <p className="text-14-medium text-dark-700">
                  {formatDate(activity?.formDate)}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <p>{activity?.title}</p>
                <p className="text-xs">{activity?.desc}</p>
              </div>
              <div className="flex items-center gap-1">
                <p className="text-xs">Activity carried out by:</p>
                <p className="text-xs">{activity?.activtyCarriedOutBy}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Activities;
