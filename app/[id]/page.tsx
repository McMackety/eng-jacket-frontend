"use client";

import pb from "@/utils/pb";
import { Box, Button, Chip, CircularProgress, Container, MenuItem, Paper, Select, Stack, Typography } from "@mui/material";
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
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [style, setStyle] = useState("");

  useEffect(() => {
    requestData(params.id as string).then((record) => {
      setRecord(record);
      setColor((record as any).color);
      setSize((record as any).size);
      setStyle((record as any).gender);
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

  if ((record as any).cancelled) {
    return (
      <Container>
        <Paper elevation={2} sx={{ padding: "20px" }}>
          <Typography variant="h2" align="center">Hi, {(record as any).name}!</Typography>
          <Typography variant="h4" align="center">Your order has been cancelled!</Typography>
        </Paper>
      </Container>
    )
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
            displayEmpty={true}
            onChange={async (event) => {
              const record = await pb.collection('orders').update(params.id as string, { color: event.target.value });
              
              setRecord(record);
              setColor((record as any).color);
            }}
          >
            <MenuItem value={"BG"}>Battleship Grey</MenuItem>
            <MenuItem value={"BC"}>Black Charcoal Heather</MenuItem>
            <MenuItem value={"DS"}>Deep Smoke</MenuItem>
            <MenuItem value={"PG"}>Pearly Grey Heather</MenuItem>
            <MenuItem value={"B"}>Black</MenuItem>
          </Select>
          <JacketImg color={(record as any).color} />
          <Typography variant="h4" align="center">Select your Size.</Typography>
          <Select
            value={size}
            label="Jacket Size"
            displayEmpty={true}
            onChange={async (event) => {
              const record = await pb.collection('orders').update(params.id as string, { size: event.target.value });
              
              setRecord(record);
              setSize((record as any).size);
            }}
          >
            <MenuItem value={"S"}>Small</MenuItem>
            <MenuItem value={"M"}>Medium</MenuItem>
            <MenuItem value={"LG"}>Large</MenuItem>
            <MenuItem value={"XL"}>Extra Large</MenuItem>
            <MenuItem value={"2XL"}>2 Extra Large</MenuItem>
            <MenuItem value={"3XL"}>3 Extra Large</MenuItem>
            <MenuItem value={"4XL"}>4 Extra Large</MenuItem>
            <MenuItem value={"5XL"}>5 Extra Large</MenuItem>
          </Select>
          <Typography variant="h4" align="center">Select your Style.</Typography>
          <Select
            value={style}
            label="Jacket Style"
            displayEmpty={true}
            onChange={async (event) => {
              const record = await pb.collection('orders').update(params.id as string, { gender: event.target.value });
              
              setRecord(record);
              setStyle((record as any).gender);
            }}
          >
            <MenuItem value={"MALE"}>Mens</MenuItem>
            <MenuItem value={"FEMALE"}>Womens</MenuItem>
          </Select>
          <Stack direction="row" spacing={1} sx={{ padding: "10px" }}>
            <Button variant="contained" color="error" onClick={async () => {
              let res = confirm("Are you sure you want to cancel your order?")
              if (!res) {
                return;
              }
              
              const record = await pb.collection('orders').update(params.id as string, { cancelled: true });
              
              setRecord(record);
            }}>Cancel Order</Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}

function JacketImg({ color }: { color: string | null | undefined }) {
  if (color == null || color == "") {
    return <></>
  }
  return <img src={"/jacket/" + color + ".jpg"} />
}