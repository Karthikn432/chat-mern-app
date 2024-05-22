import React from 'react'

const InputField = ({ name, type, value, errors, register }) => {
    return (
        <div className='my-3'>
            <label className='label p-2'>
                <span className="text-base label-text text-gray-300 ">{name}</span>
            </label>
            <input type={type} placeholder={`Enter ${name}`}
                className="w-full input input-bordered h-10"
                {...register(value)}
            />
            {errors[value] && (
                <p className="text-red-500 text-start ps-5 p-1">{errors[value].message}</p>
            )}
        </div>
    )
}

export default InputField