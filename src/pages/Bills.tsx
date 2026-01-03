import CustomTable from "../components/CustomTable";
import WrapperPage from "../wrapper/WrapperPage";

const mockBillsData = [
  {
    vendor: "Electric Company",
    amount: "$250.00",
    dueDate: "2025-11-20",
    status: "Pending",
  },
  {
    vendor: "Water Utilities",
    amount: "$75.50",
    dueDate: "2025-11-18",
    status: "Paid",
  },
  {
    vendor: "Internet Provider",
    amount: "$89.99",
    dueDate: "2025-11-25",
    status: "Pending",
  },
  {
    vendor: "Phone Service",
    amount: "$45.00",
    dueDate: "2025-11-15",
    status: "Paid",
  },
  {
    vendor: "Rent",
    amount: "$1,500.00",
    dueDate: "2025-11-01",
    status: "Paid",
  },
];

const columns = [
  { field: "vendor", headerName: "Vendor", type: "text" as const },
  { field: "amount", headerName: "Amount", type: "text" as const },
  { field: "dueDate", headerName: "Due Date", type: "text" as const },
  { field: "status", headerName: "Status", type: "text" as const },
];

function Bills() {
  return (
    <WrapperPage title="Bills">
      <CustomTable data={mockBillsData} initColumns={columns} />
    </WrapperPage>
  );
}

export default Bills;
