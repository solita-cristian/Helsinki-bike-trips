import { InputAdornment, SelectChangeEvent, TextField } from '@mui/material'
import React, { ChangeEvent } from 'react'
import { LanguageSelect, SupportedLanguage } from './Selects/LanguageSelect'

interface TextFieldWithLanguageProps {
    id: string,
    label: string,
    textValue: string | undefined,
    languageValue: string | undefined,
    onTextChange: (e: ChangeEvent<HTMLInputElement>) => void,
    onLanguageChange: (e: SelectChangeEvent) => void
    supportedLanguages: SupportedLanguage[]
}

export default function TextFieldWithLanguage(props: TextFieldWithLanguageProps) {
  return (
    <TextField
        label={props.label}
        id={props.id}
        InputProps={{
            endAdornment: <InputAdornment position='end'>
                <LanguageSelect
                    value={props.languageValue ?? ''}
                    id={props.id + '-lang'}
                    supportedLanguages={props.supportedLanguages}
                    setValue={props.onLanguageChange}
                />
            </InputAdornment>
        }}
        onChange={props.onTextChange}
    />
  )
}
