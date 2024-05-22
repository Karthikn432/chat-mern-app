import React from 'react'
import { Controller } from 'react-hook-form'

const GenderCheckBox = ({ register, errors,control }) => {

    const GenderOptions = [
        {
            name: "Male",
            value: "male"
        },
        {
            name: "Female",
            value: "female"

        }
    ]
    return (
        <div className="flex">
      {GenderOptions.map((option, idx) => (
        <div className="form-control" key={idx}>
          <Controller
            name="gender"
            control={control}
            rules={{ required: "Gender is required" }}
            render={({ field }) => (
              <label className={`label gap-2 cursor-pointer`}>
                <span className="label-text text-gray-300">{option.name}</span>
                <input
                  type="radio"
                  className={`radio ${option.name === "Male" ? "radio-warning" : "radio-secondary"}`}
                  {...field}
                  value={option.value}
                  checked={field.value === option.value}
                />
              </label>
            )}
          />
        </div>
      ))}
      {errors.gender && (
        <p className="text-red-500 text-start ps-5 p-1">{errors.gender.message}</p>
      )}
    </div>
    )
}

export default GenderCheckBox