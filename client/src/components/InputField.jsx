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
    className = "",
    icon,
    ...props
}){
    const inputEl = (
        <input 
        type={type}
        name={name}
        placeholder={placeholder}
        value = {value}
        onChange={onChange}
        disabled={disabled}
        className={`
        w-full
        p-3
        rounded-lg
        bg-zinc-900
        border
        border-zinc-700
        outline-none
        disabled:opacity-50
        ${icon ? "pl-10" : ""}
        ${className}
        `}
        {...props}
        />
    )

    if (icon) {
        return (
            <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {icon}
                </div>
                {inputEl}
            </div>
        )
    }

    return inputEl;
}

export default InputField;