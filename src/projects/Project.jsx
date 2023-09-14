import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from "react";
import { fetchWrapper } from "_helpers";
//import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { history } from '_helpers';

export { Project };
function Project() {
    const { projectName, projectId } = useParams();
    //const { user: authUser } = useSelector(x => x.auth);
    const [incompleteTasksData, setIncompleteTasksData] = useState([]);
    const [completeTasksData, setCompleteTasksData] = useState([]);
    const baseProjectUrl = `${process.env.REACT_APP_API_URL}/projects`;
    const baseTasksUrl = `${process.env.REACT_APP_API_URL}/tasks`;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const currentDateStr = `${year}-${month}-${day}`;
    currentDate.setHours(0,0,0,0)
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [inputName, setInputName] = useState('');

    const handleInputNameChange = (event) => {
        setInputName(event.target.value);
    };

    const [inputDescription, setInputDescription] = useState('');

    const handleInputDescriptionChange = (event) => {
        setInputDescription(event.target.value);
    };

    const [inputPriority, setInputPriority] = useState(4);

    const handleInputPriorityChange = (event) => {
        setInputPriority(event.target.value);
    };

    const [inputDate, setInputDate] = useState(currentDateStr);

    const handleInputDateChange = (event) => {
        setInputDate(event.target.value);
    };
    function onGet()
    {
        fetchWrapper.get(`${baseTasksUrl}/project/${projectId}/complete-status/0`).then((response) => {
            setIncompleteTasksData((existingData) => {
                return response;
            });
        });
        fetchWrapper.get(`${baseTasksUrl}/project/${projectId}/complete-status/1`).then((response) => {
            setCompleteTasksData((existingData) => {
                return response;
            });
        });
    }
    const onSubmit = async () => {
        setShow(false);
        fetchWrapper.post(`${baseTasksUrl}`, { name: inputName, description: inputDescription, priority: inputPriority, projectId: projectId, dueAt: inputDate }).then(() => {
            onGet();
        });
    }
    useEffect(() => {
        fetchWrapper.post(`${baseProjectUrl}/validate`, { id: projectId, name: projectName }).then((response) => {
            if (!response) {
                history.navigate('/projects');
            }
            else {
                onGet();
            }
        }).catch(() => {
            history.navigate('/projects');
        });;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleComplete = (taskId) => {
        fetchWrapper.put(`${baseTasksUrl}/complete/${taskId}`,{isCompleted:1}).then(() => {
            onGet();
        });
    };
    const handleInComplete = (taskId) => {
        fetchWrapper.put(`${baseTasksUrl}/complete/${taskId}`,{isCompleted:0}).then(() => {
            onGet();
        });
    };
    const handleDelete = (taskId) => {
        fetchWrapper.delete(`${baseTasksUrl}/${taskId}`).then(() => {
            onGet();
        });
    };
    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="input-group mb-3">
                        <span className="input-group-text">Name</span>
                        <input type="text" className="form-control" value={inputName} onChange={handleInputNameChange}/>
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text">Description</span>
                        <input type="text" className="form-control" value={inputDescription} onChange={handleInputDescriptionChange}/>
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text">Priority</span>
                        <input type="number" max="4" min="1" className="form-control" value={inputPriority} onChange={handleInputPriorityChange}/>
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text">Due date</span>
                        <input type="date" min={currentDateStr} className="form-control" value={inputDate} onChange={handleInputDateChange}/>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={onSubmit}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
            <h3 className="mb-5">{projectName}</h3>
            <h4 className="mb-3">Incompleted tasks</h4>
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-5" style={{tableLayout: "fixed"}}>
                    <thead>
                        <tr>
                            <th scope="col" className="col-1">#</th>
                            <th scope="col" className="col-2">Name</th>
                            <th scope="col" className="col-4">Description</th>
                            <th scope="col" className="col-1">Priority</th>
                            <th scope="col" className="col-2">Due date</th>
                            <th scope="col" className="col-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incompleteTasksData.length ? (
                            incompleteTasksData.map((task, index) => {
                                const dueDate = new Date(task.dueAt.split('T')[0]);
                                const isOverdue = dueDate < currentDate;
                                const className = isOverdue ? "text-danger" : "";
                                return (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{task.name}</td>
                                        <td>{task.description}</td>
                                        <td>{task.priority}</td>
                                        <td className={className}>{task.dueAt.split('T')[0]}{isOverdue && " (Overdue)"}</td>
                                        <td>
                                            <button className="btn btn-success me-3" onClick={() => handleComplete(task.id)}>Complete</button>
                                            <button className="btn btn-danger" onClick={() => handleDelete(task.id)}>Delete</button>
                                        </td>
                                    </tr>
                                );
                            }))
                            :
                            (<tr>
                                <td colSpan="6">There are no incompleted tasks.</td>
                            </tr>)
                        }
                        <tr>
                            <td colSpan="6"><div className='d-grid'><button className="btn btn-light " onClick={handleShow}><i className="fa-solid fa-plus"></i> Add</button></div></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h4 className="mb-3">Completed tasks</h4>
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-5" style={{tableLayout: "fixed"}}>
                    <thead>
                        <tr>
                            <th scope="col" className="col-1">#</th>
                            <th scope="col" className="col-2">Name</th>
                            <th scope="col" className="col-4">Description</th>
                            <th scope="col" className="col-1">Priority</th>
                            <th scope="col" className="col-2">Due date</th>
                            <th scope="col" className="col-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {completeTasksData.length ? (
                            completeTasksData.map((task, index) =>
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{task.name}</td>
                                    <td>{task.description}</td>
                                    <td>{task.priority}</td>
                                    <td>{task.dueAt.split('T')[0]}</td>
                                    <td>
                                        <button className="btn btn-warning me-3" onClick={() => handleInComplete(task.id)}>Incomplete</button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(task.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                            :
                            (<tr>
                                <td colSpan="6">There are no completed tasks.</td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}
