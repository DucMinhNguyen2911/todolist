import { NavLink,Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { authActions } from '_store';
import { useState } from 'react';
export { Navbar };

function Navbar() {
    const dispatch = useDispatch();
    const authUser = useSelector(x => x.auth.user);
    const logout = () => dispatch(authActions.logout());
    const [showSidebar, setShowSidebar] = useState(false);
    function handleSidebar() {
        setShowSidebar(prevShow => !prevShow);
    }
    // only show nav when logged in
    if (!authUser) return null;

    return (
        <header>
            <nav id="sidebarMenu" className={`d-lg-block sidebar collapse bg-white ${showSidebar ? "show" : ""}`}>
                <div className="position-sticky">
                    <div className="list-group list-group-flush mx-3 mt-4">
                        <NavLink to="/profile" className="list-group-item list-group-item-action py-2 ">
                            <i className="fa-solid fa-user fa-fw me-3"></i><span>Profile</span>
                        </NavLink>
                        <NavLink to="/" className="list-group-item list-group-item-action py-2 ">
                            <i className="fa-solid fa-calendar-day fa-fw me-3"></i><span>Today</span>
                        </NavLink>
                        <NavLink to="/upcoming" className="list-group-item list-group-item-action py-2 ">
                            <i className="fa-solid fa-calendar-days fa-fw me-3"></i><span>Upcoming</span>
                        </NavLink>
                        <Link to="/projects/active" className="list-group-item list-group-item-action my-3">Projects</Link>
                    </div>
                </div>
            </nav>
            <nav id="main-navbar" className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">

                <div className="container">
                    <button
                        className="navbar-toggler border-0"
                        type="button"
                        onClick={handleSidebar}
                    >
                        <i className="fas fa-bars"></i>
                    </button>


                    <NavLink className="navbar-brand" to="/">To Do List</NavLink>

                    <ul className="navbar-nav ms-auto d-flex flex-row">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/profile">
                                <i className="fa-solid fa-circle-user"></i>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <span className="nav-link" onClick={logout}>
                                <i className="fa-solid fa-right-from-bracket"></i>
                            </span>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}