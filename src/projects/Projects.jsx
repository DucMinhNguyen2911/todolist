import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { NavLink } from 'react-router-dom';
import { ProjectList } from './ProjectList';
import { fetchWrapper } from '_helpers';
//import { useSelector } from "react-redux";
export { Projects };

function Projects(props) {
    document.title = "Projects";
    //const { user: authUser } = useSelector(x => x.auth);
    const [show, setShow] = useState(false);
    const [reloadChild, setReloadChild] = useState();
    useEffect(() => {
        // This code will run whenever props.isArchived changes
        setReloadChild(props.isArchived);
    }, [props.isArchived]);

    //console.log(reloadChild);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [inputName, setInputName] = useState('');

    const handleInputChange = (event) => {
        setInputName(event.target.value);
    };
    const baseUrl = `${process.env.REACT_APP_API_URL}/projects`;
    const onSubmit = async () => {
        setShow(false);
        fetchWrapper.post(`${baseUrl}`, { name: inputName }).then(() => {
            setReloadChild((existingData) => {
                return 3-existingData;
            });
        });
    }
    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="input-group mb-3">
                        <span className="input-group-text">Name</span>
                        <input type="text" className="form-control" value={inputName} onChange={handleInputChange} />
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
            <h3 className="mb-3">Projects</h3>
            <div>
                <ul className="nav nav-pills mb-4 float-start">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/projects/active">Active</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/projects/archived">Archived</NavLink>
                    </li>
                </ul>
                <Button variant="light" onClick={handleShow} className="float-end"><i className="fa-solid fa-plus"></i> Add project</Button>
            </div>
            <br />
            <br />
            <br />
            <ProjectList key={reloadChild} isArchived={props.isArchived} />
        </div>
    );
}
