/////////// EDIT SIMULATION DATA FOR TESTING HERE: ////////
const simulateSaveRecords = [['tilen', 'record_1']];
const simulateAuthOnRecord = ['tilen', 'auth_1', 1];

/////////// /////////// /////////// /////////// ///////////

const actions = require('./actions');

(async () => {
    for (const simulateSaveRecord of simulateSaveRecords) {
        const res1 = await actions.saveNewRecord(simulateSaveRecord[0], simulateSaveRecord[1], null);
        console.log(res1);
    }

    const res2 = await actions.retrain();
    console.log(res2);

    const res3 = await actions.confirmRecordOwner(simulateAuthOnRecord[0], null, simulateAuthOnRecord[1]);
    console.log(res3);
})();
