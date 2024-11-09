import React, { HTMLAttributes } from "react";

import { Header } from "./Components/Header";
import { Footer } from "./Components/Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const options: HTMLAttributes<HTMLDivElement> = {
    style: {
      height: "100%",
      display: "flex",
      flexDirection: "column"
    },
  };
  return (
    <div {...options}>
      <Header />
      {children}
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
