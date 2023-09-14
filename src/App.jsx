import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import { history } from '_helpers';
import { Navbar, PrivateRoute  } from '_components';
import { Home } from 'home';
import { Login } from 'login';
import { Register } from 'register';
import { Profile } from 'profile';
import { Upcoming } from 'upcoming';
import { Projects, Project } from 'projects';
export { App };

function App() {
    // init custom history object to allow navigation from 
    // anywhere in the react app (inside or outside components)
    history.navigate = useNavigate();
    history.location = useLocation();

    return (
        <div className="app-container">
            <Navbar />
            <main style={{marginTop: "58px"}}>
                <div className="container pt-4 pb-4">
                    <Routes>
                        <Route 
                            path="/" 
                            element=
                            {
                                <PrivateRoute>
                                    <Home />
                                </PrivateRoute>
                            }
                        />
                        <Route 
                            path="/profile" 
                            element=
                            {
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />
                        <Route 
                            path="/upcoming" 
                            element=
                            {
                                <PrivateRoute>
                                    <Upcoming />
                                </PrivateRoute>
                            }
                        />
                        <Route 
                            path="/projects" 
                            element=
                            { 
                                <Navigate to="/projects/active" /> 
                            }
                        />
                        <Route 
                            path="/projects/active" 
                            element=
                            {
                                <PrivateRoute>
                                    <Projects isArchived = {0} />
                                </PrivateRoute>
                            }
                        />
                        <Route 
                            path="/projects/archived" 
                            element=
                            {
                                <PrivateRoute>
                                    <Projects isArchived = {1} />
                                </PrivateRoute>
                            }
                        />
                        <Route 
                            path="/projects/:projectName-:projectId" 
                            element=
                            {
                                <PrivateRoute>
                                    <Project />
                                </PrivateRoute>
                            } 
                        />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}
