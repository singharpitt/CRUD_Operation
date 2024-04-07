const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router=require('./routes/route_assign')  
//const {mogourl} = require('./keys');
const app = express();
const port = 3000;

mongoose.connect("mongodb+srv://arpitt3083:ow4QJGUoxQdNvfSm@cluster0.ldphgng.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", 
  {useNewUrlParser: true,
  useUnifiedTopology: true});

const User = require('./models/User');
const requireAuth = require('./middleware/tokenget');
const routes = require('./routes/route_assign');
const tokenget = require('./middleware/tokenget');
app.use(bodyParser.json());
app.use(routes);


mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('Error connecting to MongoDB', err);
});



app.get('/',tokenget, (req, res) => {
  res.send(`Your email: ${req.user.email}`);
  //res.send(`Your password: ${req.user.password}`)
});
app.use('/auth',router)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})