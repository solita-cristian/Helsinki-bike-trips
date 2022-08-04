import { Paper, Grid, Typography, Button } from '@mui/material'
import { ChangeEvent } from 'react'
import { StationsParams } from '../../models/Params'
import ClearIcon from '@mui/icons-material/Clear'
import AdornedTextField from '../Forms/AdornedTextField'
import BadgeIcon from '@mui/icons-material/Badge';
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import BusinessIcon from '@mui/icons-material/Business';

interface FilterFormProps {
    params: Partial<StationsParams>
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
            <Grid item xs={4}>
                <AdornedTextField 
                    id='name'
                    label='Name'
                    onTextChange={(e: ChangeEvent<HTMLInputElement>) => {updateParams({name: e.target.value})}}
                    adornmentImage={<BadgeIcon />}
                    type='text'
                    value={params.name}
                />
            </Grid>
            <Grid item xs={4}>
                <AdornedTextField 
                    id='address'
                    label='Address'
                    onTextChange={(e: ChangeEvent<HTMLInputElement>) => {updateParams({address: e.target.value})}}
                    adornmentImage={<HomeIcon />}
                    type='text'
                    value={params.address}
                />
            </Grid>
            <Grid item xs={4}>
                <AdornedTextField 
                    id='city'
                    label='City'
                    onTextChange={(e: ChangeEvent<HTMLInputElement>) => {updateParams({city: e.target.value})}}
                    adornmentImage={<LocationCityIcon />}
                    type='text'
                    value={params.city}
                />
            </Grid>
            <Grid item xs={6}>
                <AdornedTextField 
                    id='operator'
                    label='Operator'
                    onTextChange={(e: ChangeEvent<HTMLInputElement>) => {updateParams({operator: e.target.value})}}
                    adornmentImage={<BusinessIcon />}
                    type='text'
                    value={params.operator}
                />
            </Grid>
            <Grid item xs={6}>
                <AdornedTextField 
                    id='capacity'
                    label='Capacity'
                    onTextChange={(e: ChangeEvent<HTMLInputElement>) => {updateParams({capacity: parseInt(e.target.value)})}}
                    adornmentImage={<BusinessIcon />}
                    type='number'
                    value={params.capacity}
                />
            </Grid>
        </Grid>
    </Paper>
    
  )
}
