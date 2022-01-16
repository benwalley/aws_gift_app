export default async function shouldShowToUser(type, isOwner) {
    const ownerCanSee = ['delete', 'edit', 'note', 'price', 'name', 'image'];
    const creatorCanSee = ['delete', 'edit', 'note', 'price', 'name', 'image'];
    const ownerCanNotSee = ['gottenBy', 'wantsToGet', 'cart']
    const anyoneCanSee = [];
    if(isOwner) {

    }
    if(type === "")
    return true
}
