import { useState,useEffect } from "react";
import { fetchWrapper } from "_helpers";
//import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
export { ProjectList };

function ProjectList(props) {
    //const { user: authUser } = useSelector(x => x.auth);
    const [ projectsData, setProjectsData] = useState([]);
    const baseUrl = `${process.env.REACT_APP_API_URL}/projects`;
    const [processingTasks, setProcessingTasks] = useState(new Set());
    function onGet()
    {
        fetchWrapper.get(`${baseUrl}/archive-status/${props.isArchived}`).then((response) => {
            setProjectsData((existingData) => {
                return response;
            });
        });
    }
    useEffect(() => {
        onGet();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleArchive = (projectId) => {
        setProcessingTasks(prev => new Set(prev).add(projectId));
        fetchWrapper.put(`${baseUrl}/archive/${projectId}`,{isArchived:1-props.isArchived}).then(() => {
            setProcessingTasks(prev => {
                const newSet = new Set(prev);
                newSet.delete(projectId);
                return newSet;
            });
            onGet();
        });
    };
    const handleDelete = (projectId) => {
        setProcessingTasks(prev => new Set(prev).add(projectId));
        fetchWrapper.delete(`${baseUrl}/${projectId}`).then(() => {
            setProcessingTasks(prev => {
                const newSet = new Set(prev);
                newSet.delete(projectId);
                return newSet;
            });
            onGet();
        });
    };
    return (
        <div>
            {projectsData.length ? (
                <ul className="list-group px-4">
                    {projectsData.map(project =>
                        <li key={project.id} className="gy-2 row gx-2 m-0">
                            <div className="col-md-10">
                                <div className="d-grid">
                                    <Link to={`/projects/${project.name}-${project.id}`} className="btn btn-light text-start">{project.name}</Link>
                                </div>
                            </div>
                            <div className="col-md-1">
                                <div className="d-grid">
                                    <button className="btn btn-info" onClick={() => handleArchive(project.id)} disabled={processingTasks.has(project.id)}>
                                        {processingTasks.has(project.id)?<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>:''}
                                        {props.isArchived ? "Unarchive" :"Archive"}
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-1">
                                <div className="d-grid">
                                    <button className="btn btn-danger" onClick={() => handleDelete(project.id)} disabled={processingTasks.has(project.id)}>
                                        {processingTasks.has(project.id)?<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>:''}
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </li>
                    )}
                </ul>):
                (<p>No projects available</p>)
            }
        </div>
    );
}
