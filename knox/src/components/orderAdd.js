import * as React from 'react';
import axios from "axios";
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'; // Grid version 1
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { Link, useNavigate } from "react-router-dom";
import './style/orderManagement.css';

import './style/orderManagement.css';



const client = axios.create({
    baseURL: "http://localhost:3001" 
});


function CreateOrder(checked, info, navigate) {
    
    if(checked.length > 1)
    {
        //remove extra 0 first element before submitting
        checked.splice(0,1);

        client.post('/order', { orderdescription: info, productid: checked })
        .then(function (response) {
            console.log(response);
            navigate("/", { replace: true });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    else
    {
        console.log('nothing to post');
    }
}


function PrintProductData(navigate) {
    const [checked, setChecked] = React.useState([0]);
    const [products, setProducts] = React.useState(null);
    const [info, setInfo] = React.useState('');

    const handleToggle = (value) => () => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];
  
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      setChecked(newChecked);      
    };

    React.useEffect(() => {
        async function getProducts() {
          const response = await client.get("/products");
          console.log(response.data);
          setProducts(response.data);
        }
        getProducts();
    }, []);
  
    if(products === null)
    {
      
    }
    else
    {
      {/* Responsive Table */}
      return (
        <div>
            <Grid container spacing={2} alignItems="center" justifyContent="center" >
            <Grid item xs={12}>
            <Typography component="h1" className="card-heading" variant="h4">
                New Order
            </Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField fullWidth label="Order Description" id="fullWidth" value={info} onChange={(event) => {setInfo(event.target.value)}} />
                </Grid>
                <Grid item xs={12}>
                <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '20px', padding: '5px' }}>
                        <List sx={{ bgcolor: 'background.paper' }}>
                            {products.map((value) => {
                                const labelId = value.id;

                                return (
                                
                                        <ListItem
                                            key={value.id}
                                            disablePadding
                                            className='product-box'
                                        >
                                            <ListItemButton role={undefined} onClick={handleToggle(value.id)} dense>
                                            <ListItemIcon>
                                                <Checkbox
                                                edge="start"
                                                checked={checked.indexOf(value.id) !== -1}
                                                tabIndex={-1}
                                                disableRipple
                                                inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText id={labelId} primary={value.productName} secondary={value.productDescription.info} />
                                            </ListItemButton>
                                        </ListItem>

                                );
                            })}
                        </List>
                </Paper>
                </Grid>
          </Grid>
          <Link to="/">
            <Button variant="contained" sx={{ 'marginTop': '10px' }}>
                CANCEL
            </Button>
          </Link>
          <Button onClick={() => CreateOrder(checked, info, navigate)} variant="contained" sx={{ 'marginTop': '10px', 'marginLeft': '10px' }}>
            SUBMIT
          </Button>
        </div>
      )
    }
  
  }


function OrderAdd() {
    const navigate = useNavigate();
    return (
        <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
            <Card variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
            
                    {PrintProductData(navigate)}
                
            </Card>
        </Container>
    )
}

export default OrderAdd;