// This will be the starting file of our project

const express = require("express")  //function
const app = express()
const mongoose = require("mongoose")

const server_config = require("./configs/server.config") //8888
const db_config = require("./configs/db.config") //127.0.0.1

const user_model = require("./models/user.model") //schema of model
const category_model = require("./models/category.model") //schema of category
const product_model = require("./models/product.model") //schema of product
// const cart_model = require("./models/cart.model") //schema of cart


const bcrypt = require("bcryptjs")


app.use(express.json())  //read object receive as json object


//working with mongoose
mongoose.connect(db_config.db_url)

const db = mongoose.connection
db.on("error", () => {
    console.log("Database not connected")
})
db.once("open", () => {
    console.log("Database Connected")
    init()
})

async function init() {
    try {
        const user = await user_model.findOne({ usertype: "Admin" })

        if (user) {
            console.log("Admin is already present")
            return
        }
    }
    catch (err) {
        console.log("Error while receiving data")
    }
    try {
        const user = await user_model.create({
            name: "Ashwani",
            userId: "ashwani29",
            email: "ashwanik2907@gmail.com",
            usertype: "Admin",
            password: bcrypt.hashSync("Welcome", 8)
        })
        console.log("Admin Created", user)
    }
    catch (err) {
        console.log("Error while creating admin", err)
    }
}
//stich the route to the server (connecting route and server)
require("./routers/auth.routers")(app)
require("./routers/category.routers")(app)
require("./routers/product.routers")(app)
require("./routers/order.routers")(app)


// Start the server
app.listen(server_config.PORT, () => {
    console.log("Server Started")
})
