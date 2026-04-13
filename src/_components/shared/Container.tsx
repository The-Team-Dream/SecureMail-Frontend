import React from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="mx-6 my-8">{children}</div>;
};

export default Container;
