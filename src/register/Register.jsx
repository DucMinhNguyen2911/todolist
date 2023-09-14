import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector} from 'react-redux';
import * as Yup from 'yup';
import { fetchWrapper } from '_helpers';
import { history } from '_helpers';

export { Register };

function Register() {
    document.title = "Register";
    const authUser = useSelector(x => x.auth.user);
    useEffect(() => {
        // redirect to home if already logged in
        if (authUser) history.navigate('/');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // form validation rules 
    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required'),
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('last name is required'),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    const baseUrl = `${process.env.REACT_APP_API_URL}/users`;
    const onSubmit = async({username,firstName,lastName,password}) => {
        fetchWrapper.post(`${baseUrl}/register`,{username,firstName,lastName,password}).then((response) => {
            history.navigate('/login')
        });
    }
    return (
        <div className="col-md-6 offset-md-3 mt-5 login__container">
            <div className="card">
                <h4 className="card-header">Register</h4>
                <div className="card-body text-center">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="input-group mb-3">
                            <span className="input-group-text">User name</span>
                            <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.username?.message}</div>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text">Password</span>
                            <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text">First name</span>
                            <input name="password" type="text" {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.firstName?.message}</div>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text">Last name</span>
                            <input name="password" type="text" {...register('lastName')} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.lastName?.message}</div>
                        </div>
                        <div className="d-grid">
                            <button disabled={isSubmitting} className="btn btn-primary mb-3">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Register
                            </button>
                        </div>
                        <p className="m-0">Already have an account? <Link to="/login">Sign in</Link></p>
                    </form>
                </div>
            </div>
        </div>
    )
}
