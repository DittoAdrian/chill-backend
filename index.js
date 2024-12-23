import express from 'express'
import router from './src/routes/userRouter.js';
import movieRouter from './src/routes/movieRouter.js';
const app = express();
app.use(express.json());

app.use(router);
app.use(movieRouter);

// ========== Error Handler ==========
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

// ========== Listener ==========
app.listen(3030,()=>{
    console.log('serverunning on port 3030')
})
