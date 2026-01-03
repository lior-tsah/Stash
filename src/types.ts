import type { JSX } from "react";

export interface Column {
  options?: Option[];
  field: string;
  headerName: string;
  type?:
    | "text"
    | "status"
    | "statusNode"
    | "statusButton"
    | "titleWithicon"
    | "option"
    | "button"
    | "iconFile"
    | "password"
    | "checkbox";

  action?: {
    src: string | JSX.Element;
    isActive?: boolean;
    onPress: (data: any) => void;
  };
  buttons?: any[];
  canActive?: boolean;
  statusMap?: Map<string, string>;
}
export interface Option {
  label: string;
  value: string;
}
