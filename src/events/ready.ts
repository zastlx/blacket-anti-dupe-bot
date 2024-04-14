import { ActivityType, Client, REST } from "discord.js";
import { getCurrentSnapshots } from "../utils/snapshots";
import { PrismaClient } from "@prisma/client/extension";
import { DatabaseConnections } from "..";
import { snapshot } from "../utils/snapshots";

const setStatus = (client: Client, curSnaps: snapshot[]) => {
    const activites = [
        {
            name: "with blooks",
            type: ActivityType.Playing
        },
        {
            name: `with ${curSnaps.length} database snapshots`,
            type: ActivityType.Playing
        },
        {
            name: "with the Blacket API",
            type: ActivityType.Playing
        }
    ];

    client.user.setPresence({
        activities: [activites[Math.floor(Math.random() * activites.length)]],
        status: "online",
        afk: false
    });
}

export default async (client: Client, prisma: PrismaClient, rest: REST, databaseConnections: DatabaseConnections) => {
    let curSnaps = await getCurrentSnapshots();

    const commandHandler = await import("../handlers/command.js");
    await commandHandler.default.default(client, prisma, rest, databaseConnections);
    
    
    setStatus(client, curSnaps),
    setInterval(() => setStatus(client, curSnaps), 60 * 1000);
    setInterval(async() => getCurrentSnapshots().then(snaps => curSnaps = snaps), 60 * 1000 * 5);

    console.log(`Logged in as ${client.user?.tag}, with ${curSnaps.length} database snapshots.\nRereading snapshots every 5 minutes.`);
}