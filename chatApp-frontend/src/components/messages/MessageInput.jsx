import { IoIosAdd, IoIosAttach, IoIosSend, IoMdImage, IoMdVideocam } from 'react-icons/io'
import { useSendMessageMutation, useFileUploadMutation } from '../../features/rtkquery/app-query/usersQuery';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';

const MessageInput = () => {
  const chatSelectedData = useSelector(state => state.chatContactsData);
  const { authUser } = useAuthContext()
  const { handleSubmit, formState: { errors }, register, reset } = useForm();

  const [sendMessage, { error, isLoading, isSuccess }] = useSendMessageMutation();
  const [uploadFile] = useFileUploadMutation()

  const [isOpenFileAttach, setIsOpenFileAttach] = useState(false)
  const [fileUrl, setFileUrl] = useState({
    path: null,
    type: null
  })

  const handleUpload = () => {
    setIsOpenFileAttach(preve => !preve)
  }

  const handleAttachFile = async (e) => {
    try {
      const file = e.target.files[0]
      const reader = new FileReader();

      reader.onload = async (event) => {
        const base64Data = await event.target.result.split(",")[1];
        // console.log({ base64Data });
        const fileMetadata = {
          name: file.name,
          size: file.size.toString(), // Convert file.size to string
          fileDataURL: base64Data,
          type: file.type,
        };
        const uploadPhoto = await uploadFile({ fileMetadata, id: chatSelectedData.id })
        if (uploadPhoto.data) {
          console.log({ out: uploadPhoto.data.file_path })
          setFileUrl({
            path: uploadPhoto.data.file_path,
            type: uploadPhoto.data.type
          })
        } else {
          console.log({ err: uploadPhoto.error })
        }
      }

      reader.readAsDataURL(file);
      handleClearAttachedFile()
      handleUpload()
    } catch (error) {
      handleUpload()
    }
  };

  const handleClearAttachedFile = () => {
    setFileUrl({
      path: null,
      type: null
    })
  }

  const onSubmit = async (data) => {
    try {
      const result = await sendMessage({ message: data.message, fileUrl, id: chatSelectedData.id })
      if (result.data) {
        setFileUrl({
          path: null,
          type: null
        })
        console.log({ resssssssss: result.data })
        reset()
      } else {
        console.log({ error: result.error })
      }
    } catch (error) {
      console.log({ error })
    }
  }

  return (

    <div className="px-8 md:px-16 lg:px-32 xl:px-64 my-3 relative">

      <div className="w-full relative ">
        <button onClick={handleUpload} className='absolute inset-y-0 start-0 flex items-center pe-3  text-white hover:opacity-50'>
          <IoIosAdd className='w-10 h-10 font-black' />
        </button>

        {
          isOpenFileAttach && (
            <div className='bg-white shadow rounded absolute bottom-14 w-36 p-2 opacity-75'>
              <form>
                <label htmlFor='uploadImage' className='flex items-center  px-3 py-0.3 gap-1 hover:bg-slate-200 cursor-pointer'>
                  <div className='text-primary'>
                    <IoIosAttach className='w-6 h-6 font-black' />
                  </div>
                  <p>Attach File</p>
                </label>

                <input
                  type='file'
                  id='uploadImage'
                  onChange={handleAttachFile}
                  className='hidden'
                />
              </form>
            </div>
          )
        }

        <form onSubmit={handleSubmit(onSubmit)} >
          <input
            type="text"
            className="border pl-16 text-sm rounded-lg block w-full h-12 p-2.5 bg-gray-700 border-gray-600 text-white"
            placeholder='Send a message'
            name='message'
            {...register("message")}
          />
          <button type='submit' className="absolute inset-y-0 end-0 flex items-center pe-3 text-white hover:opacity-50">
            <IoIosSend className='w-6 h-6' />
          </button>
        </form >
      </div>
    </div>

  )
}

export default MessageInput