/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useLayoutEffect, useRef, type JSX } from "react";
import SideBar from "./SideBar";
import "./Wrapper.css";
import TopBar from "./TopBar";


interface WrapperProps {
  children: JSX.Element;
  title: string;
}

const WrapperPage = ({ children, title }: WrapperProps) => {
  const wrapperRef = useRef<any>(null);

  useEffect(() => {
    const handleAnimationEnd = () => {
      if (wrapperRef.current) {
        wrapperRef.current.classList.remove("page-enter");
      }
    };

    if (wrapperRef.current) {
      wrapperRef.current.classList.add("page-enter");
      wrapperRef.current.addEventListener("animationend", handleAnimationEnd);
    }

    return () => {
      if (wrapperRef.current) {
        wrapperRef.current.removeEventListener(
          "animationend",
          handleAnimationEnd
        );
      }
    };
  }, [window.location.pathname]);
    

  return (
    <div className="wrapper-container">
      {/* <SideBar /> */}
      <div className="page-top-container">
        <TopBar title={title} />
        <div className="page" ref={wrapperRef}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default WrapperPage;
