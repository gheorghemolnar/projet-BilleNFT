import { NavLink } from "react-router-dom";

export default function Home() {
    return (
        <nav className="navbar navbar-expand-lg bg-light">
            <div className="container-fluid">
                <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink 
                                className={({isActive}) => `nav-link ${isActive ?"active": ""}`}
                                aria-current="page" 
                                to="/">Tous les événements
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink 
                                className={({isActive}) => `nav-link ${isActive ?"active": ""}`}
                                aria-current="page" 
                                to="/mytickets">Mes tickets
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}