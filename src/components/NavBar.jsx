import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import { SidebarData } from "./SideBarData";
import { IconContext } from "react-icons";

import { useAuth } from "../hooks/auth";

function Navbar(props) {
    const { logout, cookies } = useAuth();
    const [active, setActive] = useState(true);

    const handleLogout = async (e) => {
        e.preventDefault();
        logout(true);
    }

    const showSidebar = () => {
        props.setSidebar(!active);
        setActive(!active);
    }

    const user = cookies.user;
    const token = cookies.token;
    console.log()
    return (
        <>
            <IconContext.Provider value={{ color: "undefined" }}>
                <div className="navbar">
                    <Link to="#" className={!active ? "menu-bars active" : "menu-bars"}>
                        <FaIcons.FaBars onClick={showSidebar} />
                    </Link>
                </div>
                <nav className={active ? "nav-menu active" : "nav-menu"}>
                    <ul className="nav-menu-items">
                        <li className="navbar-toggle">
                            <Link to="#" className="menu-bars" onClick={showSidebar}>
                                <AiIcons.AiOutlineClose />
                            </Link>
                        </li>
                        {token ? (
                            <li className="user-info">
                                <img
                                    src={token && user.image ? process.env.REACT_APP_API_BASE_URL + 'storage/' + user.image : 'https://via.placeholder.com/150'}
                                    alt="UserName profile image"
                                />
                                <p>
                                    {user.name}
                                </p>
                            </li>
                        ) : (null)}
                        {SidebarData.map((item, index) => {
                            return (
                                (item.private && token) || (!item.private) ?
                                    (<li key={index} className={item.cName}>
                                        <Link to={item.path} className={props.pathname === item.path ? 'active' : null}>
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </Link>
                                    </li>) : (null)
                            );
                        })}
                        {token ? (
                            <li className="nav-text">
                                <Link to="#" onClick={handleLogout}>
                                    <AiIcons.AiOutlineLogout />
                                    <span>Logout</span>
                                </Link>
                            </li>
                        ) : (null)}
                    </ul>
                </nav>
            </IconContext.Provider>
        </>
    );
}

export default Navbar;