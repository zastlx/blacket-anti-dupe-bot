import { readdir } from "fs/promises";
import { join } from "path";

interface snapshot {
    name: string;
    filename: string;
    id: string;
    createdAt: Date;
}

let cachedSnapshots = [];

const getCurrentSnapshots = async (): Promise<snapshot[]> => {
    const files = (await readdir(join(__dirname, "..", "..", "backups", "backups")));
    files.sort((a, b) => {
        const aDate = new Date(a.replace(/(\d{1,2})-(\d{1,2})-(\d{4}) (\d{1,2})-(\d{1,2})-(\d{1,2}) (AM|PM) \((\d{1,})\).sql/, "$1/$2/$3 $4:$5:$6 $7 ")+" UTC");
        const bDate = new Date(b.replace(/(\d{1,2})-(\d{1,2})-(\d{4}) (\d{1,2})-(\d{1,2})-(\d{1,2}) (AM|PM) \((\d{1,})\).sql/, "$1/$2/$3 $4:$5:$6 $7 ")+" UTC");
        return aDate.getTime() - bDate.getTime();
    });
    const snapshots = files.map((value, index) => {
        return {
            name: value.replace(/(\d{1,2})-(\d{1,2})-(\d{4}) (\d{1,2})-(\d{1,2})-(\d{1,2}) (AM|PM) \((\d{1,})\).sql/, "$1/$2/$3 $4:$5:$6 $7 UTC-0"),
            filename: value,
            id: index.toString(),
            createdAt: new Date(value.replace(/(\d{1,2})-(\d{1,2})-(\d{4}) (\d{1,2})-(\d{1,2})-(\d{1,2}) (AM|PM) \((\d{1,})\).sql/, "$1/$2/$3 $4:$5:$6 $7 ")+" UTC")
        };
    });

    cachedSnapshots = snapshots;
    return snapshots;
};

const getCachedSnapshots = (maxAmountOfSnapshots?: number): snapshot[] => {
    // dont modify the cached snapshots, but return a new array
    return maxAmountOfSnapshots ? cachedSnapshots.slice(-maxAmountOfSnapshots) : cachedSnapshots;
}


export { getCurrentSnapshots, getCachedSnapshots, snapshot };