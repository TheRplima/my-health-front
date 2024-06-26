import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import { SidebarData } from "./SideBarData";
import { IconContext } from "react-icons";

import { useAuth } from "../hooks/auth";

import Navbar from 'react-bootstrap/Navbar';
import Notifications from "./Notifications";

function SideBar(props) {

    const { logout, cookies } = useAuth();
    const [active, setActive] = useState(true);
    const user = cookies.user;
    const token = cookies.token;

    const handleLogout = async (e) => {
        e.preventDefault();
        logout(true);
    }

    const showSidebar = () => {
        props.setSidebar(!active);
        setActive(!active);
    }

    const handleClickMenuDropdown = (e) => {
        e.preventDefault();
        const parent = e.target.parentElement;
        parent.classList.toggle('active');
    }

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
                                    alt="User profile"
                                    src={token && user.image ? process.env.REACT_APP_API_BASE_URL + 'storage/' + user.image : 'https://via.placeholder.com/150'}
                                />
                                <p>{user.name}</p>
                            </li>
                        ) : (null)}
                        {SidebarData.map((item, index) => {
                            return ((item.private && token) || (!item.private) ?
                                (item.subNav ? (
                                    <li key={index} className={item.cName}>
                                        <Link className={props.pathname === item.path ? 'active' : null} onClick={handleClickMenuDropdown}>
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </Link>
                                        <ul>
                                            {item.subNav.map((subItem, index) => {
                                                return (
                                                    <li key={index} className={subItem.cName}>
                                                        <Link to={subItem.path} className={props.pathname === subItem.path ? 'active' : null}>
                                                            {subItem.icon}
                                                            <span>{subItem.title}</span>
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </li>
                                ) : (
                                    <li key={index} className={item.cName}>
                                        <Link to={item.path} className={props.pathname === item.path ? 'active' : null}>
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </Link>
                                    </li>
                                )
                                ) : (null));
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

            <Navbar id={'usermenu'} expand="sm">
                <Notifications />
            </Navbar>
        </>
    );
}

export default SideBar;