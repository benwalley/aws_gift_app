import { atom } from "recoil"

const dbUserVersion = atom({
    key: "dbUserVersion",
    default: 0
})

export default dbUserVersion
