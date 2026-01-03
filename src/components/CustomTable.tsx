import React, { useEffect, useState } from "react";
import FileIcon from "../assets/file.svg";
import ThreeDots from "../assets/three-dots.svg";

import {
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  useMaterialReactTable,
  MRT_TablePagination,
  MRT_ShowHideColumnsButton,
  type MRT_Row,
} from "material-react-table";
import type { Column } from "../types";
import DropdownButton from "./DropdownButton";

interface CustomTableProps {
  data: any[]; // Data to be displayed in the table
  initColumns: Column[];
  icon?: string;
  hidePagination?: boolean; // Optional prop to hide pagination
  hideTitleHeaders?: boolean; // Optional prop to hide header
  onRowClick?: (rowData: any) => void; // Optional callback for row click
  onRowDoubleClick?: (rowData: any) => void; // Optional callback for row double click
}

const CustomTable: React.FC<CustomTableProps> = ({
  data = [],
  initColumns,
  icon,
  hidePagination = false, // Default to false if not provided
  hideTitleHeaders = false, // Default to false if not provided
  onRowClick, // Remove default function
  onRowDoubleClick, // Remove default function
}) => {
  const [dataTable, setDataTable] = useState<any[]>(data || []); // Initialize with dataTable prop
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setDataTable(data);
  }, [data]);

  const getStatusOpen = (data: string) => {
    let res = "High";
    if (data === "closed" || data === "completed") res = "Low";
    if (data === "in progress") res = "Inactive";

    return res;
  };

  const renderCell = (row: any, col: Column) => {
    switch (col.type) {
      case "status": {
        const status = col.statusMap?.get(row[col.field]) || "High";
        return (
          <div className={`status-table-container ${status.toLowerCase()}`}>
            <label className={`status-table ${status.toLowerCase()}-title`}>
              {row[col.field] || "N/A"}
            </label>
          </div>
        );
      }
      // case "statusButton": {
      //   const status = getStatusOpen(row[col.field]);
      //   const btn = {
      //     name: "",
      //     src: "",
      //     options: col.options || [],
      //     element: (
      //       <div
      //         className={`status-table-container ${status.toLowerCase()} pointer`}
      //       >
      //         <label
      //           className={`status-table ${status.toLowerCase()}-title pointer`}
      //         >
      //           {row[col.field]}
      //         </label>
      //       </div>
      //     ),
      //   };
      //   return (
      //     <div style={{ display: "flex", justifyContent: "flex-end" }}>
      //       <DropdownButton btn={btn} data={row.rowData} />
      //     </div>
      //   );
      // }
      case "statusNode": {
        const status = col.statusMap?.get(row[col.field]) || "High";
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexDirection: "row",
            }}
          >
            <div className={`status-table-container ${status.toLowerCase()}`}>
              <label className={`status-table ${status.toLowerCase()}-title`}>
                {row[col.field]}
              </label>
            </div>
            {(status === "Medium" || status === "Inactive") && (
              <CircularProgress size={20} />
            )}
          </div>
        );
      }
      case "titleWithicon": {
        return (
          <div className="icon-cell-container">
            <img src={row.rowIcon ? row.rowIcon : icon} />
            <label>{row[col.field]}</label>
          </div>
        );
      }
      case "checkbox": {
        return (
          <input
            style={{
              display: "flex",
              alignSelf: "center",
              justifyContent: "flex-end",
              width: "fit-content",
            }}
            type="checkbox"
            checked={row[col.field]}
            onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling
            }}
          />
        );
      }
      case "option": {
        const btn = {
          name: "",
          src: ThreeDots,
          options: row.options || [],
        };
        return (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <DropdownButton btn={btn} />
          </div>
        );
      }
      case "button": {
        return (
          <IconButton
            color="primary"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling
              row.isActive = true;
              if (col.action && col.canActive) {
                col.action.isActive = true;
              }
              setDataTable([...data]);
              col?.action ? col.action.onPress(row.rowData) : undefined;
              setTimeout(() => {
                row.isActive = false;
                if (col.action) {
                  col.action.isActive = false;
                }
                setDataTable([...data]);
              }, 3000);
            }}
          >
            {typeof col.action?.src === "string" ? (
              <img
                className={
                  !!(row.isActive && col?.action?.isActive)
                    ? "active-rotate"
                    : ""
                }
                src={col.action?.src}
                alt=""
                style={{
                  display: "flex",
                  width: "20px",
                  height: "24px",
                  cursor: "pointer",
                  justifyContent: "flex-end",
                }}
              />
            ) : (
              col.action?.src
            )}
          </IconButton>
        );
      }

      case "iconFile": {
        return (
          <img
            src={row[col.field] || FileIcon}
            alt=""
            style={{
              display: "flex",
              width: "24px",
              height: "24px",
              justifyContent: "flex-end",
            }}
          />
        );
      }
      // case "password": {
      //   return <PasswordInput defaultValue={row[col.field]} />;
      // }
      default: {
        const text = row[col.field]?.toString() || "";
        const words = text.split(" ");

        if (words.length <= 12) {
          // If 12 words or less, show all text (max 2 lines)
          const lines = [];
          for (let i = 0; i < words.length; i += 4) {
            lines.push(words.slice(i, i + 4).join(" "));
          }

          return (
            <div style={{ whiteSpace: "pre-line" }}>
              {lines.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          );
        }

        // If more than 12 words, show first 2 lines with "..." and make it clickable
        const firstTwoLines = [
          words.slice(0, 4).join(" "),
          words.slice(4, 8).join(" "),
        ];

        const handleClick = (event: React.MouseEvent<HTMLElement>) => {
          event.stopPropagation();
          setAnchorEl(event.currentTarget);
        };

        const handleClose = (e: any) => {
          e.stopPropagation();
          setAnchorEl(null);
        };

        return (
          <>
            <div
              style={{
                whiteSpace: "pre-line",
                cursor: "pointer",
                color: "#555555",
                // textDecoration: "underline"
              }}
              onClick={handleClick}
            >
              {firstTwoLines.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
              <div>...</div>
            </div>
            {/* <KadabraPopover
              anchorEl={anchorEl}
              handleClose={handleClose}
              title=""
            >
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  maxHeight: "300px",
                  overflowY: "auto",
                  padding: "8px 0",
                }}
              >
                {text}
              </div>
            </KadabraPopover> */}
          </>
        );
      }
    }
  };

  const columns: MRT_ColumnDef<any>[] = initColumns.map((item, index) => {
    return {
      accessorKey: item.field || item.headerName,
      header: item.headerName,
      id: (item.field || item.headerName)?.toString() || `id ${index}`,
      size: 50,
      enableColumnFilter: true,

      Header: () => (
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Typography sx={{ fontWeight: 600 }}>{item.headerName}</Typography>
        </Box>
      ),
      Cell: ({ row }: any) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {renderCell(row.original, item)}
        </Box>
      ),
    };
  });
  const table = useMaterialReactTable({
    enableStickyHeader: true,
    columns: columns,
    data: dataTable || [],
    // layoutMode: "grid-no-grow",
    // enableColumnResizing: true,
    enableColumnFilters: true,
    columnFilterDisplayMode: "popover",
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnPinning: true,
    enableColumnOrdering: true,
    enableColumnDragging: false,
    enablePagination: true,
    enableSorting: true,
    enableRowSelection: true,
    enableGlobalFilter: true,
    renderTopToolbar: false,
    renderBottomToolbar: false,
    enableColumnActions: false,
    globalFilterFn: "includesString", // ✅ Built-in filtering
    initialState: {
      density: "compact",
      columnVisibility: {
        "mrt-row-select": false,
        id: false,
      },
      showGlobalFilter: true,
    },
    muiTablePaperProps: { elevation: 0, sx: { height: "100%" } },

    muiTableHeadRowProps: {
      sx: {
        width: "100%",
        boxShadow: "none",
        backgroundColor: "#F9FAFC !important",
        display: hideTitleHeaders ? "none" : undefined,
      },
    },
    muiTableContainerProps: {
      sx: {
        // display: "flex",
        width: "100%",
        height: "100%",
        whiteSpace: "nowrap",
      },
    },

    muiTableBodyRowProps: ({ row }: { row: MRT_Row<any> }) => {
      let clickTimeout: any = null;

      return {
        onClick: (e: any) => {
          e.stopPropagation(); // Prevent event bubbling

          // If onRowDoubleClick is provided, delay the single click to check for double click
          if (onRowDoubleClick && onRowClick) {
            if (clickTimeout) {
              clearTimeout(clickTimeout);
              clickTimeout = null;
              return; // This is part of a double-click, don't execute single click
            }

            clickTimeout = setTimeout(() => {
              onRowClick(row.original);
              clickTimeout = null;
            }, 200); // 200ms delay to detect double-click
          } else if (onRowClick) {
            // If no double-click handler, execute immediately
            onRowClick(row.original);
          }
        },
        onDoubleClick: (e: any) => {
          e.stopPropagation(); // Prevent event bubbling
          e.preventDefault(); // Prevent default double-click behavior

          if (clickTimeout) {
            clearTimeout(clickTimeout);
            clickTimeout = null;
          }

          if (onRowDoubleClick) {
            onRowDoubleClick(row.original);
          }
        },
        sx: {
          // display: "flex",
          cursor: "pointer",
          width: "100% !important",
          // backgroundColor: "#000",
          overflow: "auto",
          whiteSpace: "nowrap",
        },
      };
    },
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          overflowY: "auto",
          // overflowX: "hidden",
        }}
      >
        <MaterialReactTable table={table} />
        {!hidePagination && (
          <Box display="flex" alignItems="center">
            <MRT_TablePagination table={table} />
            <MRT_ShowHideColumnsButton table={table} />
          </Box>
        )}
      </div>
    </>
  );
};

export default CustomTable;
