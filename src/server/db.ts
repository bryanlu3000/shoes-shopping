import { MongoClient } from "mongodb";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.CONNECTIONSTRING!;
const client = new MongoClient(uri);
const dbShop = client.db("shoe-shopping");
const itemsCollection = dbShop.collection("items");
const categoriesCollection = dbShop.collection("shoesCategories");

// To run a text search query, need to create a text index on the field to query.
// Here we use regex instead to query on name field.
// itemsCollection.createIndex({ name: "text" });

const app = express();
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

//////////////////////////////////////////////////////////////////////////////
// CORS setting
const allowedOrigins = ["http://localhost:5173"];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Cross Origin Resource Sharing

// Use body parser for POST and PUT request
// app.use(express.urlencoded({ extended: false }));

//////////////////////////////////////////////////////////////////////////////
// Get store items
// req.query: {limit, page, category, nameQuery}
app.get("/api/items", async (req, res) => {
  interface Query {
    category: string;
    name: {
      $regex: string;
    };
  }

  try {
    // await client.connect();

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const { category, nameQuery } = req.query;

    const query: Query = {} as Query;

    // If category exists in the query from the frontend and is not 'all'
    if (category && category !== "all") {
      query.category = category as string;
    }

    // If nameQuery exists in the query from the frontend and is not empty
    if (nameQuery && nameQuery !== "") {
      query.name = { $regex: nameQuery as string };
    }

    const result = await itemsCollection
      .find(query)
      .sort({ name: 1 }) // sort name in ascending order
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const itemsCount = await itemsCollection.countDocuments(query);
    res.status(200).json({ itemsCount, result });
  } catch (err) {
    console.error(err);
    res.json("Errors! Try again later.");
  }
  // finally {
  //   await client.close();
  // }
});

//////////////////////////////////////////////////////////////////////////////
// Get featured items
// There are only 3-4 featured items in database, no need to add pagination.
app.get("/api/items/featured", async (req, res) => {
  try {
    const result = await itemsCollection
      .find({ featured: true })
      .sort({ name: 1 })
      .toArray();
    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    res.json("Errors! Try again later.");
  }
});

//////////////////////////////////////////////////////////////////////////////
// Get categories
app.get("/api/categories", async (req, res) => {
  try {
    const result = await categoriesCollection
      .find({})
      .sort({ name: 1 })
      .toArray();
    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    res.json("Errors! Try again later.");
  }
});
