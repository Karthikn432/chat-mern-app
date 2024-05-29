import { IoIosAdd, IoIosAttach, IoIosSend, IoMdImage, IoMdVideocam } from 'react-icons/io'
import { useSendMessageMutation, useFileUploadMutation } from '../../features/rtkquery/app-query/usersQuery';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useRef } from 'react';
import FileFormatRead from './FileFormatRead';
import { formatFileSize } from '../../utils/utils';
import { LoadingProgressBar } from '../LoadingProgressBar';

const MessageInput = () => {
  const chatSelectedData = useSelector(state => state.chatContactsData);
  const { authUser } = useAuthContext()
  const { handleSubmit, formState: { errors }, register, reset, watch } = useForm();
  const message = watch('message', '');
  const [fileMetaInfo, setFileMetaInfo] = useState({
    name: "",
    size: "",
    fileDataURL: "",
    type: ""
  })
  const [sendMessage, { error, isLoading, isSuccess }] = useSendMessageMutation();
  const [uploadFile] = useFileUploadMutation()
  const [fileUploadLoading, setFileUploadLoading] = useState(false)
  const [isOpenFileAttach, setIsOpenFileAttach] = useState(false)
  const fileAttachRef = useRef(null);


  const [fileUrl, setFileUrl] = useState({
    path: null,
    type: null
  });

  const handleUpload = () => {
    setIsOpenFileAttach(preve => !preve)
  }

  const handleClickOutside = (event) => {
    if (fileAttachRef.current && !fileAttachRef.current.contains(event.target)) {
      setIsOpenFileAttach(false);
    }
  };

  useEffect(() => {
    if (isOpenFileAttach) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpenFileAttach]);


  const handleAttachFile = async (e) => {
    try {
      setFileUploadLoading(true)
      const file = e.target.files[0]
      const reader = new FileReader();

      reader.onload = async (event) => {
        const base64Data = await event.target.result.split(",")[1];
        // console.log({ base64Data });
        const fileMetaData = {
          name: file.name,
          size: file.size.toString(),
          fileDataURL: base64Data,
          type: file.type,
        }
        setFileMetaInfo(fileMetaData)
        const uploadPhoto = await uploadFile({ fileMetaData, id: chatSelectedData.id })
        if (uploadPhoto.data) {
          console.log('uploaded')
          setFileUrl({
            path: uploadPhoto.data.file_path,
            type: uploadPhoto.data.type
          })
          setFileUploadLoading(false)
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
        setFileMetaInfo({
          name: "",
          size: "",
          fileDataURL: "",
          type: ""
        })
        reset()
      } else {
        console.log({ error: result.error })
      }
    } catch (error) {
      console.log({ error })
    }
  }
  console.log({fileUploadLoading})

  return (

    <div className="px-8 md:px-16 lg:px-32 xl:px-64 my-3 ">

      {/* {
        fileMetaInfo.name !== "" && (
          <div className='p-1 flex gap-2 bg-white w-56 my-2 rounded-md mt-2 '>
            <div className='flex items-center'>
              {FileFormatRead(fileMetaInfo)}
            </div>
            <div className='flex-1 min-w-0 '>
              <p className='truncate font-bold'>{fileMetaInfo.name}</p>
              <p className='truncate text-start font-bold mt-1'>{formatFileSize(fileMetaInfo.size)}
               <span className='font-bold opacity-70'>size</span> 
              </p>
            </div>
            {
              fileUploadLoading && <LoadingProgressBar />
            }
          </div>
        )
      } */}






      {
        isOpenFileAttach && (
          <div className='bg-black border-2 border-gray-600 hover:bg-gray-500 text-white shadow rounded absolute bottom-14 w-40 p-2 opacity-75 my-5' ref={fileAttachRef}>
            <form>
              <label htmlFor='uploadImage' className='flex items-center  px-3 py-0.3 gap-1  cursor-pointer' >
                <div className='text-secondary'>
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
      <div className={`border text-sm rounded-lg block w-full  bg-gray-200 border-gray-600 text-gray-800 `} >
        {fileMetaInfo.name && (
          <div className='p-1 flex w-[250px] gap-2 bg-white rounded-md my-2 mx-10 border border-gray-600 relative'>
            <div className='flex items-center'>
              {/* Replace FileFormatRead with your actual function/component to display file format icon */}
              {FileFormatRead(fileMetaInfo)}
            </div>
            <div className='flex-1 min-w-0'>
              <p className='truncate font-bold'>{fileMetaInfo.name}</p>
              <p className='truncate text-start font-bold mt-1'>
                {/* Replace formatFileSize with your actual function to format file size */}
                {formatFileSize(fileMetaInfo.size)}
              </p>
            </div>
            {fileUploadLoading && (
              <div className='w-full absolute bottom-0 left-0 p-0.4'>
                <LoadingProgressBar />
              </div>
            )}
          </div>
        )}

        <div className="w-full relative">
          <button onClick={handleUpload} className='absolute mx-2 inset-y-0 start-0 flex items-center   text-black hover:opacity-50'>
            <IoIosAdd className='w-10 h-10 font-black' />
          </button>


          <form onSubmit={handleSubmit(onSubmit)} >
            <input
              type="text"
              className={`pl-16 text-lg rounded-lg block w-full h-14 bg-gray-200 border-gray-600 text-gray-800 `}
              placeholder='Send a message'
              name='message'
              {...register("message")}
            />
            <button
              type='submit'
              className={`absolute inset-y-0 end-0 flex items-center pe-3 text-gray-800 hover:opacity-50 ${!message || fileMetaInfo.name && "opacity-40" }`}
              disabled={!message && !fileMetaInfo.name }
            >
              <IoIosSend className='w-6 h-6' />
            </button>
          </form >
        </div>
      </div>
    </div>

  )
}

export default MessageInput