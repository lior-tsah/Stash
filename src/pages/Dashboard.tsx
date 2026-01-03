import WrapperPage from "../wrapper/WrapperPage";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { Box, Paper, Typography } from "@mui/material";

// Sample data for charts
const categoryData = [
  { id: 0, value: 35, label: "Food & Dining" },
  { id: 1, value: 25, label: "Transportation" },
  { id: 2, value: 20, label: "Entertainment" },
  { id: 3, value: 15, label: "Utilities" },
  { id: 4, value: 5, label: "Other" },
];

const monthlyExpenses = [
  { month: "Jan", expenses: 4500, income: 6000 },
  { month: "Feb", expenses: 4200, income: 6000 },
  { month: "Mar", expenses: 4800, income: 6000 },
  { month: "Apr", expenses: 5100, income: 6000 },
  { month: "May", expenses: 4600, income: 6000 },
  { month: "Jun", expenses: 4900, income: 6000 },
];

const weeklySpending = [3200, 2800, 3500, 4100, 3300, 2900, 3700];

function Dashboard() {
  return (
    <WrapperPage title="Dashboard">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          height: "100%",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* Top Row - Pie and Line Charts */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flex: "1 1 45%",
            minHeight: 0,
          }}
        >
          {/* Pie Chart - Expense Categories */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Expense Categories
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 0,
                }}
              >
                <PieChart
                  series={[
                    {
                      data: categoryData,
                      highlightScope: { highlight: "item", fade: "global" },
                    },
                  ]}
                  width={400}
                  height={250}
                  margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  slotProps={{
                    legend: {
                      position: { vertical: "middle", horizontal: "end" },
                    },
                  }}
                />
              </Box>
            </Paper>
          </Box>

          {/* Line Chart - Monthly Trends */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Monthly Income vs Expenses
              </Typography>
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <LineChart
                  xAxis={[
                    {
                      scaleType: "point",
                      data: monthlyExpenses.map((item) => item.month),
                    },
                  ]}
                  series={[
                    {
                      data: monthlyExpenses.map((item) => item.expenses),
                      label: "Expenses",
                      color: "#ff6b6b",
                    },
                    {
                      data: monthlyExpenses.map((item) => item.income),
                      label: "Income",
                      color: "#51cf66",
                    },
                  ]}
                  height={250}
                  margin={{ top: 10, bottom: 30, left: 50, right: 10 }}
                />
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Bar Chart - Weekly Spending */}
        <Box sx={{ flex: "1 1 50%", minHeight: 0 }}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Weekly Spending
            </Typography>
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                  },
                ]}
                series={[
                  {
                    data: weeklySpending,
                    label: "Spending ($)",
                    color: "#4dabf7",
                  },
                ]}
                height={250}
                margin={{ top: 10, bottom: 30, left: 50, right: 10 }}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
    </WrapperPage>
  );
}

export default Dashboard;
