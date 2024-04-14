import Command from "../index";
import { ChatInputCommandInteraction } from "discord.js";
import { getCachedSnapshots } from "../../utils/snapshots";

class CurrentDatabaseSnapshots extends Command {
    constructor() {
        super(
            "databases",
            "Lists the current database snapshots.",
            "databases",
            [],
            "Utility",
            0,
            []
        );

        this.getCommandBuilder()
            .addBooleanOption(option => option.setName("readable")
                .setDescription("Whether to show the snapshots in a readable format.")
                .setRequired(false));
    }

    override async run(interaction: ChatInputCommandInteraction): Promise<void> {
        const currentSnapshots = getCachedSnapshots();
        const readable = interaction.options.getBoolean("readable") ?? true;
        
        interaction.reply({
            content: `Current amount of snapshots: ${currentSnapshots.length}\n\nThe current database snapshots are:`,
            files: [
                {
                    attachment: Buffer.from("name (id)\n\n".concat(currentSnapshots.map(a => `${readable ? a.name : a.filename} (${a.id})`).join("\n")), "utf-8"),
                    name: "snapshots.txt"
                }
            ]
        });
    }
}

export default CurrentDatabaseSnapshots;