import { Divider, Link, Typography } from '@mui/material';
import React from 'react';

export const Home = () => {
    return (
        <React.Fragment>
            <Typography variant="h4" noWrap component="div" align='center' sx={{mb: "10px"}}>
                Welcome!
            </Typography>
            <Divider  sx={{mb: "10px"}}/>
            <Typography variant='body1' paragraph sx={{wordWrap: "normal", mt: "10px"}}>
                This website will show you data regarding the stations and the bike trips in the Helsinki area,
                and it was built as a pre-assignment for <Link href="https://www.solita.fi/">Solita</Link>'s 2022 web academy.
                For more information about the assignment click <Link href="https://github.com/solita/dev-academy-2022-fall-exercise">here</Link>.
            </Typography>
            <Divider  sx={{mb: "10px"}}/>
            <Typography variant='body1' paragraph sx={{wordWrap: "normal", mt: "10px"}}>
                This application is free and open source, so check out the <Link href='https://github.com/LuBashQ/Helsinki-bike-trips'>GitHub repository</Link>!
            </Typography>
        </React.Fragment>
    )
}