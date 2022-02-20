import {Groups} from "../../models";

const {Users} = require("../../models");
const {DataStore} = require("@aws-amplify/datastore");
const {selectorFamily} = require("recoil");

const usersInGroup = selectorFamily({
    key: 'usersInGroups',
    get: groups => async () => {
        if(!groups || groups.length < 1) return
        const usersArray = []
        const uniqueIds = []
        try {
            for(const groupData of groups) {
                const group = await DataStore.query(Groups, groupData.id);
                for(const id of group.memberIds) {
                    const user = await DataStore.query(Users, id);
                    if(user  && uniqueIds.indexOf(user.id) === -1) {
                        usersArray.push(user);
                        uniqueIds.push(user.id)
                    }
                }
            }
        } catch(e) {
            console.log(e)
        }
        console.log(usersArray)
       return usersArray;
    },
});

export default usersInGroup
