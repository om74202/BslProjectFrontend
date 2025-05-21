export const SelectedButton=({text , isClicked , onClick})=>{
    console.log(isClicked)
    return (
        <div>
            <button  type="button" onClick={onClick} className={`text-black  ${isClicked ? `bg-blue-600`:`bg-white`}   hover:bg-blue-800   font-medium rounded-lg 
            text-sm px-6 py-3 me-2 mb-2 dark:hover:bg-blue-700 `}>{text}</button>
        </div>
    )
}