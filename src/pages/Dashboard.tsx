import WrapperPage from "../wrapper/WrapperPage";
import { Box } from "@mui/material";
import ChatBotPanel from "../components/ChatBotPanel";

function Dashboard() {
  return (
    <WrapperPage title="Dashboard">
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ChatBotPanel />
      </Box>
    </WrapperPage>
  );
}

export default Dashboard;
