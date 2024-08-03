'use client'

import { useState, useEffect } from 'react';
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

export default function Home() {

  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const updateInventory = async () => {
    try {

      const q = query(collection(firestore, "inventory"))
      const querySnapshot = await getDocs(q)
      const inventoryList = []

      querySnapshot.forEach((doc) => {
        inventoryList.push({ name: doc.id, ...doc.data() })
      });
      setInventory(inventoryList)

    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const Food = () => {
    const items = inventory.map((food,index)=>
      <Stack key={index} spacing={2}>{food.name}</Stack>)
    return <Item>{items}</Item>
  }


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
