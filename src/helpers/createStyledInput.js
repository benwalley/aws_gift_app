export default async function createStyledInput(value, displayName, setValue) {
    return (
        <div className="themeStyledInput">
            <label htmlFor={value}>{displayName}</label>
            <input id={value} type="text" value={value} onChange={(e) => setValue(e.target.value)}/>
        </div>
    )
}
