
const authMW = require("../middleware/auth.mw")

const categoryController = require("../controllers/category.controller")
module.exports = (app) => {
    app.post("/ecomm/api/v1/category/create", [authMW.verifyToken, authMW.isAdmin], categoryController.createCategory)
    app.get("/ecomm/api/v1/category/get/:id", [authMW.verifyToken, authMW.isAdmin], categoryController.getCategory)
    app.get("/ecomm/api/v1/category/getAll", [authMW.verifyToken, authMW.isAdmin], categoryController.getAllCategory)
    app.put("/ecomm/api/v1/category/update/:id", [authMW.verifyToken, authMW.isAdmin], categoryController.updateCategory)
    app.delete("/ecomm/api/v1/category/delete/:id", [authMW.verifyToken, authMW.isAdmin], categoryController.deleteCategory)
}
