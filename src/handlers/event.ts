import { PrismaClient } from "@prisma/client";
import { Client, REST } from "discord.js";
import fs from "fs";
import { join } from "path";
import { DatabaseConnections } from "..";

export default async (client: Client, mainDb: PrismaClient, rest: REST, databaseConnections: DatabaseConnections) => {
    // const events = readdirSync("../../events").filter((file) => file.endsWith(".js"));
    // events.forEach(async (name) => {
    //     console.log(name);
    //     const event = await import(`../../events/${name}`);
    //     client.on(name.split(".")[0], event.bind(null, client));
    // });
    const events = fs.readdirSync(join(__dirname, "..", "events")).filter((file) => file.endsWith(".js"));
    for (const event of events) {
        const eventFile = await import(join(__dirname, "..", "events", event));
        client.on(event.split(".")[0], eventFile.default.default.bind(null, client, mainDb, rest, databaseConnections));
    }
}