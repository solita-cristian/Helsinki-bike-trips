import { Grid, Typography, Button } from '@mui/material'
import { ChangeEvent, useState } from 'react'
import { StationsParams } from '../../models/Params'
import ClearIcon from '@mui/icons-material/Clear'
import AdornedTextField from './AdornedTextField'
import BadgeIcon from '@mui/icons-material/Badge';
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import BusinessIcon from '@mui/icons-material/Business';
import NumbersIcon from '@mui/icons-material/Numbers';
import { FilterFormProps } from './FormProps'


/**
 * Defines a filter form specifically for filtering stations, using station query parameters
 * @param props The props of the component
 * @returns A form which update the station query parameters
 */
export default function StationsFilterForm({params, updateParams, clearParams}: FilterFormProps<StationsParams>) {

    const [state, setState] = useState(params)

    const handleState = (newParams: Partial<StationsParams>) => {
        setState({...state, ...newParams})
    }

  return (
    <div style={{alignItems: 'center', justifyContent: 'center'}}>
        <Typography variant='h6' align='center'>
            Search stations
        </Typography>
        <Grid container sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2}}>
            <Grid item>
                <AdornedTextField 
                    id='name'
                    label='Name'
                    onTextChange={(e: ChangeEvent<HTMLInputElement>) => {handleState({name: e.target.value})}}
                    adornmentImage={<BadgeIcon />}
                    type='text'
                    value={state.name}
                />
            </Grid>
            <Grid item>
                <AdornedTextField 
                    id='address'
                    label='Address'
                    onTextChange={(e: ChangeEvent<HTMLInputElement>) => {handleState({address: e.target.value})}}
                    adornmentImage={<HomeIcon />}
                    type='text'
                    value={state.address}
                />
            </Grid>
            <Grid item>
                <AdornedTextField 
                    id='city'
                    label='City'
                    onTextChange={(e: ChangeEvent<HTMLInputElement>) => {handleState({city: e.target.value})}}
                    adornmentImage={<LocationCityIcon />}
                    type='text'
                    value={state.city}
                />
            </Grid>
            <Grid item>
                <AdornedTextField 
                    id='operator'
                    label='Operator'
                    onTextChange={(e: ChangeEvent<HTMLInputElement>) => {handleState({operator: e.target.value})}}
                    adornmentImage={<BusinessIcon />}
                    type='text'
                    value={state.operator}
                />
            </Grid>
            <Grid item>
                <AdornedTextField 
                    id='capacity'
                    label='Capacity'
                    onTextChange={(e: ChangeEvent<HTMLInputElement>) => {handleState({capacity: parseInt(e.target.value)})}}
                    adornmentImage={<NumbersIcon />}
                    type='number'
                    value={state.capacity}
                />
            </Grid>
        </Grid>
        <Grid container spacing={1} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, mb: 1}}>
            <Grid item>
                <Button variant='contained' startIcon={<ClearIcon />} onClick={clearParams} size='small' color='error'>
                    Clear
                </Button>
            </Grid>
            <Grid item>
                <Button variant='contained' onClick={() => {updateParams(state)}} size='small' color='primary'>
                    Filter
                </Button>
            </Grid>
        </Grid>
    </div>
    
  )
}
