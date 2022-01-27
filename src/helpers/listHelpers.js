export function updateList(versions, setVersions) {
    const vCopy = versions;
    vCopy.wishlistList = vCopy.wishlistList + 1;
    setVersions({...vCopy});
}
