import { useForm } from 'react-hook-form';
import { IoIosAttach, IoMdCheckmark, IoMdClose } from 'react-icons/io';
import { useEditMessageMutation } from '../../features/rtkquery/app-query/usersQuery';
import { resetSelectedMsg } from '../../features/slice/selectedChatSlice';
import { useDispatch, useSelector } from 'react-redux';
import { resetEditMsg } from '../../features/slice/editChatSlice';
import FileUpload from './FileUpload';
import { LoadingProgressBar } from '../LoadingProgressBar';
import { useEffect, useRef, useState } from 'react';
import FileFormatRead from './FileFormatRead';
import { formatFileSize } from '../../utils/utils';
import { editFilesMetaData, resetEditFile } from '../../features/slice/editFileSlice';
import { resetEditFiles } from '../../features/slice/fileSlice';

const EditMsgInput = ({ editMsgData }) => {
    const dispatch = useDispatch();
    const fileAttachRef = useRef(null);
    const [editMessage] = useEditMessageMutation();
    const { handleSubmit, formState: { errors }, register, reset, setError } = useForm();
    const editFilesData = useSelector(state => state.filesData);
    const [fileMetaInfo, setFileMetaInfo] = useState(editMsgData?.filepath)
    const [fileUploadLoading, setFileUploadLoading] = useState(false)

    console.log({ fileMetaInfo })

    useEffect(() => {
        if (editFilesData?.editFiles.length) {
            setFileMetaInfo(editFilesData?.editFiles)
        }
    }, [editFilesData])

    const handleInput = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const handleClearEdit = () => {
        dispatch(resetEditMsg());
        dispatch(resetEditFiles())
    };

    const onSubmit = async (data) => {
        try {
            if (data?.editMessage) {
                const result = await editMessage({
                    message: data?.editMessage,
                    fileUrls: fileMetaInfo.map(file => ({
                        path: file.path,
                        type: file.type,
                        name: file.name,
                        size: file.size
                      })),
                    id: editMsgData._id
                });

                if (result.data) {
                    await dispatch(resetSelectedMsg());
                    reset();
                    handleClearEdit();
                } else {
                    console.log({ error: result.error });
                }
            } else {
                setError("message", { type: "message", message: "Please Enter Message" });
            }
        } catch (error) {
            console.log({ error });
        }
    };

    return (
        <div className='rounded-lg px-3 relative max-h-52 my-8 w-[200px] sm:w-[450px] md:w-[300px] lg:w-[400px] xl:w-[600px] 2xl:w-[750px] bg-white'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='relative'>
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

                    {/* <div className={`mx-2 absolute  flex items-center ${bottomValue} ? ${bottomValue} : bottom-3`} ref={fileAttachRef}>
                        <label htmlFor='uploadImage' className='cursor-pointer ' >
                            <div className='text-secondary'>
                                <IoIosAttach className='w-6 h-6 font-black' />
                            </div>
                        </label>

                        <input
                            type='file'
                            id='uploadImage'
                            onChange={handleAttachFile}
                            className='hidden'
                        />
                    </div> */}
                    {/* <div className={`mx-2 absolute  flex items-center ${bottomValue} ? ${bottomValue} : bottom-3`} ref={fileAttachRef}>
                        <label htmlFor='uploadImage' className='cursor-pointer ' >
                            <div className='text-secondary'>
                                <IoIosAttach className='w-6 h-6 font-black' />
                            </div>
                        </label>

                        <input
                            type='file'
                            id='uploadImage'
                            onChange={handleAttachFile}
                            className='hidden'
                        />
                    </div> */}
                    <FileUpload
                        bottomValue="-bottom-8"
                        filesDispatch={editFilesMetaData}
                        setFileUploadLoading={setFileUploadLoading}
                        fileAttachRef={fileAttachRef}
                        isEditClick={true}
                        context="edit"
                    />
                    <textarea
                        className="peer min-h-[auto] py-2 w-full max-h-28 pl-3 border-0 resize-none overflow-auto border-b-2 border-blue-500 outline-none"
                        defaultValue={editMsgData?.message}
                        placeholder="Edit message"
                        {...register("editMessage")}
                        onChange={handleInput}
                    />
                    <div className='absolute -bottom-7 end-0 gap-2 flex items-center pe-3 text-white'>
                        <button type='submit'>
                            <IoMdCheckmark className='w-6 h-6' />
                        </button>
                        <button type="button" onClick={handleClearEdit}>
                            <IoMdClose className='w-6 h-6' />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
 
export default EditMsgInput;
