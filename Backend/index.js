const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51OpsB4SBT28mnxWh1KagTf6pKfDwDlmPiZqRi3ITX4ocFAQM3ddavuJWdGTX1LTgly1SLhtuLFHHrjwIQxO5gRlu00J3lwmBv3"
);
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

const PORT = process.env.PORT || 8080;

//mongodb connection
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("connected to the database"))
  .catch((err) => console.error("Error connecting to the database:", err));

//Schema
const userSchema = mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  number: {
    type: Number,
    unique: true,
  },
  password: String,
  city: String,
  pincode: {
    type: Number,
  },
});

//modal
const userModal = mongoose.model("user", userSchema);

const orderSchema = mongoose.Schema({
  userId: String,
  basket: Array,
  amount: Number,
  created: Date,
});

// Define MongoDB Model
const Order = mongoose.model("Order", orderSchema);
//api
app.get("/", (req, res) => {
  res.send("Server is running");
});

// API Endpoint to Fetch Orders for a User
app.get("/orders/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    // Query MongoDB to find orders for the specified user
    const orders = await Order.find({ userId: userId });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//payment
app.post("/payment/create", async (request, response) => {
  console.log("Request body:", request.body.name); // Log the request body

  const total = request.query.total;

  console.log("Payment Request Recieved for amount >>>", total);

  try {
    stripe.customers.create({
      name: request.body.name, // Assuming name is passed in the request body
      email: request.body.email, // Assuming email is passed in the request body
      phone: request.body.number,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total, //subunits of the currency
      currency: "INR",
      description: "Payment for your order 12:53",
    });
   
    response.status(201).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

// Order creation endpoint
app.post("/orders/create", async (request, response) => {
  const { userId, basket, amount, created } = request.body;

  try {
    // Here you can save the order details to your MongoDB database
    // For example:
    // const newOrder = new OrderModel({ userId, basket, amount, created });
    // await newOrder.save();
    console.log("Order created:", { userId, basket, amount, created });
    response.status(201).json({ message: "Order created successfully" });
  } catch (error) {
    console.error("Error creating order:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

//api signup
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { name, email, number, password, city, pincode } = req.body;

  try {
    const existingUser = await userModal.findOne({
      email: email,
      number: number,
    });
    if (existingUser) {
      res.send({
        message: "Email or Mobile number already exists",
        alert: false,
      });
    } else {
      const newUser = new userModal({
        name,
        email,
        number,
        password,
        city,
        pincode,
      });
      await newUser.save();

      // Create a Stripe customer with address information
      const stripeAddress = {
        line1: city, // Assuming city is the street address for simplicity
        city: city,
        country: "IN", // Assuming India for now
        postal_code: pincode,
      };
      const stripeCustomer = await stripe.customers.create({
        name: name,
        description: `Customer for ${email}`,
        email: email,
        phone: number, // Assuming number is the phone number
        address: stripeAddress,
      });

      res.send({ message: "Successfully signed up", alert: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

//login api
app.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  try {
    const existingUser = await userModal.findOne({
      email: email,
      password: password,
    });
    if (existingUser) {
      const DataSend = {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        number: existingUser.number,
        city: existingUser.city,
        pincode: existingUser.pincode,
      };
      console.log(DataSend);
      res.send({
        message: "Successfully logged in",
        alert: true,
        data: DataSend,
      });
    } else {
      res.send({
        message: "Email is not available, Please signup",
        alert: false,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log("Server is running at port : " + PORT));
