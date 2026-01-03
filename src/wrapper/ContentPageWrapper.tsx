import "./Wrapper.css";
import type { ReactNode } from "react";

interface WrapperProps {
  title?: string; // optional, currently unused
  children: ReactNode;
}

const ContentPageWrapper = ({ children }: WrapperProps) => {
  return (
    <div className="dashboard">
      {/* <div className="title-container">
        <label className="title">{title}</label>
      </div> */}
      {children}
    </div>
  );
};

export default ContentPageWrapper;
