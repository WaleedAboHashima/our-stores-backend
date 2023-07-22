const router = require("express").Router();
const {
  GetStores,
  GetStates,
  GetNearStores,
  GetOrderHistory,
  AddOrder,
  GetAllStoreProductsAndCategory,
  GetProduct,
  AddToCart,
  GetCart,
  DeleteCart,
  DeleteProductFromCart,
  ChangeQuantity,
} = require("../controllers/userController");

//General
router.get("/states", GetStates);

//Stores
router.get("/nearstores", GetNearStores);
router.post("/allstores", GetStores);

//Products
router.get("/allproducts/:storeId", GetAllStoreProductsAndCategory);
router.get("/product/:productId", GetProduct);
router.get("/product/:productId", GetProduct);

//Orders
router.get("/history/", GetOrderHistory);
router.post("/addOrder", AddOrder);

//Carts
router.post("/addtocart", AddToCart);
router.get("/getcart", GetCart);
router.delete("/deletecart/:cartId", DeleteCart);
router.delete("/deleteproduct/:productId", DeleteProductFromCart);
router.post("/changequantity/:productId", ChangeQuantity);

//Feedback
module.exports = router;
