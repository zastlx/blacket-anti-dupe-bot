import { Collection, REST, Routes } from "discord.js";
import fs from "fs";
import { join } from "path";
import Command from "../commands";

const commands = new Collection<string, Command>();

async function setUpCommands(baseDir = "") {
    const dir = join(__dirname, "..", "commands", baseDir);
    const files = fs.readdirSync(dir);

    for (const file of files) {
        if (file === "index.js") continue;
        if (!file.includes(".")) {
            await setUpCommands(join(baseDir, file));
            continue;
        }

        const module = (await import(join(dir, file))).default.default;
        const command = new module();

        commands.set(command.getName(), command);

    }
}

export default async (_, __, rest: REST, ___) => {
    _ && __ && ___;
    await setUpCommands();

    const data = commands.map(command => command.getCommandBuilder().toJSON());
    await rest.put(Routes.applicationCommands(process.env.APP_ID), { body: data });
}
export { commands };


/*import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export default async function setupRoutes(app, baseDir = "") {
    const dir = path.join(fileURLToPath(new URL('.', import.meta.url)), "..", "endpoints")
    const currentDir = dir.concat("/".concat(baseDir));

    const files = fs.readdirSync(currentDir);

    for (const file of files) {        
        if (!file.includes(".")) {
            setupRoutes(app, path.join(baseDir, file));
            continue;
        }

        const module = (await import(path.join(currentDir, file))).default;
        const methods = module.methods;

        if (file === "index.js") {
            methods.forEach(method => {
                app[method](`/api${path.join(currentDir.replace(dir, ""))}`, module[method]);
            });
            continue;
        }

        methods.forEach(method => {
            app[method](`/api${path.join(currentDir.replace(dir, ""), file).replace(".js", "")}`, module[method]);
        });
    }
}*/