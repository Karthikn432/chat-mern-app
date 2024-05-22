import React, { Children } from 'react'
import InputField from '../../components/InputField'
import GenderCheckBox from '../../components/GenderCheckBox'
import { Link, useNavigate } from 'react-router-dom'
import { routePath } from '../../routes/RoutePath'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { authValidation } from '../../validation/auth.validation'
import { useRegisterMutation } from '../../features/rtkquery/auth-query/authApi'
import { useAuthContext } from '../../context/AuthContext'

const RegisterFields = [
    {
        name: "Full Name",
        type: "text",
        value: "fullName"
    },
    {
        name: "Username",
        type: "text",
        value: "username"

    },
    {
        name: "Password",
        type: "password",
        value: "password"
    },
    {
        name: "Confirm Password",
        type: "password",
        value: "confirmPassword"
    },
]

const Register = () => {
    const [signUp, { error, isLoading, isSuccess }] = useRegisterMutation();
    const {authUser, setAuthUser} = useAuthContext()
    const navigate = useNavigate()
    const { handleSubmit, formState: { errors }, register, control, setError } = useForm({
        resolver: joiResolver(authValidation.register()),
    });

    const onSubmit = async (data) => {

        try {
            const result = await signUp({
                fullName: data.fullName,
                username: data.username,
                password: data.password,
                confirmPassword: data.confirmPassword,
                gender: data.gender,
            })

            if (result.error) {
                let errorType, msg;
                const errors = result.error.data.errors;
                console.log({ errors })
                const errorMsg = errors.map((error) => {
                    errorType = error.name,
                        msg = error.message
                });
                setError(errorType, { type: errorType, message: msg });
            }
            if (result.data) {
                localStorage.setItem("chat-user", JSON.stringify(result.data));
                setAuthUser(result.data)
                navigate(routePath.app.mainPage)
            }
            //  else {
            //     console.log("Something went wrong!")
            // }

        } catch (error) {
            console.log({ error: error.message });
        }
    }

    console.log({ errors })



    return (
        <div>
            <h1 className="text-3xl font-semibold text-center text-gray-300">
                Register
                <span className='text-blue-500' > ChatApp</span>
            </h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                {RegisterFields.map((field, idx) => (
                    <InputField
                        name={field.name}
                        value={field.value}
                        type={field.type}
                        key={idx}
                        errors={errors}
                        register={register}
                    />
                    /* 
                     {{errors[field.value] && (
                            <p className="text-red-500 text-start ps-5 p-1">{errors[field.value].message}</p>
                        )} 
                        */
                ))}

                <GenderCheckBox register={register} errors={errors} control={control} />

                {/* Forgot Link */}
                <div className='flex justify-end'>
                    <Link to={routePath.auth.login} className=' text-sm hover:underline text-blue-300  hover:text-white my-6 self-end'>
                        {"Already have an account?"}
                    </Link>
                </div>

                <div className='flex justify-center'>
                    <button
                        className='btn btn-sm px-10 bg-slate-800 text-white hover:text-black'
                        type='submit
                    '>{isLoading ? (
                            <span className="loading loading-dots loading-lg"></span>
                        ) : "Sign Up"}</button>
                </div>
            </form>

        </div>
    )
}

export default Register