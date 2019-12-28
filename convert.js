const fs = require('fs-extra');

(async () => {
    const list = fs.readdirSync('external-data');
    for (const x of list) {
        const c = x.split('_');
        const user = c[0];
        const gender = c[1];

        const userName = gender + user;


        let txt = await fs.readFile(`./external-data/${x}`);
        txt = `;timestamp;accX;accY;accZ;username\n`
            + txt
                .toString()
                .split('\n')
                .map((n, i) => {
                    n = n.split(',');
                    return `${i};${n[0]}000;${+n[1]};${+n[2]};${+n[3]};${userName}`
                })
                .join('\n');

        if (!fs.existsSync(`./external-data-out`)) {
            fs.mkdirSync(`./external-data-out`);
        }
        if (!fs.existsSync(`./external-data-out/${userName}`)) {
            fs.mkdirSync(`./external-data-out/${userName}`);
        }
        await fs.writeFile(`./external-data-out/${userName}/${c[2]}.raw.csv`, txt);
    }

    console.log('DONE');
})();
