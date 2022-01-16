export default function GetNameOrEmail(user) {
    if(!user) return 'loading...'
    try {
        return user.displayName === "noname" ? user.emailAddress : user.displayName;
    } catch(e) {
        return "loading..."
    }
}


