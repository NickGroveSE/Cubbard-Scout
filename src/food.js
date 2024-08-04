import { useState, useEffect } from 'react';

// Material UI
import Paper from "@mui/material/Paper";
import { Box, Grid, Stack, AppBar, IconButton, TextField, Modal, Typography, Button} from '@mui/material';
import { Remove, Add, Edit, Done } from '@mui/icons-material';
import { styled } from "@mui/material/styles";

// Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, getDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
import { firestore } from '@/firebase';




export default function FoodList() {

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  }

  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [oldItemName, setOldItemName] = useState('')
  const [itemExpDate, setItemExpDate] = useState('')

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleMouseUp = (e) => {
    e.preventDefault();
  };

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
        const { quantity, expDate } = docSnap.data()
        await setDoc(docRef, { quantity: quantity + 1, expDate: expDate })
      } else {
        await setDoc(docRef, { quantity: 1, expDate: expDate })
      }
      await updateInventory()
    }

    const removeItem = async (item) => {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const { quantity, expDate } = docSnap.data()
        if (quantity === 1) {
          await deleteDoc(docRef)
        } else {
          await setDoc(docRef, { quantity: quantity - 1, expDate: expDate })
        }
      }
      await updateInventory()
    }

    const customQuantity = async (item, itemQuantity) => {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const { quantity, expDate } = docSnap.data()
        const q = Number(itemQuantity)
        await setDoc(docRef, { quantity: q, expDate: expDate })
      } else {
        console.log("Input is not an integer, try again")
      }
    }

    const editItem = async (oldItem, item, itemExpDate) => {
      const oldDocRef = doc(collection(firestore, 'inventory'), oldItem)
      const oldDocSnap = await getDoc(oldDocRef)

      const docRef = doc(collection(firestore, 'inventory'), item)
      
      if(oldItem == item) {
        const { quantity, expDate } = oldDocSnap.data()
        await setDoc(oldDocRef, { quantity: quantity, expDate: itemExpDate })
      } else {
        const { quantity, expDate } = oldDocSnap.data()
        await setDoc(docRef, { quantity: quantity, expDate: itemExpDate })
        await deleteDoc(oldDocRef)
      }

      await updateInventory()

    }

  const Item = styled(Paper)(({ theme }) => ({
      padding: theme.spacing(1),
      textAlign: "left",
      color: theme.palette.text.secondary,
      borderRadius: 0,
      margin: 5,
      padding: 10,
      height: 50
  }));

  const Food = () => {
    const items = inventory.map((food,index)=>
      <Item key={index} spacing={2} sx={{ display: 'inline-block'}}>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit Item
            </Typography>
            <Stack width="100%" direction={'row'} spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <TextField
                id="outlined-basic"
                label="Expiration Date"
                variant="outlined"
                fullWidth
                value={itemExpDate}
                onChange={(e) => setItemExpDate(e.target.value)}
              />
              <IconButton
                onClick={() => {
                  editItem(oldItemName, itemName, itemExpDate)
                  setItemName('')
                  setItemExpDate('')
                  handleClose()
                }}
              >
                <Done fontSize="large" />
              </IconButton>
            </Stack>
          </Box>
        </Modal>
        <Box sx={{display: 'inline-block' }}>
          <Box sx={{ fontSize: 20 }}>{food.name[0].toUpperCase() + food.name.slice(1)} 
          
          </Box>
          <Box sx={{ fontSize: 12}}>{food.expDate}</Box>
        </Box>
        <IconButton disableRipple sx={{ 
          "&:hover": { backgroundColor: "transparent" }, 
          verticalAlign: 'top'}}
        >
          <Edit onClick={function(){setOldItemName(food.name), setItemName(food.name); setItemExpDate(food.expDate); handleOpen()}} fontSize="small"
            
          />
        </IconButton>
        <Box sx={{verticalAlign: 'top', float: 'right'}}>
          <IconButton disableRipple sx={{ 
            "&:hover": { backgroundColor: "transparent" },
            float: 'right'
            }}
          >
              <Add onClick={() => addItem(food.name)} fontSize="large" />
          </IconButton>
          <TextField onChange={(event) => customQuantity(food.name, event.target.value)} id="outlined-basic" defaultValue={food.quantity} variant="outlined" size='small' sx={{float: 'right', width: 45, marginTop: 0.5}}/>
          <IconButton disableRipple sx={{
            "&:hover": { backgroundColor: "transparent" }, 
            float: 'right'
            }}
          >
            <Remove onClick={() => removeItem(food.name)} fontSize="large"/>
          </IconButton>
        </Box>
      </Item>)
    return <Stack>{items}</Stack>
  }

  return(
    <>
      <Food/>
    </>
  )
}