import React from 'react'
import { useForm } from 'react-hook-form';
import { IoIosSend, IoMdCheckmark, IoMdClose } from 'react-icons/io';

const EditMsgInput = ({ editMsgData }) => {

    const { handleSubmit, formState: { errors }, register, reset, watch } = useForm();
    const onSubmit = () => {
        console.log('submitted')
    }

    return (
        <div className=' h-20 rounded-md p-2'>
            <form onSubmit={handleSubmit(onSubmit)} >
                <input
                    type="text"
                    className={`focus:border-red-400 appearance-none `}
                    placeholder='Send a message'
                    name='message'
                    defaultValue={editMsgData?.message}
                    {...register("Editmessage")}
                />

                <div className='relative'>
                    {/* <textarea
                        class="peer min-h-[auto] max-h-52 w-[400px] rounded border-0 bg-white px-3 py-[0.32rem] leading-[1.6] "
                        id="exampleFormControlTextarea1"
                        rows="2"
                        defaultValue={editMsgData?.message}
                        placeholder="Edit message">
                    </textarea> */}

                    <div className='absolute end-0 bottom-7 flex items-center pe-3'>
                        <button
                            type='submit'
                            className={` text-white hover:opacity-50 `}

                        >
                            <IoMdCheckmark className='w-6 h-6' />
                        </button>

                        <button
                            type='submit'
                            className={` text-white hover:opacity-50 `}

                        >
                            <IoMdClose className='w-6 h-6' />
                        </button>
                    </div>
                </div>
            </form >
        </div>
    )
}

export default EditMsgInput