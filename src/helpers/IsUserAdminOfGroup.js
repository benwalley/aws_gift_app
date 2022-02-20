export default function isUserAdminOfGroup(userId, group) {
    try {
        const returnValue = group.adminIds.indexOf(userId) > -1;
        return returnValue
    } catch (e) {
        console.log(e)
        return false;
    }
}


