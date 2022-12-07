import * as React from 'react';
import axios from "axios";
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'; // Grid version 1
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Link } from "react-router-dom";
import SearchBar from "material-ui-search-bar";

import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';

import './style/orderManagement.css';


const columns = [
  { id: 'oid', label: 'Order Id', minWidth: 40 },
  { id: 'oDesc', label: 'Order Description', minWidth: 100 },
  {
    id: 'cop',
    label: 'Count Of Products',
    minWidth: 70,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'cDate',
    label: 'Created Date',
    minWidth: 70,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'action',
    label: '',
    minWidth: 50,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
];

const client = axios.create({
  baseURL: "http://localhost:3001" 
});

function DeleteOrder(orderId) {
    client.delete('/order/'+ orderId )
    .then(function (response) {
      console.log(response);
      window.location.reload();
    })
    .catch(function (error) {
      console.log(error);
    });
}

function PrintOrderData() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [orders, setOrders] = React.useState(null);
  const [search, setSearch] = React.useState(null);

  const [searched, setSearched] = React.useState("");

  const requestSearch = (searchedVal) => {
    const filteredRows = orders.filter((row) => {
      return row.orderDescription.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setSearch(filteredRows);
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  React.useEffect(() => {
    async function getOrders() {
      const response = await client.get("/orders");
      console.log(response.data);
      setOrders(response.data);
      setSearch(response.data);
    }
    getOrders();
  }, []);
  console.log('prints');

  if(orders === null)
  {
    
  }
  else
  {
    {/* Responsive Table */}
    return (
      <Grid container spacing={2} alignItems="center" justifyContent="center" >
        <Grid item xs={6}>
          <Typography component="h1" className="card-heading" variant="h4">
            Order Management
          </Typography>
        </Grid>
        <Grid item xs={6}>
        <SearchBar
              value={searched}
              placeholder={'Search Orders'}
              onChange={(searchVal) => requestSearch(searchVal)}
              onCancelSearch={() => cancelSearch()}
          />
        </Grid>
        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '20px' }}>
          
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>

                {
                search.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                            <TableCell>
                              {row.id}
                            </TableCell>
                            <TableCell>
                              {row.orderDescription}
                            </TableCell>
                            <TableCell align='right'>
                              {row.count}
                            </TableCell>
                            <TableCell align='right'>
                              {row.createdAt}
                            </TableCell>
                            <TableCell align='right'>
                              <Link className='text-dark'><CreateIcon /></Link>
                              <Link onClick={() => DeleteOrder(row.id)} className='text-dark'><DeleteIcon /></Link>
                            </TableCell>
                      </TableRow>
                    );
                  })
                  }

              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={orders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
    </Grid>
    )
  }

}



function OrderCard() {
  
  return (
      <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
        <Card variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <PrintOrderData />          
            <Link to="/add" className="btn-dark">
                New Order
            </Link>
        </Card>
      </Container>
  )
}

export default OrderCard;