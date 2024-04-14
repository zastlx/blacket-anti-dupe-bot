import { Client, IntentsBitField, REST } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { FieldPacket, createConnection } from "mysql2/promise";
import "dotenv/config";
const prisma = new PrismaClient();
const client = new Client({ intents: new IntentsBitField(131071) });
const rest = new REST({ version: "10"}).setToken(process.env.TOKEN!);

interface DatabaseConnections {
    [key: string]: PrismaClient;
}



async function main() {
    const mysqlConUnused = await createConnection(`mysql://root:${process.env.LOCAL_PASS}@127.0.0.1:3306/`);
    // @ts-ignore
    const dbs: [string[], FieldPacket[]] = await mysqlConUnused.query("SHOW DATABASES LIKE \"%blacket%\"");
    mysqlConUnused.end();
    const databaseConnections: DatabaseConnections = {};
    for (let i = 0; i <= dbs[0].length-1; i++) {
        databaseConnections[i.toString()] = new PrismaClient({ datasources: { db: { url: `mysql://root:${process.env.LOCAL_PASS}@127.0.0.1:3306/blacket${i}`!}}});
    }


    for (const file of ["event"]) {
    import(`./handlers/${file}.js`).then((module) => {
        //console.log(module)
        module.default.default(client, prisma, rest, databaseConnections);
        //console.log(module.defaul)
    });
    }

    client.login(process.env.TOKEN);
}

main();
export { DatabaseConnections };