import React from 'react'
import InputField from '../../components/InputField'
import { Link, useNavigate } from 'react-router-dom'
import { routePath } from '../../routes/RoutePath'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { authValidation } from '../../validation/auth.validation'
import { useSigninMutation } from '../../features/rtkquery/auth-query/authApi'
import { useAuthContext } from '../../context/AuthContext'

const Login = () => {
  const [signIn, { error, isLoading, isSuccess }] = useSigninMutation();
  const navigate = useNavigate()

  const {setAuthUser} = useAuthContext()

  const { handleSubmit, formState: { errors }, register, control, setError } = useForm({
    resolver: joiResolver(authValidation.login()),
  });

  const onSubmit = async(data) => {
    try {
      const result = await signIn({
          username: data.username,
          password: data.password,
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
  const LoginFields = [
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
  ]

  return (
    <div>
      <h1 className="text-3xl font-semibold text-center text-gray-300">
        Login
        <span className='text-blue-500' > ChatApp</span>
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {LoginFields.map((field, idx) => (
          <InputField
            name={field.name}
            value={field.value}
            type={field.type}
            key={idx}
            errors={errors}
            register={register} />
        ))}

        {/* Forgot Link */}
        <Link to={routePath.auth.register} className='text-sm hover:underline  hover:text-blue-600 mt-2 inline-block'>
          {"Don't have as account?"}
        </Link>

        <div className='flex justify-center'>
          <button className='btn btn-sm mt-2 px-10 bg-slate-800 text-white hover:text-black' type='submit'>Login</button>
        </div>
      </form>

    </div>
  )
}

export default Login