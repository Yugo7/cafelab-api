const express = require('express')
const app = express()
const PORT = 4000


app.get('/home', (req, res) => {
    res.status(200).json('Welcome, your app is working well');
})


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

const userRouter = require('./routes/user.router')

app.use("/api", userRouter)

app.listen(process.env.PORT, () => console.log("Server is running on port 5000"))
// Export the Express API
module.exports = app