import * as mongodb from "mongodb";
import { Wizard } from "./wizard";

export const collections: {
    wizards?: mongodb.Collection<Wizard>;
} = {}

export async function connectToDatabase(uri:string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("hogwartzdb");
    // good practice I found in documentation
    await applySchemaValidation(db);

    const wizardsCollection = db.collection<Wizard>("wizards");
    collections.wizards = wizardsCollection;
}

async function applySchemaValidation(db:mongodb.Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "gender", "house", "hogwartsStudent", "hogwartsStaff", "actor"],
            additionalProperties: false,
            properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string",
                    minLength: 3
                },
                gender: {
                    bsonType: "string",
                    description: "'gender' is required, a string, and either 'Male' or 'Female'",
                    enum: ["Male", "Female"]
                },
                house: {
                    bsonType: "string",
                    description: "'house' is required, a string, and either 'Gryffindor', 'Slytherin', 'Ravenclaw' or 'Hufflepuff'",
                    enum: ["Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"]
                },
                hogwartsStudent: {
                    bsonType: "boolean",
                    description: "'hogwartsStudent' is required, is a boolean then is 'true' or 'false'",
                    enum: ["true", "false"]
                },
                hogwartsStuff: {
                    bsonType: "boolean",
                    description: "'hogwartsStuff' is required, is a boolean then is 'true' or 'false'",
                    enum: ["true", "false"]
                },
                actor: {
                    bsonType: "string",
                    description: "'actor' is required and is a string",
                    minLength: 3
                },
                dateOfBirth: {
                    bsonType: "string",
                    description: "'dateOfBirth' is not required, but the format should be DD-MM-YYYY",
                    maxLength: 10
                },
                ancestry: {
                    bsonType: "string",
                    description: "'ancestry' is required and is a string"
                },
                patronus: {
                    bsonType: "string",
                    description: "'patronus' is required and is a string"
                },
                image: {
                    bsonType: "string",
                    description: "'image' is required and is a string"
                }
            },
        },
    };
    await db.command({
        collMod: "wizards",
        validator: jsonSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === 'NamespaceNotFound') {
            await db.createCollection("wizards", {validator: jsonSchema})
        }
    });
}

