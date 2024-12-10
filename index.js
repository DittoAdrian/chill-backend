import express from 'express'
import router from './src/routes/userRouter.js';
const app = express();
app.use(express.json());

app.use(router);

// ========== Error Handler ==========
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

// ========== Listener ==========
app.listen(3030,()=>{
    console.log('serverunning on port 3030')
})
