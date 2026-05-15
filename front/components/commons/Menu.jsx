
export function Menu({href, name, style, isIcon, icon, handleClick, type}) {
    return (
        <a  href={href}
            className={style}
            onClick={()=> {handleClick(type)}}
            >
            { isIcon ? icon : ""} {name}
        </a>
    );
}
