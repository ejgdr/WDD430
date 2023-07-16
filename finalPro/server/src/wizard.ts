import * as mongodb from "mongodb";

export interface Wizard {
    _id?: mongodb.ObjectId;
    name: string;
    gender: string;
    house: string;
    hogwartsStudent: boolean;
    hogwartsStaff: boolean;
    actor: string;
    dateOfBirth: string;
    ancestry: string;
    patronus: string;
    image: string;
}