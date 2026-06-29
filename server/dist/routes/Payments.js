"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the required modules
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const payments_1 = require("../controllers/payments");
const auth_1 = require("../middleware/auth");
router.post("/capturePayment", auth_1.auth, auth_1.isStudent, payments_1.capturePayment);
router.post("/verifyPayment", auth_1.auth, auth_1.isStudent, payments_1.verifyPayment);
router.post("/sendPaymentSuccessEmail", auth_1.auth, auth_1.isStudent, payments_1.sendPaymentSuccessEmail);
// router.post("/verifySignature", verifySignature)
exports.default = router;
