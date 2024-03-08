const authMW = require("../middleware/auth.mw")

const orderController = require("../controllers/order.controller")

module.exports = (app) => {
    app.post("/ecomm/api/v1/order/create", orderController.addOrder)  
    app.get("/ecomm/api/v1/order/count", orderController.count) 

    app.get("/ecomm/api/v1/order/get/:id", orderController.getOrderbyId) 
    app.get("/ecomm/api/v1/order/get", orderController.getOrder) 

    app.get("/ecomm/api/v1/order/totalSales", orderController.totalSales)
    app.get("/ecomm/api/v1/order/get/user/:id", orderController.userOrder)

    app.put("/ecomm/api/v1/order/update/:id", orderController.updateOrder) 
    app.delete("/ecomm/api/v1/order/delete/:id", orderController.deleteOrder) 
}