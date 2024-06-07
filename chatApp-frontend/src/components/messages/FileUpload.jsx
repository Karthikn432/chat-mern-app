import { useEffect, useRef, useState } from 'react';
import { useFileUploadMutation } from '../../features/rtkquery/app-query/usersQuery';
import { IoIosAttach } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { filesDispatch } from '../../features/slice/fileSlice';

const FileUpload = ({ setFileUploadLoading, bottomValue, fileAttachRef, context }) => {
    const chatSelectedData = useSelector(state => state.chatContactsData);
    const dispatch = useDispatch();
    const [uploadFile] = useFileUploadMutation();
    const [isOpenFileAttach, setIsOpenFileAttach] = useState(false);

    const handleUpload = () => {
        setIsOpenFileAttach(prev => !prev);
    };

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
            setFileUploadLoading(true);
            const files = e.target.files;
            const fileUploads = Array.from(files).map(async (file) => {
                const fileData = new FormData();
                fileData.append('file', file);

                try {
                    const result = await uploadFile({ id: chatSelectedData.id, fileData }).unwrap();
                    if (result.file_path) {
                        await dispatch(filesDispatch({
                            context,  // Pass the context to differentiate
                            path: result.file_path,
                            type: result.type,
                            name: result.fileName,
                            size: result.size,
                        }));
                    }
                } catch (err) {
                    console.error('Failed to upload the file: ', err);
                }
            });

            await Promise.all(fileUploads);
            setFileUploadLoading(false);
            handleUpload();
        } catch (error) {
            console.log({ error });
            setFileUploadLoading(false);
        }
    };

    return (
        <div className={`mx-2 absolute flex items-center ${bottomValue ? bottomValue : 'bottom-3'}`} ref={fileAttachRef}>
            <label htmlFor='uploadFiles' className='cursor-pointer'>
                <div className='text-secondary'>
                    <IoIosAttach className='w-6 h-6 font-black' />
                </div>
            </label>
            <input
                type='file'
                id='uploadFiles'
                multiple
                onChange={handleAttachFile}
                className='hidden'
            />
        </div>
    );
};

export default FileUpload;
