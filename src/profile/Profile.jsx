import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
//import { useSelector } from 'react-redux';
import { fetchWrapper } from '_helpers';
import { authActions } from '_store';
import { useForm } from "react-hook-form";

import "./profile.css"
export { Profile };

function Profile() {
    document.title = "Profile";
    const dispatch = useDispatch();
    //const { user: authUser } = useSelector(x => x.auth);
    const logout = () => dispatch(authActions.logout());
    const { handleSubmit, formState } = useForm();
    const { isSubmitting } = formState;
    const baseUrl = `${process.env.REACT_APP_API_URL}/users`;
    const [inputUserName, setInputUserName] = useState('');

    const [inputFirstName, setInputFirstName] = useState('');

    const handleInputFirstNameChange = (event) => {
        setInputFirstName(event.target.value);
    };

    const [inputLastName, setInputLastName] = useState('');

    const handleInputLastNameChange = (event) => {
        setInputLastName(event.target.value);
    };

    function onGet()
    {
        fetchWrapper.get(`${baseUrl}/user`).then((response) => {
            setInputUserName(response.username)
            setInputFirstName(response.firstName);
            setInputLastName(response.lastName);
        });
    }
    useEffect(() => {
        onGet();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onSubmit = async () => {
        fetchWrapper.put(`${baseUrl}/user`, { firstName: inputFirstName, lastName: inputLastName }).then(() => {
            onGet();
        });
    }
    return (
        <div>
            <div className="form__container text-center">
                <div className="text-center form__container-header">
                    <h3>MY PROFILE</h3>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-group mb-3">
                        <span className="input-group-text">User name</span>
                        <input type="text" className="form-control" value={inputUserName} disabled />
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text">First name</span>
                        <input type="text" className="form-control" value={inputFirstName} onChange={handleInputFirstNameChange} />
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text">Last name</span>
                        <input type="text" className="form-control" value={inputLastName} onChange={handleInputLastNameChange} />
                    </div>
                    <div className="row m-0">
                        <button disabled={isSubmitting} className="btn btn-primary col me-1">
                            {isSubmitting && <span className="spinner-grow spinner-grow-sm"></span>}
                            Update profile
                        </button>
                        <button type="button" onClick={logout} className="btn btn-primary col ms-1">Logout</button>
                    </div>
                </form>
            </div>
        </div>
    );
}