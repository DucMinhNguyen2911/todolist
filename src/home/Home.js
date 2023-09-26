import { useEffect,useState } from 'react';
import { fetchWrapper } from '_helpers';
//import { useSelector, useDispatch } from 'react-redux';

//import { userActions } from '_store';

export { Home };

function Home() {
    document.title = "Home";
    const [incompleteTasksData, setIncompleteTasksData] = useState([]);
    const [overDueTasksData, setOverDueTasksData] = useState([]);
    // eslint-disable-next-line
    const baseProjectUrl = `${process.env.REACT_APP_API_URL}/projects`;
    const baseTasksUrl = `${process.env.REACT_APP_API_URL}/tasks`;
    //const dispatch = useDispatch();
    //const { users } = useSelector(x => x.users);

    /*useEffect(() => {
        dispatch(userActions.getAll());

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);*/
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    const currentDate = new Date();
    const todayTxt = currentDate.toLocaleDateString(undefined, options);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const currentDateStr = `${year}-${month}-${day}`;
    const [processingTasks, setProcessingTasks] = useState(new Set());

    const handleComplete = (taskId) => {
        setProcessingTasks(prev => new Set(prev).add(taskId));
        fetchWrapper.put(`${baseTasksUrl}/complete/${taskId}`,{isCompleted:1}).then(() => {
            setProcessingTasks(prev => {
                const newSet = new Set(prev);
                newSet.delete(taskId);
                return newSet;
            });
            onGet();
        });
    };
    const handleDelete = (taskId) => {
        setProcessingTasks(prev => new Set(prev).add(taskId));
        fetchWrapper.delete(`${baseTasksUrl}/${taskId}`).then(() => {
            setProcessingTasks(prev => {
                const newSet = new Set(prev);
                newSet.delete(taskId);
                return newSet;
            });
            onGet();
        });
    };
    function onGet()
    {
        fetchWrapper.get(`${baseTasksUrl}/date/${currentDateStr}`).then((response) => {
            setIncompleteTasksData((existingData) => {
                return response;
            });
        });
        fetchWrapper.get(`${baseTasksUrl}/overdue/${currentDateStr}`).then((response) => {
            setOverDueTasksData((existingData) => {
                return response;
            });
        });
    }
    useEffect(() => {
        onGet();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div>
            <h3 className="mb-3">Today<span className="fs-6 fw-light"> {todayTxt}</span></h3>
            {/*users.length &&
                <ul>
                    {users.map(user =>
                        <li key={user.id}>{user.firstName} {user.lastName}</li>
                    )}
                </ul>
            }
            {users.loading && <div className="spinner-border spinner-border-sm"></div>}
            {users.error && <div className="text-danger">Error loading users: {users.error.message}</div>*/}
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-5" style={{tableLayout: "fixed"}}>
                    <thead>
                        <tr>
                            <th scope="col" className="col-1">#</th>
                            <th scope="col" className="col-2">Name</th>
                            <th scope="col" className="col-3">Description</th>
                            <th scope="col" className="col-2">Project</th>
                            <th scope="col" className="col-1">Priority</th>
                            <th scope="col" className="col-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incompleteTasksData.length ? (
                            incompleteTasksData.map((task, index) => {
                                return (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{task.name}</td>
                                        <td>{task.description}</td>
                                        <td>{task.project.name}</td>
                                        <td>{task.priority}</td>
                                        <td>
                                            <button className="btn btn-success col-md-6" onClick={() => handleComplete(task.id)} disabled={processingTasks.has(task.id)}>
                                                {processingTasks.has(task.id)?<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>:''}
                                                Complete
                                            </button>
                                            <button className="btn btn-danger col-md-5 offset-md-1" onClick={() => handleDelete(task.id)} disabled={processingTasks.has(task.id)}>
                                                {processingTasks.has(task.id)?<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>:''}
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            }))
                            :
                            (<tr>
                                <td colSpan="6">There are no tasks today.</td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
            <h3 className="mb-3 text-danger">Overdue</h3>
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-5" style={{tableLayout: "fixed"}}>
                    <thead>
                        <tr>
                            <th scope="col" className="col-1">#</th>
                            <th scope="col" className="col-2">Name</th>
                            <th scope="col" className="col-3">Description</th>
                            <th scope="col" className="col-2">Project</th>
                            <th scope="col" className="col-1">Priority</th>
                            <th scope="col" className="col-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {overDueTasksData.length ? (
                            overDueTasksData.map((task, index) => {
                                return (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{task.name}</td>
                                        <td>{task.description}</td>
                                        <td>{task.project.name}</td>
                                        <td>{task.priority}</td>
                                        <td>
                                            <button className="btn btn-success me-3" onClick={() => handleComplete(task.id)} disabled={processingTasks.has(task.id)}>
                                                {processingTasks.has(task.id)?<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>:''}
                                                Complete
                                            </button>
                                            <button className="btn btn-danger" onClick={() => handleDelete(task.id)} disabled={processingTasks.has(task.id)}>
                                                {processingTasks.has(task.id)?<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>:''}
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            }))
                            :
                            (<tr>
                                <td colSpan="6">There are no overdue tasks.</td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}
