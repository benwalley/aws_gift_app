import { selector } from "recoil"
import {dbUserVersion} from '../versionAtoms'

const refreshMonies = selector({
    key: 'refreshMonies',
    get: ({get}) => {},
    set: ({get, set}) => {
        const version = get(dbUserVersion);
        set(dbUserVersion, version + 1)
    }
});

export default refreshMonies
