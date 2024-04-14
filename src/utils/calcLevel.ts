/* user.level = 0;
            for (let i = 0; i <= 27915; i++) {
                user.needed = 5 * Math.pow(user.level, blacket.config.exp.difficulty) * user.level;
                if (user.exp >= user.needed) {
                    user.exp -= user.needed;
                    user.level++;
                }
            }*/

export default (exp: number) => {
    let level = 0;
    let difficulty = 0.75;
    let needed = 0;
    while (exp >= needed) {
        needed = 5 * Math.pow(level, difficulty) * level;
        if (exp >= needed) {
            exp -= needed;
            level++;
        }
    }
    return level;
}