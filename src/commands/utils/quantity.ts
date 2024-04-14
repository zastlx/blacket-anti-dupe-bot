import { PrismaClient } from "@prisma/client";
import Command from "../index";
import {  AutocompleteInteraction, ChatInputCommandInteraction, Client } from "discord.js";
import { emojis } from "../../config.json";
import calcLevel from "../../utils/calcLevel";
import { getCachedSnapshots } from "../../utils/snapshots";
import { DatabaseConnections } from "../..";

class Quantity extends Command {
    constructor() {
        super(
            "quantity",
            "Get the quantity of a given item",
            "quantity <item>",
            [],
            "Utility",
            0,
            []
        );

        this.getCommandBuilder()
            .addStringOption(option => option.setName("item")
                .setDescription("The item to get the quantity of")
                .setRequired(true))
            .addBooleanOption(option => option.setName("showusers")
                .setDescription("Whether to show the users that have the item")
                .setRequired(false))
            .addStringOption(option => option.setName("snapshot")
                .setDescription("The database snapshot to use.")
                .setRequired(false)
                .setAutocomplete(true));
                
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

    override async run(interaction: ChatInputCommandInteraction, _: Client, mainDb: PrismaClient, databaseConnections: DatabaseConnections): Promise<void> {
        await interaction.deferReply();
        const db = databaseConnections[interaction.options.getString("snapshot")] ?? mainDb;
        const item = interaction.options.getString("item", true);

        const blook = await db.blooks.findFirst({
            where: {
                name: {
                    contains: item
                }
            }
        });
        if (!blook) {
            await interaction.reply({ content: "This item does not exist in the database", ephemeral: true });
            return;
        }
        const quantity = await db.users.findMany({
            select: {
                blooks: true,
                username: true,
                exp: true,
                id: true,
                created: true
            },
            where: {
                blooks: {
                    contains: `"${blook.name}"`
                }
            }
        });
        let userToQuant = {};
        for (const user of quantity) {
            userToQuant[user.username] = {
                level: calcLevel(user.exp),
                quantity: JSON.parse(user.blooks)[blook.name],
                id: user.id,
                created: user.created
            }
        }
        //const fa = new AttachmentBuilder().setFile(Buffer.from(Object.entries(userToQuant).map(([key, value]) => `${key}: ${value}`).join("\n"), "utf-8")).setName(`${blook.name}_quantity.txt`);
        await interaction.followUp({
            content: `${emojis[blook.rarity.toLowerCase()]} **${blook.name}** ${emojis[blook.rarity.toLowerCase()]}\n\nTotal in existence - ${Math.round(Object.values(userToQuant).reduce((a: number,b: { level: number, quantity: number, id: number, created: number }) => a+b.quantity, 0) as number)}\nPerson with most - ${Object.entries(userToQuant).sort((stew: [string, { level: number, quantity: number, id: number, created: number }], fart: [string, { level: number, quantity: number, id: number, created: number }]) => fart[1].quantity-stew[1].quantity)[0][0]}`,
            files: interaction.options.getBoolean("showusers") ? [{
                "name": `${blook.name}_quantity.txt`,
                "attachment": Buffer.from("username (level, userid, created): amount\n\n".concat(Object.entries(userToQuant).sort((stew: [string, { level: number, quantity: number, id: number }], fart: [string, { level: number, quantity: number, id: number, created: number }]) => fart[1].quantity-stew[1].quantity).map(([key, value]: [string, { level: number, quantity: number, id: number, created: number }]) => `${key} (${value.level}, ${value.id}, ${value.created}): ${value.quantity}`).join("\n")), "utf-8"),
            }] : []
        });
    }
}

export default Quantity;