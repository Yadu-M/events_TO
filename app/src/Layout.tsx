import { Header } from "./Header/Header";
// import { Footer } from "./Components/Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <Header />
      {children}
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
