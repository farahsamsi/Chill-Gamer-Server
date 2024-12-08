require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tu4i6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const gameReviewCollection = client
      .db("gameReviewDB")
      .collection("gameReviews");

    // create data from client side
    app.post("/gameReviews", async (req, res) => {
      const newReview = req.body;
      console.log(newReview);
      const result = await gameReviewCollection.insertOne(newReview);
      res.send(result);
    });

    // get data for route
    app.get("/gameReviews", async (req, res) => {
      const cursor = gameReviewCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get data for top rated with limit 6
    app.get("/gameReviews/top-rated", async (req, res) => {
      const cursor = gameReviewCollection.find().sort({ rating: -1 }).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });
    // filter by category
    app.get("/gameReviews/filter/:filterGenre", async (req, res) => {
      const filter = req.params.filterGenre;
      const query = { genre: filter };
      const cursor = gameReviewCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get data for route based on sorting
    app.get("/gameReviews/sorted/:sortBy", async (req, res) => {
      const sortBy = req.params.sortBy;
      if (sortBy === "rating") {
        const query = { rating: -1 };
        const cursor = gameReviewCollection.find().sort(query);
        const result = await cursor.toArray();
        res.send(result);
      } else {
        const query = { year: -1 };
        const cursor = gameReviewCollection.find().sort(query);
        const result = await cursor.toArray();
        res.send(result);
      }
    });

    // Filter and sort combined endpoint
    app.get("/gameReviews/filter&sort/:genre", async (req, res) => {
      const { genre } = req.params;
      const { sort } = req.query;

      let query = { genre }; // Filter by genre
      let cursor = gameReviewCollection.find(query);

      // Apply sorting if specified
      if (sort === "rating") {
        cursor = cursor.sort({ rating: -1 });
      } else if (sort === "year") {
        cursor = cursor.sort({ year: -1 });
      }

      const result = await cursor.toArray();
      res.send(result);
    });

    // get operation to find single game reviews
    app.get("/gameReviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await gameReviewCollection.findOne(query);
      res.send(result);
    });

    // get operation to find email reviews
    app.get("/gameReviews/email/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const result = await gameReviewCollection.find(query).toArray();
      res.send(result);
    });

    // update review "PUT" operation
    app.put("/gameReviews/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedReview = req.body;
      const review = {
        $set: {
          photo: updatedReview.photo,
          name: updatedReview.name,
          year: updatedReview.year,
          userName: updatedReview.userName,
          username: updatedReview.username,
          description: updatedReview.description,
          rating: updatedReview.rating,
          genre: updatedReview.genre,
        },
      };
      const result = await gameReviewCollection.updateOne(
        filter,
        review,
        options
      );
      res.send(result);
    });

    // delete a game review from received _id
    app.delete("/gameReviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await gameReviewCollection.deleteOne(query);
      res.send(result);
    });

    // ------------------- watchList DB-------------
    // declaring collection for DB
    const watchListCollection = client
      .db("gameReviewDB")
      .collection("watchList");

    // receive data from client side
    app.post("/watchList", async (req, res) => {
      const newWatchListItem = req.body;
      console.log(newWatchListItem);
      const result = await watchListCollection.insertOne(newWatchListItem);
      res.send(result);
    });

    app.get("/watchList", async (req, res) => {
      const cursor = watchListCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get operation to find single item
    app.get("/watchList/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await watchListCollection.findOne(query);
      res.send(result);
    });
    app.get("/watchList/email/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await watchListCollection.find(query).toArray();
      res.send(result);
    });

    // delete a list item from received _id
    app.delete("/watchList/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await watchListCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. Your successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Chill gamer server is working");
});

app.listen(port, () => {
  console.log(`Your server is running on port : ${port}`);
});
