import express from "express";
import Desk from "../model/desk.js";
const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    console.log("Received query parameters:", req.query); // Log the received query parameters
    const query = constructSearchQuery(req.query);
    console.log("Constructed query:", query); // Log the constructed query

    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pageSize;

    const desks = await Desk.find(query).skip(skip).limit(pageSize);
    const total = await Desk.countDocuments(query);
    const response = {
      data: desks,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };
    res.json(response);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

const constructSearchQuery = (queryParams) => {
  let constructedQuery = {};

  if (queryParams.deskNumber !== undefined && queryParams.deskNumber !== "") {
    constructedQuery.deskNumber = parseInt(queryParams.deskNumber);
  }

  if (queryParams.amenities) {
    constructedQuery.amenities = {
      $all: Array.isArray(queryParams.amenities)
        ? queryParams.amenities
        : [queryParams.amenities],
    };
  }

  return constructedQuery;
};

export default router;
