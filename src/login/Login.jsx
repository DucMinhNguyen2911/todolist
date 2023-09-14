import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
//import { history } from '_helpers';
import { authActions } from '_store';

export { Login };

function Login() {
    document.title = "Login";
    const dispatch = useDispatch();
    const authUser = useSelector(x => x.auth.user);
    const authError = useSelector(x => x.auth.error);
    const navigate = useNavigate();
    useEffect(() => {
        // redirect to home if already logged in
        if (authUser) 
        {
            navigate('/path/to/page');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    // form validation rules 
    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    function onSubmit({ username, password }) {
        return dispatch(authActions.login({ username, password }));
    }

    return (
        <div className="col-md-6 offset-md-3 mt-5 login__container">
            <div className="card">
                <h4 className="card-header">Login</h4>
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
                        <div className="d-grid">
                            <button disabled={isSubmitting} className="btn btn-primary mb-3">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Login
                            </button>
                        </div>
                        {authError &&
                            <div className="alert alert-danger mb-3">{authError.message}</div>
                        }
                        <p className="m-0">Don’t have an account? <Link to="/register">Sign up</Link></p>
                    </form>
                </div>
            </div>
        </div>
    )
}
