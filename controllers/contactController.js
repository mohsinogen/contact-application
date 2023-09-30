import asyncHandler from "express-async-handler";
import Contact from "../models/contactModel.js";
import QRCode from "qrcode";

/**
 * This method takes values in request body
 * and saves the contact
 * @route POST /api/contacts
 * @body { profile, firstname, lastname, number, gender, address }.
 * @returns {object} - A a success response.
 * @throws {error} - If failes to save contact.
 * @access Private
 */
const createContact = asyncHandler(async (req, res) => {
  const { profile, firstname, lastname, number, gender, address } = req.body;
  const createdBy = req.user._id;

  if (!firstname || !number) {
    res.status(400);
    throw new Error("Please send valid data");
  }

  const contactExists = await Contact.findOne({ number });

  if (contactExists) {
    res.status(400);
    throw new Error("Contact with this number already exists");
  }

  const contact = await Contact.create({
    profile,
    firstname,
    lastname,
    number,
    gender,
    address,
    createdBy,
  });

  await QRCode.toFile(`qrcodes/${contact._id}.png`,process.env.FRONTEND_URL + `/contacts/${contact._id}`)

  contact.qrcode = `${contact._id}.png`;

  await contact.save();

  if (contact) {
    res.status(201).json({
      code: 201,
      remark: "contact created",
    });
  } else {
    res.status(400);
    throw new Error("Invalid contact data");
  }
});



/**
 * This method return list of all contacts
 * and saves the contact
 * @route POST /api/contacts
 * @body { profile, firstname, lastname, number, gender, address }.
 * @returns {object} - A a success response.
 * @throws {error} - If failes to save contact.
 * @access Public
 */
const getContactList = asyncHandler(async (req, res) => {
  const pageSize = parseInt(req.query.pageSize) || 10;
  const pageNumber = parseInt(req.query.pageNumber) || 1;

  try {
    const totalRecords = await Contact.countDocuments();
    const totalPages = Math.ceil(totalRecords / pageSize);

    if (pageNumber < 1 || pageNumber > totalPages) {
      return res.status(400).json({ code: 400, remark: "Invalid page number or page size" });
    }

    const skip = (pageNumber - 1) * pageSize;

    const contacts = await Contact.find().skip(skip).limit(pageSize);

    res.status(200).json({
      code: 200,
      remark: "success",
      data: {
        contactList: contacts,
        totalRecords,
        totalPages
      },
    });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});


/**
 * This method return single contact details
 * @route GET /api/contacts/:contactId
 * @returns {object} - A a success response.
 * @throws {error} - If failes to get contact.
 * @access Public
 */
const getContactDetails = asyncHandler(async (req, res) => {
  try {
    const contactId = req.params.contactId;

    if (!contactId) {
      res.status(400);
      throw new Error("No contact id provided");
    }

    const contact = await Contact.findById(contactId);

    res.status(200).json({
      code: 200,
      remark: "success",
      data: contact,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});


/**
 * This method takes values in request body
 * and updates the contact
 * @route PUT /api/contacts
 * @body { profile, firstname, lastname, number, gender, address }.
 * @returns {object} - A a success response.
 * @throws {error} - If failes to edit contact.
 * @access Private
 */
const editContact = asyncHandler(async (req, res) => {
  const { profile, firstname, lastname, number, gender, address } = req.body;
  const contactId = req.params.contactId;

  if (!firstname || !number) {
    res.status(400);
    throw new Error("Please send valid data");
  }

  const contact = await Contact.findById(contactId);

  if (contact.createdBy.toString() != req.user._id.toString()) {
    res.status(400);
    throw new Error("Only owner can edit this contact");
  }

  contact.profile = profile || contact.profile;
  contact.firstname = firstname || contact.firstname;
  contact.lastname = lastname || contact.lastname;
  contact.number = number || contact.number;
  contact.gender = gender || contact.gender;
  contact.address = address || contact.address;

  await contact.save();

  if (contact) {
    res.status(201).json({
      code: 201,
      remark: "contact updated",
    });
  } else {
    res.status(400);
    throw new Error("Invalid contact data");
  }
});


export { createContact , getContactList, getContactDetails, editContact};
