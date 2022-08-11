import { Typography } from '@mui/material'
import React from 'react'

/**
 * Defines the homepage of the application
 * @returns The homepage component
 */
export default function Home() {
  return (
    <div>
        <Typography variant='h2' className='title'>Welcome!</Typography>
        <Typography variant='body1' style={{textAlign: 'center'}}>
            Welcome to the Helsinki bike trips app! This application shows you bike trips and stations all around Helsinki! 
        </Typography>
    </div>
  )
}
