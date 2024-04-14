import Command from "../index";
import { ChatInputCommandInteraction, Client } from "discord.js";
import { createConnection } from "node:net";
import { exec } from "node:child_process";
import { PrismaClient } from "@prisma/client/extension";
import { getCachedSnapshots } from "../../utils/snapshots";

class CreateSnapshot extends Command {
    constructor() {
        super(
            "createsnapshot",
            "Force the creation of a database snapshot.",
            "createsnapshot",
            [],
            "Utility",
            0,
            []
        );
    }

    override async run(interaction: ChatInputCommandInteraction, _: Client, __: PrismaClient): Promise<void> {
        if (interaction.user.id !== "253302259696271360") return;
        await interaction.deferReply();
        const snapshots = getCachedSnapshots();

        const socket = createConnection({ port: 6666, host: "localhost" });

        socket.on("connect", () => {
            console.log("connect");
            socket.write(JSON.stringify({ type: "makebackup" }));
        });

        socket.on("error", (err) => {
            console.log(err);
            socket.end();
            interaction.followUp({
                content: "An error occurred while trying to make a backup of the database.",
            });
        });

        socket.on("data", (e) => {
            console.log(JSON.parse(e.toString()))
            const path = `/home/zastix/projects/backupserver/backups/${JSON.parse(e.toString()).data}`;
            console.log(path);

            exec(`mariadb -u root -pfart -e "CREATE DATABASE blacket${snapshots.length};"`, (err) => {
                if (err) {
                    console.error(err);
                    interaction.followUp({
                        content: "An error occurred while trying to make a backup of the database.",
                    });
                    return;
                }

                exec(`mariadb -u root -p${process.env.LOCAL_PASS} blacket${snapshots.length} < "${path}"`, (err) => {
                    if (err) {
                        console.error(err);
                        interaction.followUp({
                            content: "An error occurred while trying to make a backup of the database.",
                        });
                        return;
                    }

                    exec(`cp "${path}" ./backups/backups/`, async (err) => {
                        if (err) {
                            console.error(err);
                            interaction.followUp({
                                content: "An error occurred while trying to make a backup of the database.",
                            });
                            return;
                        }

                        await interaction.followUp({
                            content: "Successfully created a database snapshot.",
                        });
                    });
                });

                
            });
        });
    }
}

export default CreateSnapshot;