import { AppBar, Box, Toolbar, Typography, Button, Grid } from '@mui/material'
import { Container } from '@mui/system'
import { Link } from 'react-router-dom'
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const pages = ['Stations', 'Trips']

/**
 * Defines the header of the application
 * @returns An Appbar that will appear at every route
 */
export default function Header() {

  return (
    <AppBar position='static'>
        <Container maxWidth='xl'>
          <Toolbar disableGutters>
            <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 3,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Helsinki bike trips
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                <Link to={`/${page.toLowerCase()}`} style={{textDecoration: 'none', color: 'white'}}>{page}</Link>
              </Button>
            ))}
          </Box>
          <Box sx={{float: 'right'}}>
            <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}} columnSpacing={2}>
              <Grid item>
                <Typography variant='body2'>
                  Cristian Nicolae Lupascu © 2022
                </Typography>
              </Grid>
              <Grid item>
                <LinkedInIcon
                  onClick={() => window.open('https://www.linkedin.com/in/cristian-nicolae-lupascu-b5143a161/')}
                />
              </Grid>
            </Grid>
          </Box>
          </Toolbar>
        </Container>
    </AppBar>
  )
}
