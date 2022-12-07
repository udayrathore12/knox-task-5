import * as React from 'react';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'; // Grid version 1

export default function NoMatch() {
  return (
      <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
        <Card variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
            <Typography component="h1" className="card-heading" variant="h1" textAlign={'center'}>
                404
            </Typography>
        </Card>
      </Container>
  )
}