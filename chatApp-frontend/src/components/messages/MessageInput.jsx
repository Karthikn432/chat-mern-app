import { IoIosAdd, IoIosAttach, IoIosSend, IoMdImage, IoMdVideocam } from 'react-icons/io'
import { useSendMessageMutation, useFileUploadMutation } from '../../features/rtkquery/app-query/usersQuery';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useRef } from 'react';
import FileFormatRead from './FileFormatRead';
import { extractTime, formatFileSize } from '../../utils/utils';
import { LoadingProgressBar } from '../LoadingProgressBar';
import { IoClose } from 'react-icons/io5';
import { resetSelectedMsg } from '../../features/slice/selectedChatSlice';
import FileUpload from './FileUpload';
import MessageOptions from './MessageOptions';
import { resetMessageFiles } from '../../features/slice/fileSlice';

const MessageInput = () => {
  const chatSelectedData = useSelector(state => state.chatContactsData);
  const selectedMsgData = useSelector(state => state.selectedMsgData);
  const messageFilesData = useSelector(state => state.filesData);
  const [fileMetaInfo, setFileMetaInfo] = useState(messageFilesData?.messageFiles)
  const [fileUploadLoading, setFileUploadLoading] = useState(false)
  const fileAttachRef = useRef(null);
  const dispatch = useDispatch()
  const { authUser } = useAuthContext()
  const { handleSubmit, formState: { errors }, register, reset, watch, setError } = useForm();
  const message = watch('message', '');

  const [sendMessage, { error, isLoading, isSuccess }] = useSendMessageMutation();
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleClearSeletedChat = () => {
    dispatch(resetSelectedMsg())
  }

  useEffect(() => {
    if (messageFilesData?.messageFiles) {
      setFileMetaInfo(messageFilesData?.messageFiles)
    }
  }, [messageFilesData])
  const onSubmit = async (data) => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    try {
      if (data?.message || (fileMetaInfo && fileMetaInfo.length > 0)) {
        console.log('input filed')
        const result = await sendMessage({
          message: data.message,
          fileUrls: fileMetaInfo.map(file => ({
            path: file.path,
            type: file.type,
            name: file.name,
            size: file.size
          })),
          id: chatSelectedData.id,
          repliedTo: selectedMsgData?._id
        });

        if (result.data) {
          await dispatch(resetSelectedMsg());
          await dispatch(resetMessageFiles())
          reset();
        } else {
          console.log({ error: result.error });
        }
      }
      else {
        console.log('errors')
        setError("message", { type: "message", message: "Please Enter Message" })
      }

    } catch (error) {
      console.log({ error });
    } finally {
      setIsSubmitted(false);
    }
  };


  return (

    <div className="px-8 md:px-16 lg:px-32 xl:px-64 my-3 relative ">
      <div className={`border text-sm rounded-lg block w-full  bg-gray-200 border-gray-600 text-gray-800 relative `} >
        {
          selectedMsgData && (
            <div className='p-1 w-[250px] gap-2 bg-white rounded-md my-2 mx-10 border border-gray-600 relative'>
              <div className='flex gap-2 items-center'>
                <p className='font-bold'>{selectedMsgData.senderId === authUser._id ? authUser.fullName : chatSelectedData.name}</p>
                <p className='opacity-80 text-xs'>{extractTime(selectedMsgData?.createdAt)}</p>
              </div>
              <div className='flex items-center'>
                <button className='absolute top-0 right-0 rounded-full hover:bg-gray-600 m-0.5' onClick={handleClearSeletedChat}>
                  <IoClose className=' w-6 h-6 hover:text-white' />
                </button>
                {
                  selectedMsgData?.filepath && (
                    <div className='flex gap-3 items-center font-semibold'>
                      {FileFormatRead(selectedMsgData?.filepath?.type)}
                      <p>{selectedMsgData?.filepath?.name}</p>
                    </div>
                  )
                }
                <div>
                  <p>{selectedMsgData?.message}</p>
                </div>
              </div>
            </div>
          )
        }

        {
          errors["message"] && (
            <p className="text-gray-700 font-bold tracking-wider text-xs rounded-t-md py-2 bg-gray-400 text-start ps-5 p-1">{errors["message"].message}</p>
          )
        }

        <div className="w-full relative z-0">
          {fileMetaInfo &&
            fileMetaInfo?.map((file, idx) => (
              <div key={idx} className='p-1 flex w-[250px] gap-2 bg-white rounded-md my-2 mx-10 border border-gray-600 relative'>
                <div className='flex items-center'>
                  {FileFormatRead(file.type)}
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='truncate font-bold'>{file.name}</p>
                  <p className='truncate text-start font-bold mt-1'>
                    {formatFileSize(file.size)}
                  </p>
                </div>
                {fileUploadLoading && (
                  <div className='w-full absolute bottom-0 left-0 p-0.4'>
                    <LoadingProgressBar />
                  </div>
                )}
              </div>
            ))
          }
          <FileUpload
            setFileUploadLoading={setFileUploadLoading}
            fileAttachRef={fileAttachRef}
            isEditClick={false}
            context="message"
          />



          <form onSubmit={handleSubmit(onSubmit)} >
            <input
              type="text"
              className={`pl-16 text-lg rounded-lg block w-full h-14 bg-gray-200 border-gray-600 text-gray-800 `}
              placeholder='Send a message'
              name='message'
              // defaultValue={editMsgData?.message}
              {...register("message")}
            />
            <button
              type='submit'
              className={`absolute end-0 bottom-3 flex items-center pe-3 text-gray-800 hover:opacity-50 ${!message || fileMetaInfo.name && "opacity-40"}`}
              disabled={!message && !fileMetaInfo.name && isSubmitted}
            >
              <IoIosSend className='w-6 h-6' />
            </button>
          </form >

        </div>
      </div>
    </div >
  )
}

export default MessageInput