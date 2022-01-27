import {DataStore} from "aws-amplify";
import {Money, Users} from "../../models";
import {dbUserState} from "./";
import { selector } from "recoil"
import {userMoniesVersion} from '../versionAtoms'


const userMoniesState = selector({
    key: 'userMoniesState',
    get: async ({get}) => {
        const dbUser = get(dbUserState);
        const version = get(userMoniesVersion)
        if(!dbUser) return;
        const records = await DataStore.query(Money, c => c.creatorId("eq", dbUser.id));

        return records
    },
});

export default userMoniesState
