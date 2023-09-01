const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3003;
require('dotenv').config();

const authRouter = require('./routes/authroutes.js');
const cartRoutes = require('./routes/cartRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const utilRoutes = require('./routes/utilRoutes.js');
const appointmentRoutes = require('./routes/appointmentRoutes.js');
const communacationRoutes = require('./routes/communicationRoutes.js');
// const notificationRoutes = require('./routes/notificationRoutes.js');
const medicalRecordsRoutes = require('./routes/medicalRecordsRoutes.js');
const medicalReservationRoutes = require('./routes/medicalReservationRoutes.js')
const roomReservationRoutes = require('./routes/roomReservationRoutes.js');
const surveyRoutes = require('./routes/surveyRoutes.js')
const doctorRoutes = require('./routes/doctorRoutes.js')
const roomRoutes = require('./routes/roomRoutes');
const floorRoutes = require('./routes/floorRoutes');

app.use(express.json());
app.use(cors());

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.log(err);
    process.exit(1);
  });

app.use("/auth", authRouter);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/products", productRoutes);
app.use("/util", utilRoutes);
app.use("/appointment", appointmentRoutes);
app.use("/communication", communacationRoutes);
// app.use("/notification", notificationRoutes);
app.use("/medical-records", medicalRecordsRoutes);
app.use("/medical-reservation", medicalReservationRoutes);
app.use("/room-reservation", roomReservationRoutes)
app.use("/survey", surveyRoutes)
app.use("/doctor", doctorRoutes)
app.use("/room", roomRoutes)
app.use("/floor", floorRoutes)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
