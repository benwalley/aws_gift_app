import {Groups, WishlistItems} from "../../models";
const {DataStore} = require("@aws-amplify/datastore");
const {selectorFamily} = require("recoil");

const addItemToGroup = selectorFamily({
    key: 'addItemToGroup',
    get: (itemId, groupId) => async () => {
        const original = await DataStore.query(WishlistItems, itemId);
        await DataStore.save(Groups.copyOf(original, updated => {
            try {
                const groupsCopy = [...original.groupIds]
                groupsCopy.push(groupId)
                updated.groupIds = [...new Set(groupsCopy)]
            } catch (e) {
                console.log(e)
            }
        }))
    },
});

export default addItemToGroup
