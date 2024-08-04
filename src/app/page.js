'use client'

import { useState, useEffect } from 'react';
import Image from "next/image";
import styles from "./page.module.css";

// Material UI
import Paper from "@mui/material/Paper";
import { Box, Grid, Stack, AppBar, IconButton, TextField} from '@mui/material';
import { Remove, Add, Edit } from '@mui/icons-material';
import { styled } from "@mui/material/styles";

// Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from '@/firebase';

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
  borderRadius: 0,
  margin: 5,
  padding: 10,
  height: 50
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

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const Food = () => {
    const items = inventory.map((food,index)=>
      <Item key={index} spacing={2} sx={{ display: 'inline-block'}}>
        <Box sx={{display: 'inline-block' }}>
          <Box sx={{ fontSize: 20 }}>{food.name[0].toUpperCase() + food.name.slice(1)} 
          
          </Box>
          <Box sx={{ fontSize: 12}}>{food.expDate}</Box>
        </Box>
        <IconButton disableRipple sx={{ 
          "&:hover": { backgroundColor: "transparent" }, 
          verticalAlign: 'top'}}
        >
          <Edit fontSize="small" />
        </IconButton>
        <Box sx={{verticalAlign: 'top', float: 'right'}}>
          <IconButton disableRipple sx={{ 
            "&:hover": { backgroundColor: "transparent" },
            float: 'right'
            }}
          >
              <Add fontSize="large" />
          </IconButton>
          <TextField id="outlined-basic" defaultValue={food.quantity} variant="outlined" size='small' sx={{float: 'right', width: 45, marginTop: 0.5}}/>
          <IconButton disableRipple sx={{
            "&:hover": { backgroundColor: "transparent" }, 
            float: 'right'
            }}
          >
            <Remove fontSize="large" sx={{
              ":hover &": {boxShadow: '100px 5px 5px red'},
              ":hover": {color: "#A7C7E7"}
            }}/>
          </IconButton>
        </Box>
      </Item>)
    return <Stack>{items}</Stack>
  }


  return (
    <Box width='100vw'>
      <AppBar ></AppBar>
      <Box
          width='60vw'
          height={500}
          margin='50px auto 0 auto'
      >
        <Box container height={500} bgcolor='#F8F8F8' border={1} borderColor='#BEBEBE'>
          <Food marginTop={10}/>
        </Box>
      </Box>
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
