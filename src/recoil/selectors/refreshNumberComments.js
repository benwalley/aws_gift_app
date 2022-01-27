import { selector } from "recoil"
import {refreshNumberOfComments} from '../versionAtoms'

const refreshNumberComments = selector({
    key: 'refreshNumberComments',
    get: ({get}) => {},
    set: ({get, set}) => {
        const updateComments = get(refreshNumberOfComments);
        set(refreshNumberOfComments, updateComments + 1)
    }
});

export default refreshNumberComments
