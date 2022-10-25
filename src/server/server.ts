import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { ObjectId } from "mongodb";
dotenv.config();

const client = require("./db.ts");
const app = express();

interface CustomRequestIT extends Request {
  email: string;
}

interface TokenPayloadIT extends JwtPayload {
  email: string;
}

// CORS setting
const allowedOrigins = ["http://127.0.0.1:5173"];
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin!) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin!)) {
    res.header("Access-Control-Allow-Credentials", "true");
  }
  next();
};

app.use(credentials); // Must before CORS! Handle options credentials check and fetch cookies credentials requirement.
app.use(cors(corsOptions)); // Cross Origin Resource Sharing
// app.use(express.static(path.join(__dirname, "build")));
// app.use(express.urlencoded({ extended: false }));
app.use(express.json()); //Enable to parse JSON in req.body
app.use(cookieParser()); // Middleware for cookies

//Select dataase
const dbTodos = client.db("todos-demo");
const todosCollection = dbTodos.collection("todos");

const dbUser = client.db("sign-in-demo");
const usersCollection = dbUser.collection("users");

//////////////////////////////////////////////////////////////////////////////
// Middleware to verify JWT accessToken
const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.sendStatus(401);
  }
  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as Secret,
    (err, decoded) => {
      if (err) return res.sendStatus(403); // invalid token
      (req as CustomRequestIT).email = (decoded as TokenPayloadIT).email;
      next();
    }
  );
};

//////////////////////////////////////////////////////////////////////////////
// Refresh JWT accessToken
app.get("/api/refresh", async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  try {
    // search the refreshToken
    const resultFind = await usersCollection.findOne({
      refreshToken,
    });
    if (!resultFind) {
      return res.sendStatus(403); // Forbidden
    }

    // evaluate jwt refreshToken
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as Secret,
      (err: any, decoded: any) => {
        if (err || resultFind.email !== decoded.email) {
          return res.sendStatus(403);
        }
        const accessToken = jwt.sign(
          { email: resultFind.email },
          process.env.ACCESS_TOKEN_SECRET as Secret,
          { expiresIn: "300s" }
        );
        res.json({ accessToken });
      }
    );
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

//////////////////////////////////////////////////////////////////////////////
// user sign in
app.post("/api/signin", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log(req.body);

  // check if the email and password are empty
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    // search the email
    const resultFind = await usersCollection.findOne({
      email,
    });

    if (!resultFind) {
      return res.sendStatus(401); // Unauthorized, email not found
    }

    // evaluate password
    const match = await bcrypt.compare(password, resultFind.password);
    if (match) {
      // create JWTs
      const accessToken = jwt.sign(
        { email: resultFind.email },
        process.env.ACCESS_TOKEN_SECRET as Secret,
        { expiresIn: "300s" }
      );

      const refreshToken = jwt.sign(
        { email: resultFind.email },
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: "1d" }
      );

      // Saving refreshToken with current user
      const resultRefreshToken = await usersCollection.updateOne(
        { email: { $eq: resultFind.email } },
        { $set: { refreshToken } }
      );

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      res
        .status(201)
        .json({ accessToken, message: `Login Success ===> ${email}` });
    } else {
      res.sendStatus(401); // Unauthorized, password not match
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

//////////////////////////////////////////////////////////////////////////////
// user sign up
app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;

  // check if the email and password are empty
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    // check for duplicate emails in the db
    const resultFind = await usersCollection.findOne({
      email,
    });
    if (resultFind) {
      return res.status(409).json({
        message: "The email has already existed, please change to another one.",
      });
    }

    // encrypt the password, salt is 10
    const hashedPwd = await bcrypt.hash(password, 10);

    // insert a new email and password.
    const result = await usersCollection.insertOne({
      email,
      password: hashedPwd,
    });
    res.status(201).json({ message: `Register Success ===> ${email}` });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

//////////////////////////////////////////////////////////////////////////////
// Logout and Delete JWT refreshToken
app.get("/api/signout", async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(406); // Not Acceptable
  }
  const refreshToken = cookies.jwt;

  try {
    // search the refreshToken
    const resultFind = await usersCollection.findOne({
      refreshToken,
    });
    if (!resultFind) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      return res.sendStatus(202); // Accepted
    }

    // Delete refreshToken with current user
    const resultDeleteToken = await usersCollection.updateOne(
      { refreshToken: { $eq: resultFind.refreshToken } },
      { $set: { refreshToken: "" } }
    );
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res.sendStatus(204); // No Content
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

//////////////////////////////////////////////////////////////////////////////
// Get all todos
app.get("/api/todos", verifyJWT, async (req, res) => {
  try {
    const result = await todosCollection.find({}).toArray();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.json("Errors! Try again later.");
  }
});

//////////////////////////////////////////////////////////////////////////////
// Add todo
app.post("/api/todos", verifyJWT, async (req, res) => {
  try {
    const result = await todosCollection.insertOne({
      text: req.body.text,
      done: false,
    });
    if (result.acknowledged) {
      res.status(200).json(result);
    }
  } catch (err) {
    console.error(err);
    res.json("Errors! Try again later.");
  }
});

//////////////////////////////////////////////////////////////////////////////
// Update text
app.put("/api/todos/text/:id", verifyJWT, async (req, res) => {
  try {
    const result = await todosCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { ...req.body } }
    );
    if (result.modifiedCount === 1) {
      res.status(200).json(`Updated todo ===> id: ${req.params.id}`);
    }
  } catch (err) {
    console.error(err);
    res.json("Errors! Try again later.");
  }
});

//////////////////////////////////////////////////////////////////////////////
// Toggle done
app.put("/api/todos/done/:id", verifyJWT, async (req, res) => {
  try {
    const result = await todosCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      // Here uses the bracket to use aggregation operator to toggle done.
      [{ $set: { done: { $not: "$done" } } }]
    );
    if (result.modifiedCount === 1) {
      res.status(200).json(`Updated todo ===> id: ${req.params.id}`);
    }
  } catch (err) {
    console.error(err);
    res.json("Errors! Try again later.");
  }
});

//////////////////////////////////////////////////////////////////////////////
// Remove todo
app.delete("/api/todos/:id", verifyJWT, async (req, res) => {
  try {
    const result = await todosCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (result.deletedCount === 1) {
      res.status(200).json(`Deleted todo ===> id: ${req.params.id}`);
    }
  } catch (err) {
    console.error(err);
    res.json("Errors! Try again later.");
  }
});

module.exports = app;
