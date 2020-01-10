const conf = require('./config');
const fs = require('fs-extra');

if (!fs.existsSync(`./data/records`)) {
    fs.mkdirSync(`./data/records`);
}

if (!fs.existsSync(`./data/detect`)) {
    fs.mkdirSync(`./data/detect`);
}

if (!fs.existsSync(`./data/features`)) {
    fs.mkdirSync(`./data/features`);
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

const {spawn} = require('child_process');

function cleanWarning(error) {
    return error.replace(/Detector is not able to detect the language reliably.\n/g, "");
}

function runPy(scriptName, args) {
    return new Promise(function (success, reject) {

        const pyprog = spawn('python3', [`./scripts/${scriptName}.py`, ...args]);
        let result = "";
        let resultError = "";
        pyprog.stdout.on('data', function (data) {
            result += data.toString();
        });

        pyprog.stderr.on('data', (data) => {
            resultError += cleanWarning(data.toString());
        });

        pyprog.stdout.on("end", function () {
            if (resultError === "") {
                success(result);
            } else {
                console.log(result);
                console.error(`Python error, you can reproduce the error with: \n${[`./scripts/${scriptName}.py`, ...args]}`);
                const error = new Error(resultError);
                console.error(error);
                reject(resultError);
            }
        })
    });
}

async function saveNewRecord(userName, key, csv) {
    userName = userName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    key = key.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    console.log(`Saving new record ${userName} ${key}`);

    if (!fs.existsSync(`./data/records/${userName}`)) {
        fs.mkdirSync(`./data/records/${userName}`);
    }

    if (csv) {
        await fs.writeFile(`./data/records/${userName}/${key}.raw.csv`, `${csv}`);
    }

    const scriptResponse = await runPy('on-save', [userName, key]);

    const featuresCsv = await fs.readFile(`./data/records/${userName}/${key}.features.csv`);
    await fs.writeFile(`./data/features/${userName}.csv`, `${featuresCsv}`);

    return {
        scriptResponse, userName, key
    };
}

async function retrain() {
    const scriptResponse = await runPy('retrain', []);
    return {
        scriptResponse
    };
}


async function confirmRecordOwner(userName, csv, key) {
    userName = userName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    if (key) {
        key = key.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    }
    key = key || uuidv4();
    console.log(`Confirm record ${userName} ${key}`);

    if (csv) {
        await fs.writeFile(`./data/detect/${userName}-${key}.raw.csv`, `${csv}`);
    }

    const scriptResponse = await runPy('auth', [userName, key]);
    return scriptResponse;
}

module.exports = {
    saveNewRecord, confirmRecordOwner, retrain
};
