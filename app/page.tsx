import Image from "next/image";
import pb from "@/utils/pb";
import { Container, Paper, Typography } from "@mui/material";

export default function Home() {
  return (
    <Container>
      <Paper elevation={2} sx={{ padding: "20px" }}>
        <Typography variant="h2" align="center">Engineering Jackets Order Tracker</Typography>
        <Typography variant="body1" align="center">Check you email to find your unique link!</Typography>
        <img src="/cool-fun.gif" style={{ marginLeft: "auto", marginRight: "auto", display: "block" }}></img>
      </Paper>
    </Container>
  );
}
