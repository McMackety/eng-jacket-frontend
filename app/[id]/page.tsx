"use client";

import pb from "@/utils/pb";
import { Box, Chip, CircularProgress, Container, MenuItem, Paper, Select, Stack, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { RecordModel } from "pocketbase";
import { useEffect, useState } from "react";
import { AddModerator, Email } from "@mui/icons-material";

async function requestData(id: string): Promise<RecordModel> {
  const record = await pb.collection('orders').getOne(id);

  return record;
}

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const [record, setRecord] = useState<RecordModel | null>(null);
  const [color, setColor] = useState("B");

  useEffect(() => {
    requestData(params.id as string).then((record) => {
      setRecord(record);
      setColor((record as any).color);
    }).catch(_ => {
      router.push("/");
    });
  }, []);

  if (record == null) {
    return (
      <Container>
        <Paper elevation={2} sx={{ padding: "20px" }}>
          <CircularProgress style={{ marginLeft: "auto", marginRight: "auto", display: "block" }} />
        </Paper>
      </Container>
    );
  }

  return (
    <Container>
      <Paper elevation={2} sx={{ padding: "20px" }}>
        <Typography variant="h2" align="center">Hi, {(record as any).name}!</Typography>
        <Typography variant="h4" align="center">Here is the information for your order!</Typography>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="10vh"
          flexDirection="column"
        >
          <Stack direction="row" spacing={1} sx={{ padding: "10px" }}>
            <Chip color="error" label={"Order has not been paid"} />
            <Chip color="success" label={"On Order"} />
          </Stack>
          <Stack direction="row" spacing={1} sx={{ padding: "10px" }}>
            <Chip icon={<Email />} label={(record as any).personalEmail} />
            <Chip icon={<AddModerator />} label={(record as any).teslaEmail} />
          </Stack>
          <Typography variant="h4" align="center">Select your Color.</Typography>
          <Select
            value={color}
            label="Jacket Color"
            onChange={async (event) => {
              const record = await pb.collection('orders').update(params.id as string, { color: event.target.value });
              
              setRecord(record);
              setColor((record as any).color);
            }}
          >
            <MenuItem value={"BG"}>Battleship Grey</MenuItem>
            <MenuItem value={"BC"}>Black Charcoal Heather</MenuItem>
            <MenuItem value={"BN"}>Dress Blue Navy</MenuItem>
            <MenuItem value={"M"}>Maroon</MenuItem>
            <MenuItem value={"PG"}>Pearly Grey Heather</MenuItem>
            <MenuItem value={"TR"}>True Royal</MenuItem>
            <MenuItem value={"B"}>Black</MenuItem>
            <MenuItem value={"FG"}>Forest Green</MenuItem>
            <MenuItem value={"NH"}>Navy Heather</MenuItem>
            <MenuItem value={"RR"}>Rich Red</MenuItem>
          </Select>
          <img src={"/jacket/" + (record as any).color + ".jpg"} />
        </Box>
      </Paper>
    </Container>
  );
}
