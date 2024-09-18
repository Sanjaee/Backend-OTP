const express = require("express")
const cors = require("cors")
const authRoutes = require("./src/routes/authRoutes")
const storeRoutes = require("./src/routes/storeRoutes")

const app = express()


app.use(cors())
app.use(express.json())

app.use("/auth", authRoutes)
app.use("/store", storeRoutes)


const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})