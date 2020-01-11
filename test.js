/////////// EDIT SIMULATION DATA FOR TESTING HERE: ////////
const simulateSaveRecords = [['tilen', 'rec-1'], ['ziga', 'rec-1']];

/////////// /////////// /////////// /////////// ///////////

const actions = require('./actions');

(async () => {
    try {
        for (const simulateSaveRecord of simulateSaveRecords) {
            const res1 = await actions.saveNewRecord(simulateSaveRecord[0], simulateSaveRecord[1], null);
            console.log(res1);
        }
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
