import React from "react";
import { Card, Skeleton } from "@nextui-org/react";

export default function SmallHeightLoading() {

  return (
    <div className="flex flex-col gap-3 justify-center items-center mt-6">
      <Card className="w-[200px] md:w-[350px] space-y-5 p-4" radius="lg">
        <Skeleton className="rounded-lg">
          <div className="h-20 rounded-lg bg-secondary"></div>
        </Skeleton>
        <div className="space-y-3">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-3 w-full rounded-lg bg-secondary"></div>
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-3 w-full rounded-lg bg-secondary-300"></div>
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-3 w-full rounded-lg bg-secondary-200"></div>
          </Skeleton>
        </div>
      </Card>
    </div>
  );
}