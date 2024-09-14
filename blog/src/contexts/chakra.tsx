'use client'

import {
    ChakraBaseProvider,
    extendBaseTheme,
    theme as chakraTheme,
  } from '@chakra-ui/react'
import React from 'react'
  
  const { Button, Avatar, Textarea, Divider, Input, Tag, Spinner, Popover } = chakraTheme.components
  
  const theme = extendBaseTheme({
    components: {
      Button, Avatar, Textarea, Divider, Input, Tag, Spinner, Popover
    },
  })
  
export default function Chakra({children}:{children:React.ReactNode}){
    return(
        <ChakraBaseProvider theme={theme}>
            {children}
        </ChakraBaseProvider>
    )
}
  