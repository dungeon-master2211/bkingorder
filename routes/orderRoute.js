import express from "express"
import { isAuthenticated, authorizeAdmin} from "../middlewares/isAuthenticated.js"
import { getAdminOrders, getOrderDetails, myOrders, paymentVerification, placeOrder, placeOrderOnline, processOrder } from "../controllers/orderController.js"
const router = express.Router()

router.post("/createorder",isAuthenticated,placeOrder)
router.post("/createorderonline",isAuthenticated,placeOrderOnline)
router.post("/paymentVerification",isAuthenticated,paymentVerification)
router.get("/myOrders",isAuthenticated,myOrders)
router.get("/order/:id",isAuthenticated,getOrderDetails)
// authorize admin middleware
router.get("/admin/orders",isAuthenticated,authorizeAdmin,getAdminOrders)

router.get("/admin/order/:id",isAuthenticated,authorizeAdmin,processOrder)



export default router