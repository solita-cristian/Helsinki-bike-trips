import { Box, FormControl, ListItemIcon, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React from 'react'
import Flag from 'react-world-flags'

export interface SupportedLanguage {
    code: string,
    value: string
}

interface SelectProps {
    id: string,
    supportedLanguages: SupportedLanguage[],
    value: string,
    setValue: (e: SelectChangeEvent) => void
}

export const LanguageSelect = ({value, setValue, id, supportedLanguages}: SelectProps) => {
  return (
    <FormControl variant='standard'>
        <Select
            id={id}
            value={value}
            renderValue={(value: string) => {
                return (
                    <Box sx={{width: '100%', margin:'0 auto'}}>
                        <Flag code={supportedLanguages.find(l => l.value === value)?.code} />
                    </Box>
                )
            }}
            onChange={setValue}>
                {supportedLanguages.map(language => (
                    <MenuItem value={language.value} style={{textAlign: 'center'}} key={language.code}>
                        <ListItemIcon>
                            <Flag code={language.code} size={1}/>
                        </ListItemIcon>
                    </MenuItem>
                ))}
            </Select>
    </FormControl>
  )
}
