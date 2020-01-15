const conf = require('./config');
const fs = require('fs-extra');
const crypto = require("crypto");

const logs = [];
function addLog(msg) {
    logs.unshift(`<span style="color: gray">${new Date()}</span> ${msg}`)
}

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
    var S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+""+S4()+""+S4()+""+S4()+""+S4()+S4()+S4());
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
            console.log("PYTHON SCRIPT FINISHED");
            console.log("RESULT: [[" + result + " ]]");
            console.log("ERROR: [[" + resultError + " ]]");
            console.log("---------");

            const jsonRes = result
                .split("\n")
                .filter(x => !!x && x.startsWith("{"))[0];

            if (jsonRes) {
                success(result);
            } else {
                console.error(`Python error, you can reproduce the error with: \n${[`./scripts/${scriptName}.py`, ...args]}`);
                const error = new Error(resultError);
                console.error(error);
                reject(resultError);
            }
        })
    });
}

async function saveNewRecord(userName, key, csv) {
    userName = userName.replace(/[^a-z0-9\-]/gi, '_').toLowerCase();
    key = key.replace(/[^a-z0-9\-]/gi, '_').toLowerCase();
    console.log(`Saving new record ${userName} ${key}`);

    addLog(`Saved train record for <strong>${userName}</strong> under key ${ key }.`);

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
    addLog(`Retrain of all users started.`);
    const scriptResponse = await runPy('retrain', []);
    const jsonRes = scriptResponse
        .split("\n")
        .filter(x => !!x && x.startsWith("{"))[0];
    addLog(`Retrain finished with statistics: ${ JSON.parse(jsonRes).stats }`);
    return {
        scriptResponse
    };
}


async function confirmRecordOwner(userName, csv, key, forceModelUsername) {
    userName = userName.replace(/[^a-z0-9\-]/gi, '_').toLowerCase();
    if (key) {
        key = key.replace(/[^a-z0-9\-]/gi, '_').toLowerCase();
    }
    key = key || uuidv4();
    console.log(`Confirm record ${userName} ${key} to belong to ${ forceModelUsername }`);
    addLog(`Started authenticating <strong>${forceModelUsername || userName}</strong> from detect record <strong>${ userName} - ${key}</strong>.`);

    if (csv) {
        await fs.writeFile(`./data/detect/${userName}-${key}.raw.csv`, `${csv}`);
    }

    const scriptResponse = await runPy('auth', [userName, key, forceModelUsername || userName]);
    console.log("Got auth response", {userName, csv, key}, scriptResponse.split("\n"));
    const data = JSON.parse(scriptResponse.split("\n").filter(x => !!x && x.startsWith("{"))[0]);

    addLog(`Record <strong>${ key }</strong> from user <strong>${ userName }</strong> belongs to <strong>${forceModelUsername || userName}</strong> with ${ data.authTrust}% probability.`);

    return data.authTrust;
}

module.exports = {
    saveNewRecord, confirmRecordOwner, retrain, logs, addLog
};
