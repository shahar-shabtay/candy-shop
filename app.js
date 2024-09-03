const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));


app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    req.user = { name: 'Ziv Klein' };  // Mock authenticated user
    next();
});

app.get('/adminPage', async (req, res) => {
    try {
        const customerId = req.user.name;
        const customer = { 
            name: 'Ziv Klein', 
            email: 'zivklein21@gmail.com', 
            password: 'Aa123456',
            birthday: '2002-08-21', 
            phone: '052-8221823', 
            address: {
                city: 'Candy City',
                street: 'Sugar Street',
                number: '1234'
            }
        };  // Mock customer data
        customer.addressString = `${customer.address.street} ${customer.address.number}, ${customer.address.city}`;

        res.render('account_details', { customer });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});