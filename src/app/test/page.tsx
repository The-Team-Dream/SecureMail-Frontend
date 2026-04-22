"use client";
import { useGetUserData } from "@/APIs/hooks/useAuth";
import React from "react";

const User = () => {
  const { data, isLoading, isError } = useGetUserData();
    console.log(data);
  return (
    <div className="flex flex-wrap gap-10 p-10">
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error</p>}
      {data.map((user: any) => (
        <div key={user._id} className="flex flex-col gap-2">
          <h1 className="text-primary">{user.username}</h1>
          <h1 className="text-primary">{user.email}</h1>
        </div>
      ))}
    </div>
  );
};

export default User;
