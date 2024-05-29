import { IoFileTray, IoImage, IoMusicalNote, IoPlay, IoText, IoVideocam } from 'react-icons/io5';
import { routesApi } from '../../routes/RoutePath';

const FileFormatRead = (fileMetaData) => {
    console.log({fileMetaData})
    // const { name,
    //     size,
    //     fileDataURL,
    //     type } = fileMetaData;
    console.log({type :fileMetaData?.type})

    switch (fileMetaData?.type) {

        case 'image/png':
        case 'image/jpeg':
        case 'image/svg+xml':
            return <IoImage className='w-10 h-14 text-red-500' />;
        case 'video/mp4':
            return <IoPlay className='w-10 h-14 text-red-500 ' />;
        case 'audio/mpeg':
            return <IoMusicalNote className='w-10 h-14 text-red-500' />;
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            return <IoFileTray className='w-10 h-14 text-red-500' />;;
        case 'text/plain':
            return <IoText className='w-10 h-14 text-red-500' />;
        default:
            return <IoImage className='w-10 h-14 text-red-500' />;
    }
};

export default FileFormatRead
