import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createContact, deleteContact, editContact, getContactDetails, getContactList } from "../controllers/contactController.js";


const router = express.Router();

router.route("/").post(protect, createContact).get(getContactList);
router.route("/:contactId").get(getContactDetails).put(protect, editContact).delete(protect, deleteContact)

export default router;