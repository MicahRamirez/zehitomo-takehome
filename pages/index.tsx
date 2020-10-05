import React from "react";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";

import useSWR from "swr";
import fetch from "unfetch";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Index() {
  const { data, error } = useSWR("/api/search", fetcher);
  if (error) {
    console.warn("unable to search");
  }
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <div>{JSON.stringify(data)}</div>
      </Box>
    </Container>
  );
}
