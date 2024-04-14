const fs = require("node:fs/promises");
const { join } = require("node:path");

const getCurrentSnapshots = async () => {
    const files = (await fs.readdir(join(__dirname, "..","backups", "backups")));
    files.sort((a, b) => {
        const aDate = new Date(a);
        const bDate = new Date(b);
        return aDate.getTime() - bDate.getTime();
    });
    const snapshots = files.map((value, index) => {
        return {
            name: value.replace(/(\d{1,2})-(\d{1,2})-(\d{4}) (\d{1,2})-(\d{1,2})-(\d{1,2}) (AM|PM) \((\d{1,})\).sql/, "$1/$2/$3 $4:$5:$6 $7"),
            filename: value,
            id: index
        };
    });

    return snapshots;
};

for (const snapshot of await getCurrentSnapshots()) {
    fs.rename(join(__dirname, "..", "backups", "backups", snapshot.filename), join(__dirname, "..", "backups", "backups", `blacket${snapshot.id}.sql`));
}