import { Button, Grid, Typography } from '@mui/material'
import { ChangeEvent, useState } from 'react'
import { TripsParams } from '../../models/Params'
import AdornedTextField from './AdornedTextField'
import { FilterFormProps } from './FormProps'
import NumbersIcon from '@mui/icons-material/Numbers';
import StraightenIcon from '@mui/icons-material/Straighten';
import TimerIcon from '@mui/icons-material/Timer';
import ClearIcon from '@mui/icons-material/Clear'


export default function TripsFilterForm({params, updateParams, clearParams}: FilterFormProps<TripsParams>) {

    const [state, setState] = useState(params)

    const handleState = (newParams: Partial<TripsParams>) => {
      console.log(newParams)
      setState({...state, ...newParams})
    }

  return (
    <div style={{alignItems: 'center', justifyContent: 'center'}}>
        <Typography variant='h6' align='center'>
            Search trips
        </Typography>
        <Grid container sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2}}>
            <Grid item>
                <AdornedTextField 
                    id='departure'
                    label='Departure station'
                    onTextChange={(e: ChangeEvent<HTMLInputElement>) => {handleState({departure: +e.target.value})}}
                    adornmentImage={<NumbersIcon />}
                    type='number'
                    value={state.departure}
                />
            </Grid>
            <Grid item>
                  <AdornedTextField 
                    id='return'
                    label='Return station'
                    onTextChange={(e: ChangeEvent<HTMLInputElement>) => {handleState({return: +e.target.value})}}
                    adornmentImage={<NumbersIcon />}
                    type='number'
                    value={state.return}
                  />
            </Grid>
            <Grid item>
                <AdornedTextField 
                    id='distance'
                    label='Distance'
                    onTextChange={(e: ChangeEvent<HTMLInputElement>) => {handleState({distance: +e.target.value})}}
                    adornmentImage={<StraightenIcon />}
                    type='number'
                    value={state.distance}
                />
            </Grid>
            <Grid item>
                <AdornedTextField 
                    id='duration'
                    label='Duration'
                    onTextChange={(e: ChangeEvent<HTMLInputElement>) => {handleState({duration: +e.target.value})}}
                    adornmentImage={<TimerIcon />}
                    type='number'
                    value={state.duration}
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
