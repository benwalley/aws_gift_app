import { atom } from "recoil"

import authUserUsername from "./authUserUsername";
import authUserEmail from "./authUserEmail";
import errorContentState from "./errorContent";
import largeWishlistItemIdState from "./largeWishlistItemId";
import successContentState from "./successContent";
import visibleWishlistIDState from "./visibleWishlistId";
import usingUserIdState from "./usingUserId";
import authStateState from "./authState";
import currentGroupIdState from "./currentGroupId";

export {authUserUsername,
    authUserEmail,
    errorContentState,
    largeWishlistItemIdState,
    successContentState,
    visibleWishlistIDState,
    usingUserIdState,
    authStateState,
    currentGroupIdState
}

export default atom;
