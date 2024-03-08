const authMW = require("../middleware/auth.mw")

const productController = require("../controllers/product.controller")

module.exports = (app) => {
    app.post("/ecomm/api/v1/product/create", [authMW.verifyToken, authMW.isAdmin], productController.createProduct)
    app.get("/ecomm/api/v1/product/count", [authMW.verifyToken, authMW.isAdmin], productController.count)

    app.get("/ecomm/api/v1/product/get/:id", [authMW.verifyToken, authMW.isAdmin], productController.getProduct)

    app.get("/ecomm/api/v1/product/getAll", [authMW.verifyToken, authMW.isAdmin], productController.getAllProduct)

    app.get("/ecomm/api/v1/product/getAllcat", [authMW.verifyToken, authMW.isAdmin], productController.getAllProductofCAT)
    
    app.get("/ecomm/api/v1/product/get/?categories=", [authMW.verifyToken, authMW.isAdmin], productController.getProductFilter)

    app.put("/ecomm/api/v1/product/update/:id", [authMW.verifyToken, authMW.isAdmin], productController.updateProduct)
    app.delete("/ecomm/api/v1/product/delete/:id", [authMW.verifyToken, authMW.isAdmin], productController.deleteProduct)
}