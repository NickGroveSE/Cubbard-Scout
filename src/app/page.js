'use client'

import { useState, useEffect } from 'react';

// Material UI
import Paper from "@mui/material/Paper";
import { Box, Stack, IconButton, TextField, Modal, Typography, Container } from '@mui/material';
import { Remove, Add, Edit, Done, Delete, Search, Clear, KeyboardReturn} from '@mui/icons-material';
import { styled } from "@mui/material/styles";

// Firebase
import { collection, query, getDocs, getDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
import { firestore } from '@/firebase';

export default function Home() {

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

  // Items
  const [itemName, setItemName] = useState('')
  const [oldItemName, setOldItemName] = useState('')
  const [itemExpDate, setItemExpDate] = useState('')

  // Search
  const [searchBarVisibility, setSearchBarVisibility] = useState('none')
  const [searchContent, setSearchContent] = useState('')

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)


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

  const addItem = async (item, itemExpDate = '') => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity, expDate } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1, expDate: expDate })
    } else {
      await setDoc(docRef, { quantity: 1, expDate: itemExpDate})
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
    const q = Number(itemQuantity)
    if (docSnap.exists()) {
      const { quantity, expDate } = docSnap.data()

      await setDoc(docRef, { quantity: q, expDate: expDate })
    } else if(q === 0) {
      await deleteDoc(docRef)
    } 
    await updateInventory()
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

  const deleteItem = async(item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      await deleteDoc(docRef)
    }

    await updateInventory()
  }

  const search = (content) => {

    setInventory(inventory.filter(food => food.name.includes(content)))

  }


  return (
    <Box width='100vw'>
      <Box
          width='60vw'
          maxHeight={500}
          minHeight={500}
          margin='50px auto 0 auto'
          overflow={"hidden scroll"}
          bgcolor='#F8F8F8' 
          border={1} 
          borderColor='#BEBEBE'
          sx={{
            "&::-webkit-scrollbar": {
              display: "none"
            }
          }}
      >
        <Box>
          <Box
            display={searchBarVisibility}
            sx={{
              backgroundColor: "white",
              height: '100px',
              width: '60vw',
              padding: '25px 20px 0 20px'
            }}
          >
              <IconButton disableRipple sx={{ 
                  "&:hover": { color: "white", backgroundColor: "red" },
                  color: "red",
                  backgroundColor: "white",
                  transition: '0.5s',
                  marginRight: '5px'
                }}

              >
                <Clear onClick={async function(){setSearchContent(''); setSearchBarVisibility('none'); await updateInventory()}} fontSize="large" />
              </IconButton>
              <TextField 
                variant="outlined" 
                size='large' 
                sx={{ width: '48vw'}}
                onChange={async(e) => {setSearchContent(e.target.value); await updateInventory()}}
                value={searchContent}
              />
              <IconButton disableRipple sx={{
                  "&:hover": { color: "white", backgroundColor: "blue" },
                  color: "blue",
                  backgroundColor: "white",
                  transition: '0.5s',
                  marginLeft: '5px'
              }}
              >
                <KeyboardReturn onClick={function(){ search(searchContent); }} 
                  fontSize="large"/>
              </IconButton>
          </Box>
          <Box>
            <Stack>
              { inventory.map((food,index) => {
              return ( 
                <Paper key={index} spacing={2} sx={{ 
                  display: 'inline-block',
                  padding: '10px',
                  textAlign: "left",
                  borderRadius: 0,
                  margin: 1,
                  marginBottom: 0,
                  height: 50
                }}>
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Typography id="modal-modal-title" variant="h6" component="h2">
                        { oldItemName ? "Edit Item" : "Add Item" }
                      </Typography>
                      <Stack width="100%" direction={'row'} spacing={2}>
                        <TextField
                          id="outlined-basic"
                          label="Item"
                          variant="outlined"
                          fullWidth
                          onChange={(e) => setItemName(e.target.value)}
                          value={itemName}
                        />
                        <TextField
                          id="outlined-basic"
                          label="Expiration Date"
                          variant="outlined"
                          fullWidth
                          onChange={(e) => setItemExpDate(e.target.value)}
                          value={itemExpDate}
                        />
                        <IconButton
                          onClick={() => {
                            oldItemName ? editItem(oldItemName, itemName, itemExpDate) : addItem(itemName, itemExpDate);
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
                    <Edit onClick={function(){setOldItemName(food.name); setItemName(food.name); setItemExpDate(food.expDate); handleOpen()}} fontSize="small"/>
                  </IconButton>
                  <IconButton disableRipple sx={{ 
                    "&:hover": { backgroundColor: "transparent" }, 
                    verticalAlign: 'top'}}
                  >
                    <Delete onClick={() => deleteItem(food.name)} fontSize="small"/>
                  </IconButton>
                  <Box sx={{verticalAlign: 'top', float: 'right'}}>
                    <IconButton disableRipple sx={{ 
                      "&:hover": { backgroundColor: "transparent" },
                      float: 'right'
                      }}
                    >
                      <Add onClick={() => addItem(food.name)} fontSize="large" />
                    </IconButton>
                    <TextField onChange={(event) => customQuantity(food.name, event.target.value)} id="outlined-basic" value={food.quantity} variant="outlined" size='small' sx={{float: 'right', width: 45, marginTop: 0.5}}/>
                    <IconButton disableRipple sx={{
                      "&:hover": { backgroundColor: "transparent" }, 
                      float: 'right'
                      }}
                    >
                      <Remove onClick={() => removeItem(food.name)} fontSize="large"/>
                    </IconButton>
                  </Box>
                </Paper>)
            })}
            </Stack>
            <IconButton disableRipple sx={{ 
              "&:hover": { color: "white", backgroundColor: "green" },
              color: "green",
              backgroundColor: "white",
              position: "absolute",
              left: '81vw',
              top: '30vh',
              transition: "0.5s"
              }} 
            >                
              <Search onClick={() => (searchBarVisibility == 'none') ? setSearchBarVisibility('block') : setSearchBarVisibility('none')} fontSize="large" />
            </IconButton>         
            <IconButton disableRipple sx={{ 
              "&:hover": { color: "white", backgroundColor: "green" },
              color: "green",
              backgroundColor: "white",
              position: "absolute",
              left: '81vw',
              top: '40vh',
              transition: "0.5s"
              }}
            >
                <Add onClick={function(){setOldItemName(''); handleOpen()}} fontSize="large" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

