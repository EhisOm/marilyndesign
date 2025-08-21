// const path = require('path');
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const nodemailer = require('nodemailer');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')));

// // Customer schema/model
// const customerSchema = new mongoose.Schema({
//     title: String,
//     name: String,
//     username: { type: String, unique: true },
//     email: { type: String, unique: true },
//     password: String,
//     phone: String,
//     dob: Date,
//     resetToken: String,
//     resetTokenExpiration: Date,
// });

// const Customer = mongoose.model('Customer', customerSchema);

// // Payment schema/model
// const paymentSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
//     paymentId: { type: String, unique: true },
//     status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
//     createdAt: { type: Date, default: Date.now }
// });

// const Payment = mongoose.model('Payment', paymentSchema);

// // Auth middleware to protect routes
// const authenticateToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

//     if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) return res.status(403).json({ message: 'Token is not valid' });
//         req.user = user;
//         next();
//     });
// };

// // Nodemailer transporter config (reuse inside route)
// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });

// // ADMIN HANDLES PAYMENTS 
// // app.get('/admin/approve-payment', async (req, res) => {
// //     const { paymentId, secret } = req.query;
// //     if (secret !== process.env.APPROVAL_SECRET) {
// //         return res.status(403).send('Access denied');
// //     }
// //     if (!paymentId) {
// //         return res.status(400).send('Missing paymentId');
// //     }

// //     try {
// //         const payment = await Payment.findOne({ paymentId });
// //         if (!payment) {
// //             return res.status(404).send('Payment not found');
// //         }

// //         payment.status = 'approved';
// //         await payment.save();

// //         res.send(`Payment ${paymentId} approved!`);
// //     } catch (error) {
// //         console.error('Error approving payment:', error);
// //         res.status(500).send('Server error');
// //     }
// // });

// // API endpoint for frontend to get payment status for logged in user
// app.get('/api/payment-status', authenticateToken, async (req, res) => {
//     try {
//         const payment = await Payment.findOne({ userId: req.user.userId }).sort({ createdAt: -1 });
//         if (!payment) {
//             return res.json({ status: 'none' });
//         }
//         res.json({ status: payment.status });
//     } catch (error) {
//         console.error('Error fetching payment status:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // Start server function
// const startServer = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log('✅ MongoDB connected');

//         // Register
//         app.post('/api/register', async (req, res) => {
//             const { title, name, username, email, password, phone, dob } = req.body;

//             if (!username || !email || !password) {
//                 return res.status(400).json({ message: 'Username, email, and password are required' });
//             }

//             try {
//                 const existingUser = await Customer.findOne({ $or: [{ username }, { email }] });
//                 if (existingUser) {
//                     return res.status(400).json({ message: 'Username or email already exists' });
//                 }

//                 const hashedPassword = await bcrypt.hash(password, 12);

//                 const customer = new Customer({
//                     title,
//                     name,
//                     username,
//                     email,
//                     password: hashedPassword,
//                     phone,
//                     dob,
//                 });

//                 await customer.save();
//                 res.status(201).json({ message: 'User registered successfully' });
//             } catch (err) {
//                 console.error('Register error:', err);
//                 res.status(500).json({ message: 'Server error', error: err.message });
//             }
//         });

//         // Serve register page
//         app.get('/register', (req, res) => {
//             res.sendFile(path.join(__dirname, 'public', 'register.html'));
//         });

//         // Login
//         app.post('/api/login', async (req, res) => {
//             const { usernameOrEmail, password } = req.body;

//             try {
//                 const user = await Customer.findOne({
//                     $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
//                 });
//                 if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//                 const isMatch = await bcrypt.compare(password, user.password);
//                 if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//                 const token = jwt.sign({ userId: user._id, fullName: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

//                 res.json({
//                     token,
//                     user: {
//                         id: user._id,
//                         username: user.username,
//                         email: user.email,
//                         name: user.name,
//                         title: user.title,
//                         phone: user.phone || '',
//                         dob: user.dob || ''
//                     }
//                 });
//             } catch (err) {
//                 console.error(err);
//                 res.status(500).json({ message: 'Server error' });
//             }
//         });

//         // NEW TO DETECT HOST AUTOMATICALLY 
//         // Confirm payment route with email notification including approval link
//         app.post('/api/confirm-payment', authenticateToken, async (req, res) => {
//             try {
//                 const customer = await Customer.findById(req.user.userId).select('name email');
//                 if (!customer) {
//                     return res.status(404).json({ message: 'User not found' });
//                 }

//                 // Generate unique payment ID
//                 const paymentId = Date.now().toString() + '-' + req.user.userId;

//                 // Save payment to DB
//                 await Payment.create({ userId: customer._id, paymentId, status: 'pending' });

//                 // Dynamically detect domain for approval link
//                 const baseUrl = `${req.protocol}://${req.get('host')}`;
//                 const approvalLink = `${baseUrl}/admin/approve-payment?paymentId=${paymentId}&secret=${process.env.APPROVAL_SECRET}`;

//                 // Send email notification to admin
//                 const mailOptions = {
//                     from: process.env.EMAIL_USER,
//                     to: "ehisomijie1@gmail.com", // admin notification email
//                     subject: "Payment Confirmation",
//                     text: `Customer ${customer.name} has confirmed a payment.\nApprove here: ${approvalLink}`,
//                 };

//                 await transporter.sendMail(mailOptions);

//                 res.json({ message: 'Payment confirmation notification sent.', approvalLink });
//             } catch (err) {
//                 console.error('Confirm payment error:', err);
//                 res.status(500).json({ message: 'Server error' });
//             }
//         });


//         // Get profile
//         app.get('/api/profile', authenticateToken, async (req, res) => {
//             try {
//                 const customer = await Customer.findById(req.user.userId).select('-password -resetToken -resetTokenExpiration');
//                 if (!customer) return res.status(404).json({ message: 'User not found' });
//                 res.json(customer);
//             } catch (err) {
//                 console.error('Profile fetch error:', err);
//                 res.status(500).json({ message: 'Server error' });
//             }
//         });

//         // CHANGING PAYMENT STATUS FROM WAITING TO RECEIVED 

//         app.get('/api/payment-status/:paymentId', authenticateToken, async (req, res) => {
//             try {
//                 const payment = await Payment.findOne({ paymentId: req.params.paymentId });
//                 if (!payment) return res.status(404).json({ message: 'Payment not found' });

//                 res.json({ status: payment.status });
//             } catch (error) {
//                 console.error(error);
//                 res.status(500).json({ message: 'Server error' });
//             }
//         });


//         // Update profile
//         app.put('/api/profile', authenticateToken, async (req, res) => {
//             const { title, name, phone, dob } = req.body;

//             try {
//                 const updatedCustomer = await Customer.findByIdAndUpdate(
//                     req.user.userId,
//                     { title, name, phone, dob },
//                     { new: true, runValidators: true }
//                 ).select('-password -resetToken -resetTokenExpiration');

//                 if (!updatedCustomer) return res.status(404).json({ message: 'User not found' });
//                 res.json({ message: 'Profile updated successfully', user: updatedCustomer });
//             } catch (err) {
//                 console.error('Profile update error:', err);
//                 res.status(500).json({ message: 'Server error' });
//             }
//         });

//         // Admin check middleware
//         function isAdmin(req, res, next) {
//             if (req.user && req.user.role === 'admin') {
//                 next();
//             } else {
//                 res.status(403).send('Access Denied');
//             }
//         }

//         // Admin page route
//         app.get('/admin', isAdmin, (req, res) => {
//             res.sendFile(path.join(__dirname, 'admin.html'));
//         });

//         // Protected test route
//         app.get('/api/protected', authenticateToken, (req, res) => {
//             res.json({ message: `Hello user ${req.user.userId}, you are authorized!` });
//         });

//         // Logout (stateless JWT, client deletes token)
//         app.post('/api/logout', (req, res) => {
//             res.json({ message: 'User signed out successfully' });
//         });

//         // Password reset request
//         app.post('/api/reset-password-request', async (req, res) => {
//             const { email } = req.body;
//             try {
//                 const user = await Customer.findOne({ email });
//                 if (!user) return res.status(400).json({ message: 'No user with that email' });

//                 const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

//                 user.resetToken = resetToken;
//                 user.resetTokenExpiration = Date.now() + 15 * 60 * 1000;
//                 await user.save();

//                 res.json({ message: 'Password reset link sent (simulated)', resetToken });
//             } catch (err) {
//                 res.status(500).json({ message: 'Server error' });
//             }
//         });

//         // ADMIN APPROVAL PAGE 
//         app.get('/admin/approve-payment', async (req, res) => {
//             const { paymentId, secret } = req.query;

//             if (secret !== process.env.APPROVAL_SECRET) {
//                 return res.status(403).send(`
//       <html>
//         <head><title>Access Denied</title></head>
//         <body style="font-family: Arial; text-align:center; padding: 50px;">
//           <h1>Access Denied</h1>
//           <p>You do not have permission to approve payments.</p>
//         </body>
//       </html>
//     `);
//             }

//             if (!paymentId) {
//                 return res.status(400).send(`
//       <html>
//         <head><title>Bad Request</title></head>
//         <body style="font-family: Arial; text-align:center; padding: 50px;">
//           <h1>Bad Request</h1>
//           <p>Missing paymentId parameter.</p>
//         </body>
//       </html>
//     `);
//             }

//             try {
//                 const payment = await Payment.findOne({ paymentId });

//                 if (!payment) {
//                     return res.status(404).send(`
//         <html>
//           <head><title>Payment Not Found</title></head>
//           <body style="font-family: Arial; text-align:center; padding: 50px;">
//             <h1>Payment Not Found</h1>
//             <p>No payment matches the given ID.</p>
//           </body>
//         </html>
//       `);
//                 }

//                 payment.status = 'approved';
//                 await payment.save();

//                 return res.send(`
//       <html>
//         <head>
//           <title>Payment Approved</title>
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               text-align: center;
//               padding: 50px;
//               background-color: #f0f8ff;
//               color: #333;
//             }
//             h1 {
//               color: #4caf50;
//             }
//             p {
//               font-size: 18px;
//             }
//             a {
//               display: inline-block;
//               margin-top: 20px;
//               text-decoration: none;
//               color: white;
//               background-color: #4caf50;
//               padding: 10px 20px;
//               border-radius: 5px;
//             }
//             a:hover {
//               background-color: #45a049;
//             }
//           </style>
//         </head>
//         <body>
//           <h1>✅ Payment Approved!</h1>
//           <p>Payment with ID <strong>${paymentId}</strong> has been successfully approved.</p>
//           <a href="/">Go back to Dashboard</a>
//         </body>
//       </html>
//     `);
//             } catch (error) {
//                 console.error('Error approving payment:', error);
//                 return res.status(500).send(`
//       <html>
//         <head><title>Server Error</title></head>
//         <body style="font-family: Arial; text-align:center; padding: 50px;">
//           <h1>Server Error</h1>
//           <p>Something went wrong while approving the payment.</p>
//         </body>
//       </html>
//     `);
//             }
//         });



//         // Password reset
//         app.post('/api/reset-password', async (req, res) => {
//             const { resetToken, newPassword } = req.body;

//             try {
//                 if (!resetToken) return res.status(400).json({ message: 'No token provided' });

//                 const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
//                 const user = await Customer.findOne({
//                     _id: decoded.userId,
//                     resetToken,
//                     resetTokenExpiration: { $gt: Date.now() },
//                 });

//                 if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

//                 user.password = await bcrypt.hash(newPassword, 12);
//                 user.resetToken = undefined;
//                 user.resetTokenExpiration = undefined;
//                 await user.save();

//                 res.json({ message: 'Password reset successfully' });
//             } catch (err) {
//                 console.error(err);
//                 res.status(400).json({ message: 'Invalid or expired token' });
//             }
//         });

//         const PORT = process.env.PORT || 5000;
//         app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));

//     } catch (err) {
//         console.error('❌ Failed to connect to MongoDB:', err);
//         process.exit(1);
//     }
// };

// startServer();










// NEW SERVER JS CODE 

const path = require('path');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Customer schema/model
const customerSchema = new mongoose.Schema({
    title: String,
    name: String,
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    phone: String,
    dob: Date,
    address: String,
    street: String,
    city: String,
    zip: String,
    state: String,
    country: String,
    resetToken: String,
    resetTokenExpiration: Date,
});

const Customer = mongoose.model('Customer', customerSchema);

// Payment schema/model
const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    paymentId: { type: String, unique: true },
    status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);

// Auth middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token is not valid' });
        req.user = user;
        next();
    });
};

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API: get payment status for logged-in user
app.get('/api/payment-status', authenticateToken, async (req, res) => {
    try {
        const payment = await Payment.findOne({ userId: req.user.userId }).sort({ createdAt: -1 });
        if (!payment) return res.json({ status: 'none' });
        res.json({ status: payment.status });
    } catch (error) {
        console.error('Error fetching payment status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Start server function
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected');

        // Register
        app.post('/api/register', async (req, res) => {
            const { title, name, username, email, password, phone, dob, address, street, city, zip, state, country } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({ message: 'Username, email, and password are required' });
            }

            try {
                const existingUser = await Customer.findOne({ $or: [{ username }, { email }] });
                if (existingUser) {
                    return res.status(400).json({ message: 'Username or email already exists' });
                }

                const hashedPassword = await bcrypt.hash(password, 12);

                const customer = new Customer({
                    title,
                    name,
                    username,
                    email,
                    password: hashedPassword,
                    phone,
                    dob,
                    address,
                    street,
                    city,
                    zip,
                    state,
                    country
                });
                await customer.save();
                res.status(201).json({ message: 'User registered successfully' });
            } catch (err) {
                console.error('Register error:', err);
                res.status(500).json({ message: 'Server error', error: err.message });
            }
        });

        // Serve register page
        app.get('/register', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'register.html'));
        });

        // Login
        app.post('/api/login', async (req, res) => {
            const { usernameOrEmail, password } = req.body;
            try {
                const user = await Customer.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] });
                if (!user) return res.status(400).json({ message: 'Invalid credentials' });

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

                const token = jwt.sign(
                    { userId: user._id, fullName: user.name, role: user.role || 'user' },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                res.json({
                    token,
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        name: user.name,
                        title: user.title,
                        phone: user.phone || '',
                        dob: user.dob || '',
                        address: user.address || '',
                        street: user.street || '',
                        city: user.city || '',
                        zip: user.zip || '',
                        state: user.state || '',
                        country: user.country || ''
                    }
                });
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Server error' });
            }
        });

        // Confirm payment
        app.post('/api/confirm-payment', authenticateToken, async (req, res) => {
            try {
                const customer = await Customer.findById(req.user.userId).select('name email');
                if (!customer) return res.status(404).json({ message: 'User not found' });

                const paymentId = Date.now().toString() + '-' + req.user.userId;
                await Payment.create({ userId: customer._id, paymentId, status: 'pending' });

                const baseUrl = `${req.protocol}://${req.get('host')}`;
                const approvalLink = `${baseUrl}/admin/approve-payment?paymentId=${paymentId}&secret=${process.env.APPROVAL_SECRET}`;

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: "ehisomijie1@gmail.com",
                    subject: "Payment Confirmation",
                    text: `Customer ${customer.name} has confirmed a payment.\nApprove here: ${approvalLink}`,
                };
                await transporter.sendMail(mailOptions);

                res.json({ message: 'Payment confirmation notification sent.', approvalLink });
            } catch (err) {
                console.error('Confirm payment error:', err);
                res.status(500).json({ message: 'Server error' });
            }
        });
        // Admin approves payment
        app.get('/admin/approve-payment', async (req, res) => {
            const { paymentId, secret } = req.query;
            if (secret !== process.env.APPROVAL_SECRET) return res.status(403).send('Forbidden');

            try {
                const payment = await Payment.findOne({ paymentId });
                if (!payment) return res.status(404).send('Payment not found');

                payment.status = 'approved';
                await payment.save();

                res.send('Payment approved successfully!');
            } catch (err) {
                console.error('Approve payment error:', err);
                res.status(500).send('Server error');
            }
        });

        // Endpoint for front-end to poll payment status
        app.get('/api/payment-status/:paymentId', authenticateToken, async (req, res) => {
            try {
                const payment = await Payment.findOne({ paymentId: req.params.paymentId });
                if (!payment) return res.status(404).json({ message: 'Payment not found' });

                res.json({ status: payment.status });
            } catch (err) {
                console.error('Check payment status error:', err);
                res.status(500).json({ message: 'Server error' });
            }
        });



        // Get profile
        app.get('/api/profile', authenticateToken, async (req, res) => {
            try {
                const customer = await Customer.findById(req.user.userId).select('-password -resetToken -resetTokenExpiration');
                if (!customer) return res.status(404).json({ message: 'User not found' });
                res.json(customer);
            } catch (err) {
                console.error('Profile fetch error:', err);
                res.status(500).json({ message: 'Server error' });
            }
        });

        // Update profile
        app.put('/api/profile', authenticateToken, async (req, res) => {
            const { title, name, phone, dob, address, street, city, zip, state, country } = req.body;
            try {
                const updatedCustomer = await Customer.findByIdAndUpdate(
                    req.user.userId,
                    { title, name, phone, dob, address, street, city, zip, state, country },
                    { new: true, runValidators: true }
                ).select('-password -resetToken -resetTokenExpiration');
                if (!updatedCustomer) return res.status(404).json({ message: 'User not found' });
                res.json({ message: 'Profile updated successfully', user: updatedCustomer });
            } catch (err) {
                console.error('Profile update error:', err);
                res.status(500).json({ message: 'Server error' });
            }
        });

        // Admin middleware
        function isAdmin(req, res, next) {
            if (req.user && req.user.role === 'admin') next();
            else res.status(403).send('Access Denied');
        }

        // Admin page
        app.get('/admin', isAdmin, (req, res) => {
            res.sendFile(path.join(__dirname, 'admin.html'));
        });

        // Admin approve payment
        app.get('/admin/approve-payment', async (req, res) => {
            const { paymentId, secret } = req.query;
            if (secret !== process.env.APPROVAL_SECRET) return res.status(403).send('Access Denied');
            if (!paymentId) return res.status(400).send('Missing paymentId');

            try {
                const payment = await Payment.findOne({ paymentId });
                if (!payment) return res.status(404).send('Payment not found');

                payment.status = 'approved';
                await payment.save();

                res.send(`
                    <html>
                        <head><title>Payment Approved</title></head>
                        <body>
                            <h1>✅ Payment Approved!</h1>
                            <p>Payment with ID <strong>${paymentId}</strong> has been approved.</p>
                            <a href="/">Go back to Dashboard</a>
                        </body>
                    </html>
                `);
            } catch (error) {
                console.error('Error approving payment:', error);
                res.status(500).send('Server error');
            }
        });

        // Password reset request
        app.post('/api/reset-password-request', async (req, res) => {
            const { email } = req.body;
            try {
                const user = await Customer.findOne({ email });
                if (!user) return res.status(400).json({ message: 'No user with that email' });

                const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
                user.resetToken = resetToken;
                user.resetTokenExpiration = Date.now() + 15 * 60 * 1000;
                await user.save();

                res.json({ message: 'Password reset link sent (simulated)', resetToken });
            } catch (err) {
                res.status(500).json({ message: 'Server error' });
            }
        });

        // Password reset
        app.post('/api/reset-password', async (req, res) => {
            const { resetToken, newPassword } = req.body;
            try {
                if (!resetToken) return res.status(400).json({ message: 'No token provided' });
                const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

                const user = await Customer.findOne({
                    _id: decoded.userId,
                    resetToken,
                    resetTokenExpiration: { $gt: Date.now() }
                });

                if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

                user.password = await bcrypt.hash(newPassword, 12);
                user.resetToken = undefined;
                user.resetTokenExpiration = undefined;
                await user.save();

                res.json({ message: 'Password reset successfully' });
            } catch (err) {
                console.error(err);
                res.status(400).json({ message: 'Invalid or expired token' });
            }
        });

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));

    } catch (err) {
        console.error('❌ Failed to connect to MongoDB:', err);
        process.exit(1);
    }
};

startServer();
