import { Menu } from "./Menu.jsx";
import { useState } from 'react';

export function MenuList({menus, filterList}) {
    const [active, setActive] = useState("all");
    const handleClick = (type) => { 
        setActive(type);
        filterList(type);
    }
    return (
        <ul className="menu-list">
            {!menus || menus.map((menu, index) =>
                <li className="menu-list-item" key={index}>
                    <Menu href={menu.href}
                        name={menu.name}                        
                        isIcon={menu.isIcon}
                        icon={menu.icon}  
                        type={menu.type}
                        style={active === menu.type ? 
                            "support-content-menu support-active" 
                            : "support-content-menu" }
                        handleClick={handleClick}
                        />
                    {menu.isBorder? <span className="menu-list-item-border"></span> : ""}
                </li>
            )}         
        </ul>

    );
}