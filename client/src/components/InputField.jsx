// Reusable components:
// reduce duplication
// improve maintainability
// standardize UI

function InputField({
    type = "text",
    name,
    placeholder,
    value,
    onChange,
    disabled = false,
    ...props
}){
    return(
        <input 
        type={type}
        name={name}
        placeholder={placeholder}
        value = {value}
        onChange={onChange}
        disabled={disabled}
        className="
        w-full
        p-3
        rounded-lg
        bg-zinc-900
        border
        border-zinc-700
        outline-none
        disabled:opacity-50
        "
        {...props}
        />
    )
}

export default InputField;