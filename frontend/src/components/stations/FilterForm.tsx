import { Paper, Grid, Typography, TextField, InputAdornment, SelectChangeEvent, Button, IconButton } from '@mui/material'
import React, { ChangeEvent, useState } from 'react'
import { Params, StationsParams } from '../../models/Params'
import { LanguageSelect, SupportedLanguage } from '../Forms/Selects/LanguageSelect'
import TextFieldWithLanguage from '../Forms/TextFieldWithLanguage'
import ClearIcon from '@mui/icons-material/Clear';
import { VoidExpression } from 'typescript'

const nameLanguages: SupportedLanguage[] = [
    {code: 'fin', value: 'fi'},
    {code: 'swe', value: 'se'},
    {code: 'gbr', value: 'en'},
]

interface FilterFormProps {
    params: Partial<StationsParams>,
    updateParams: (params: Partial<StationsParams>) => void,
    clearParams: () => void
}

export default function FilterForm({params, updateParams, clearParams}: FilterFormProps) {
  return (
    <Paper>
        <Typography variant='h6' align='center'>
            Search stations
        </Typography>
        <Grid container>
            <Grid item xs={12}>
                <Button variant='outlined' startIcon={<ClearIcon />} onClick={clearParams}>
                    Clear
                </Button>
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
                <TextFieldWithLanguage 
                    id='name'
                    label='Name'
                    onTextChange={(e: ChangeEvent<HTMLInputElement>) => {updateParams({name: [e.target.value, params.name ? params.name[1] : undefined]})}}
                    onLanguageChange={(e: SelectChangeEvent) => {updateParams({name: [params.name ? params.name[0] : undefined, e.target.value]})}}
                    textValue={params.name ? params.name[0] : ''}
                    languageValue={params.name ? params.name[1] : ''}
                    supportedLanguages={nameLanguages}
                />
            </Grid>
            <Grid item xs={8}>
                Operator
            </Grid>
            <Grid item xs={4}>
                Capacity
            </Grid>
        </Grid>
    </Paper>
    
  )
}
