import { atom } from "recoil"

const currentGroupVersion = atom({
    key: "currentGroupVersion",
    default: 0
})

export default currentGroupVersion
