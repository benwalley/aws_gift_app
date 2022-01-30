const {Users} = require("../../models");
const {DataStore} = require("@aws-amplify/datastore");
const {selectorFamily} = require("recoil");

const personById = selectorFamily({
    key: 'personById',
    get: userId => async () => {
        const response = await DataStore.query(Users, userId);
        if (response.error) {
            console.log(response.error)
        }
        return response;
    },
});

export default personById
