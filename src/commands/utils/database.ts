import Command from "../index";
import { AutocompleteInteraction, ChatInputCommandInteraction, Client } from "discord.js";
import { PrismaClient } from "@prisma/client/extension";
import { DatabaseConnections } from "../..";
import { getCachedSnapshots } from "../../utils/snapshots";

class DatabaseInfo extends Command {
    constructor() {
        super(
            "database",
            "Get information about a specific database snapshot.",
            "database",
            [],
            "Utility",
            0,
            []
        );

        this.getCommandBuilder()
            .addStringOption(option => option.setName("snapshot")
            .setDescription("The database snapshot to get information about.")
            .setAutocomplete(true)
            .setRequired(true));
    }

    override async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
        const option = interaction.options.getFocused(true);
        
        switch (option.name) {
            case "snapshot": {
                const snapshots = getCachedSnapshots();
                await interaction.respond(snapshots.map(snapshot => ({
                    name: snapshot.name,
                    value: snapshot.id
                })).filter(snapshot => snapshot.name.startsWith(option.value)).slice(0, 25));
                break;
            }
        }
    }

    override async run(interaction: ChatInputCommandInteraction, _: Client, __: PrismaClient, databaseConnections: DatabaseConnections): Promise<void> {
        await interaction.deferReply();
        const snapshotDb = databaseConnections[interaction.options.getString("snapshot")];
        const snapshot = getCachedSnapshots().find(snapshot => snapshot.id === interaction.options.getString("snapshot"));

        if (!snapshotDb) {
            await interaction.followUp({
                content: "The specified database snapshot does not exist.",
                ephemeral: false
            });
            return;
        }

        const blooks = await snapshotDb.blooks.findMany();
        const users = await snapshotDb.users.findMany();

        await interaction.followUp({
            content: `Database snapshot information for snapshot ${interaction.options.getString("snapshot")}:\n\nBlooks: ${blooks.length}\nUsers: ${users.length}\nCreated at: <t:${Math.floor(snapshot.createdAt.getTime() / 1000)}:R>`,
            ephemeral: false
        });
    }
}

export default DatabaseInfo;