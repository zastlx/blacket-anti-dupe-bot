import { Interaction, Client, REST, InteractionType } from "discord.js";
import { commands } from "../handlers/command";
import { PrismaClient } from "@prisma/client";
import { DatabaseConnections } from "..";

export default async (client: Client, db: PrismaClient, rest: REST, databaseConnections: DatabaseConnections, interaction: Interaction) => {
    // console.log(interaction);
    // if (!interaction.isChatInputCommand()) return;
    // const { commandName } = interaction;

    // const command = commands.get(commandName);

    // if (!command) return;

    // try {
    //     await command.run(interaction, client, db, rest);
    // } catch (error) {
    //     console.error(error);
    //     await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    // }
    const { ApplicationCommand, ApplicationCommandAutocomplete } = InteractionType;
    switch (interaction.type) {
        case ApplicationCommand: {
            const command = commands.get(interaction.commandName);
            if (!command) return;
            try {
                await command.run(interaction, client, db, databaseConnections, rest);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
            }
            break;
        }
        case ApplicationCommandAutocomplete: {
            const autocomplete = commands.get(interaction.commandName);
            if (!autocomplete) return;
            try {
                await autocomplete.autocomplete(interaction);
            } catch (error) {
                console.error(error);
                await interaction.respond([{name: "Error in autocomplete", value: "0"}]);
            }
            break;
        }
        default:
            break;
    }
}