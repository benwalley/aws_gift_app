import { selector } from "recoil"
import {userMoniesVersion} from '../versionAtoms'

const refreshMonies = selector({
    key: 'refreshMonies',
    get: ({get}) => {},
    set: ({get, set}) => {
        const version = get(userMoniesVersion);
        set(userMoniesVersion, version + 1)
    }
});

export default refreshMonies
