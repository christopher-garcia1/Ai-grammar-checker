import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';


const app = express()
const port = 3000
 
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true })) 

app.get('/', (req, res) => {
    res.render('index')
}) 

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})