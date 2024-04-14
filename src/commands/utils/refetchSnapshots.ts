import { getCurrentSnapshots } from "../../utils/snapshots";
import Command from "../index";
import {  ChatInputCommandInteraction } from "discord.js";

class SnapshotsReloader extends Command {
    constructor() {
        super(
            "refetchsnapshots",
            "Loads the current snapshots in memory.",
            "refetchsnapshots",
            [],
            "Utility",
            0,
            []
        );
    }

    override async run(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply();
        const curSnaps = await getCurrentSnapshots();

        await interaction.followUp({
            content: `Successfully reloaded the snapshots, there are now ${curSnaps.length} snapshots in memory.`,
        });
    }
}

export default SnapshotsReloader;