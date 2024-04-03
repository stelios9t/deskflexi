import express from "express";
import Croom from "../model/croom.js";
import { param, validationResult } from "express-validator";
import verifyToken from "../middleware/auth.js";

const router = express.Router();
router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Conference Room ID is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id = req.params.id.toString();
    try {
      const croom = await Croom.findById(id);
      res.json(croom);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching croom" });
    }
  }
);

const constructSearchQuery = (queryParams) => {
  let constructedQuery = {};

  if (queryParams.croomNumber !== undefined && queryParams.croomNumber !== "") {
    constructedQuery.croomNumber = parseInt(queryParams.croomNumber);
  }

  return constructedQuery;
};

export default router;
