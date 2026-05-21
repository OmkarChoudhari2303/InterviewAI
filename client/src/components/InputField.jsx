// Reusable components:
// reduce duplication
// improve maintainability
// standardize UI

function InputField({
    type = "text",
    name,
    placeholder,
    value,
    onChange
}){
    return(
        <input 
        type={type}
        name={name}
        placeholder={placeholder}
        value = {value}
        onChange={onChange}
        className="
        w-full
        p-3
        rounded-lg
        bg-zinc-900
        border
        border-zinc-700
        outline-none
        "
        />
    )
}

export default InputField;