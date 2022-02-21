import { selector } from "recoil"
import usersInGroupState from "./usersInGroup";
import dbUserState from "./dbUser";

const subUsersState = selector({
    key: 'subUsersState',
    get: async ({get}) => {
        const allGroup = get(usersInGroupState)
        const dbUser = get(dbUserState)
        const filteredGroup = allGroup.filter(member => {
            return member.isSubUser && member.parentUserId === dbUser.id
        })
        return filteredGroup
    },
});

export default subUsersState
