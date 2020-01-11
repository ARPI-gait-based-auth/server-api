/////////// EDIT SIMULATION DATA FOR TESTING HERE: ////////
const simulateAuthOnRecord = ['tilen', 'auth_1', 1];

/////////// /////////// /////////// /////////// ///////////

const actions = require('./actions');

(async () => {
    try {
        const res2 = await actions.retrain();
        console.log(res2);

        const authTrust = await actions.confirmRecordOwner(simulateAuthOnRecord[0], null, simulateAuthOnRecord[1]);
        console.log("authTrust: " + authTrust);
        if (authTrust < 0.6) {
            console.error("Wrong authTrust! " + authTrust);
            process.exit(1);
        }
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
