'use client'

// Material UI
import { Box } from '@mui/material';

// Custom Components
import FoodList from '@/food';

export default function Home() {

  return (
    <Box width='100vw'>
      <Box
          width='60vw'
          height={500}
          margin='50px auto 0 auto'
      >
        <Box height={500} bgcolor='#F8F8F8' border={1} borderColor='#BEBEBE'>
          <FoodList marginTop={10}/>
        </Box>
      </Box>
    </Box>
  );
}

