'use client'

import * as React from 'react';
import Image from "next/image";
import styles from "./page.module.css";
import Paper from "@mui/material/Paper";
import { Box,Grid,Stack } from '@mui/material';
import { styled } from "@mui/material/styles";

const ingredients = ["bread", "chips", "cheese", "apples", "lettuce"];

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary
}));

const Items = () => {
  const items = ingredients.map((food,index)=>
    <div key={index}>{food}</div>)
  return <Item>{items}</Item>
}

export default function Home() {
  return (
      <Box
          width='80vw'
          margin='0 auto 0 auto'
          marginTop={2}
      >
        <Grid container height={500} bgcolor='#F8F8F8' border={1} borderColor='#BEBEBE' borderRadius={5} >
          <Grid 
            xs={7.5}
            borderRight={1}
            borderColor='#BEBEBE'
          >
            <Stack spacing={2}>
              <Items/>
            </Stack>
          </Grid>
          <Grid 
            xs={4.5}
          >
          </Grid>
        </Grid>
      </Box>
  );
}
