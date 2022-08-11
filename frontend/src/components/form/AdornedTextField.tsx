import { InputAdornment, TextField } from '@mui/material'
import React, { ChangeEvent, ReactNode } from 'react'

/**
 * Defines the props for the adorned text field component
 */
interface TextFieldProps {
    id: string,
    label: string,
    onTextChange: (e: ChangeEvent<HTMLInputElement>) => void,
    adornmentImage: ReactNode,
    type: 'text' | 'number',
    value: string | number | undefined
}

/**
 * Defines a text field with a decoration image at the end
 * @param props The props of this component 
 * @returns The adorned text field
 */
export default function AdornedTextField({id, label, onTextChange, adornmentImage, type, value}: TextFieldProps) {
  return (
    <TextField
        sx={{
          width:'80%'
        }}
        key={id}
        label={label}
        id={id}
        InputProps={{
            endAdornment: <InputAdornment position='end'>
              {adornmentImage}
            </InputAdornment>,
        }}
        onChange={onTextChange}
        type={type}
        value={value}
        variant='standard'
        size='small'
    />
  )
}
