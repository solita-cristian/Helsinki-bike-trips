import { InputAdornment, TextField } from '@mui/material'
import React, { ChangeEvent, ReactNode } from 'react'

interface TextFieldProps {
    id: string,
    label: string,
    onTextChange: (e: ChangeEvent<HTMLInputElement>) => void,
    adornmentImage: ReactNode,
    type: 'text' | 'number',
    value: string | number | undefined
}

export default function AdornedTextField({id, label, onTextChange, adornmentImage, type, value}: TextFieldProps) {
  return (
    <TextField
        label={label}
        id={id}
        InputProps={{
            endAdornment: <InputAdornment position='end'>
              {adornmentImage}
            </InputAdornment>
        }}
        onChange={onTextChange}
        type={type}
        value={value}
    />
  )
}
