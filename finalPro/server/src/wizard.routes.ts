import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";
 
export const wizardRouter = express.Router();
wizardRouter.use(express.json());
 
wizardRouter.get("/", async (_req, res) => {
   try {
       const wizards = await collections.wizards.find({}).toArray();
       res.status(200).send(wizards);
   } catch (error) {
       res.status(500).send(error.message);
   }
});

wizardRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const wizard = await collections.wizards.findOne(query);
  
        if (wizard) {
            res.status(200).send(wizard);
        } else {
            res.status(404).send(`Failed to find a wizard: ID ${id}`);
        }
  
    } catch (error) {
        res.status(404).send(`Failed to find a wizard: ID ${req?.params?.id}`);
    }
});

wizardRouter.post("/", async (req, res) => {
    try {
        const wizard = req.body;
        const result = await collections.wizards.insertOne(wizard);
  
        if (result.acknowledged) {
            res.status(201).send(`Created a new wizard: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new wizard.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

wizardRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const wizard = req.body;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.wizards.updateOne(query, { $set: wizard });
  
        if (result && result.matchedCount) {
            res.status(200).send(`Updated a wizard: ID ${id}.`);
        } else if (!result.matchedCount) {
            res.status(404).send(`Failed to find a wizard: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update a wizard: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

wizardRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.wizards.deleteOne(query);
  
        if (result && result.deletedCount) {
            res.status(202).send(`Removed a wizard: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove a wizard: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find a wizard: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});