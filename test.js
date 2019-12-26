/////////// EDIT SIMULATION DATA FOR TESTING HERE: ////////
const simulateSaveRecord = ['test_user', 'record-1'];
const simulateAuthOnRecord = ['test_user', 'record-2'];

/////////// /////////// /////////// /////////// ///////////


function runPy(scriptName, args) {
    return new Promise(function (success, nosuccess) {

        const {spawn} = require('child_process');
        const pyprog = spawn('python3', [`./scripts/${scriptName}.py`, ...args]);

        pyprog.stdout.on('data', function (data) {
            success(data.toString());
        });

        pyprog.stderr.on('data', (data) => {
            nosuccess(data.toString());
        });
    });
}

runPy('on-save', simulateSaveRecord)
    .then(function (scriptResponse) {
        const prints = scriptResponse.split('\n');
        console.log("RAW ON-SAVE PRINT: ", prints);
        const resData = JSON.parse(prints[prints.length - 2]);
        console.log("ON-SAVE PY RESPONSE", {
            scriptResponse,
            resData
        });
    })
    .then(() => runPy('auth', simulateAuthOnRecord))
    .then(function (scriptResponse) {
        const prints = scriptResponse.split('\n');
        console.log("RAW AUTH PRINT: ", prints);
        const resData = JSON.parse(prints[prints.length - 2]);
        console.log("AUTH PY RESPONSE", {
            scriptResponse,
            resData
        });
        process.exit(0);
    })
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
