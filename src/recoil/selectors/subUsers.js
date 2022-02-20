import { selector } from "recoil"
import usersInGroupState from "./usersInGroup";

const subUsersState = selector({
    key: 'subUsersState',
    get: async ({get}) => {
        const allGroup = get(usersInGroupState)
        const filteredGroup = allGroup.filter(member => {
            return member.isSubUser
        })
        return filteredGroup
    },
});

export default subUsersState
