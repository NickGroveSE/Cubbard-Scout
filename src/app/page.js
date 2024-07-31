'use client'

import { useEffect } from 'react';
import Image from "next/image";
import styles from "./page.module.css";

// Material UI
import Paper from "@mui/material/Paper";
import { Box,Grid,Stack } from '@mui/material';
import { styled } from "@mui/material/styles";

// Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from '@/firebase';



const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary
}));

const food = ["bread", "apples"]

const Food = () => {
  const items = food.map((food,index)=>
    <Stack key={index} spacing={2}>{food}</Stack>)
  return <Item>{items}</Item>
}

export default function Home() {
  const fetchData = async () => {
    try {
      const q = query(collection(firestore, "inventory"))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data())
      });
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])


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
            <Food/>
          </Grid>
          <Grid 
            xs={4.5}
          >
          </Grid>
        </Grid>
      </Box>
  );
}

// async function firestoreQuery() {


//   const querySnapshot = await getDocs(collection(db, "food"));
//   querySnapshot.forEach((doc) => {
//     // doc.data() is never undefined for query doc snapshots
//     console.log(doc.id, " => ", doc.data());
//   });

// }
