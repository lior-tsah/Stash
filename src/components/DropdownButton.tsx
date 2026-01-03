import { useState, type JSX } from "react";
import { Menu, MenuItem } from "@mui/material";

export interface FilterButtonOption {
  name: string;
  onPress: (data?: any) => void;
  visible?: (data?: any) => boolean;
  disabled?: boolean;
}

export interface FilterButton {
  name: string;
  src: any;
  options: FilterButtonOption[];
  element?: JSX.Element;
}

interface DropdownButtonProps {
  btn: FilterButton;
  mainClassName?: string;
  titleClassName?: string;
  containerClassName?: string;
  anchorHeight?: boolean;
  data?: any; // Optional data to pass to the options
}

const DropdownButton = (props: DropdownButtonProps) => {
  const { btn, containerClassName = "", anchorHeight, data } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    // event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e: any) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const handlePressItem = (option: FilterButtonOption, e: any) => {
    option.onPress(data);
    handleClose(e);
  };

  return (
    <div key={btn.name} className={containerClassName}>
      {btn.element ? (
        <div onClick={handleClick}>{btn.element}</div>
      ) : (
        <img
          className="input-svg pointer"
          src={btn.src}
          alt="icon"
          onClick={handleClick}
        />
      )}

      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={anchorHeight ? { maxHeight: 400, overflow: "auto" } : {}}
      >
        {btn.options
          .filter((option) => (option.visible ? option.visible(data) : true))
          .map((option) => (
            <MenuItem
              key={option.name.toString()}
              disabled={option.disabled}
              onClick={(e) => handlePressItem(option, e)}
            >
              {option.name}
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
};

export default DropdownButton;
