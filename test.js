/////////// EDIT SIMULATION DATA FOR TESTING HERE: ////////
const simulateSaveRecord = ['demo', 'record_1'];
const simulateAuthOnRecord = ['demo', '94728'];

/////////// /////////// /////////// /////////// ///////////

const actions = require('./actions');

(async () => {
    const res1 = await actions.saveNewRecord(simulateSaveRecord[0], simulateSaveRecord[1], null);
    console.log(res1);

    const res2 = await actions.confirmRecordOwner(simulateAuthOnRecord[0], null, simulateAuthOnRecord[1]);
    console.log(res2);
})();
