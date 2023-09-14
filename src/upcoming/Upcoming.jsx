import { useState, useEffect } from "react";
import { fetchWrapper } from "_helpers";
export { Upcoming };

function Upcoming() {
    document.title = "Upcoming";
    const [incompleteTasksData, setIncompleteTasksData] = useState([]);
    const baseTasksUrl = `${process.env.REACT_APP_API_URL}/tasks`;

    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    const currentDateDisplay = new Date();
    const sdayTxt = currentDateDisplay.toLocaleDateString(undefined, options);
    currentDateDisplay.setDate(currentDateDisplay.getDate() + 6);
    const edayTxt = currentDateDisplay.toLocaleDateString(undefined, options);
    const handleComplete = (taskId) => {
        fetchWrapper.put(`${baseTasksUrl}/complete/${taskId}`,{isCompleted:1}).then(() => {
            onGet();
        });
    };
    const handleDelete = (taskId) => {
        fetchWrapper.delete(`${baseTasksUrl}/${taskId}`).then(() => {
            onGet();
        });
    };
    function onGet()
    {
        setIncompleteTasksData([]);
        for(let i = 0; i < 7; i++)
        {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + i);

            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const currentDateStr = `${year}-${month}-${day}`;
            fetchWrapper.get(`${baseTasksUrl}/date/${currentDateStr}`).then((response) => {
                setIncompleteTasksData((existingData) => {
                    return [...existingData, ...response]
                });
            });
        }
    }
    useEffect(() => {
        onGet();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div>
            <h3 className="mb-3">Upcoming<span className="fs-6 fw-light"> {sdayTxt} to {edayTxt}</span></h3>
        <div className="table-responsive">
                <table className="table table-hover align-middle mb-5" style={{tableLayout: "fixed"}}>
                    <thead>
                        <tr>
                            <th scope="col" className="col-1">#</th>
                            <th scope="col" className="col-2">Name</th>
                            <th scope="col" className="col-3">Description</th>
                            <th scope="col" className="col-2">Project</th>
                            <th scope="col" className="col-1">Priority</th>
                            <th scope="col" className="col-1">Due date</th>
                            <th scope="col" className="col-2">Action</th>
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
                                        <td>{task.dueAt.split('T')[0]}</td>
                                        <td>
                                            <button className="btn btn-success me-3" onClick={() => handleComplete(task.id)}>Complete</button>
                                            <button className="btn btn-danger" onClick={() => handleDelete(task.id)}>Delete</button>
                                        </td>
                                    </tr>
                                );
                            }))
                            :
                            (<tr>
                                <td colSpan="7">There are no upcoming tasks.</td>
                            </tr>)
                        }
                        {/* <tr>
                            <td colSpan="6"><div className='d-grid'><button className="btn btn-light " onClick={handleShow}><i className="fa-solid fa-plus"></i> Add</button></div></td>
                        </tr> */}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
