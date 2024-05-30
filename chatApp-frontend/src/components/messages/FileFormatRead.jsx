import { IoDocumentText, IoFileTray, IoFileTrayStacked, IoImage, IoMusicalNote, IoPlay, IoText, IoVideocam } from 'react-icons/io5';
import { routesApi } from '../../routes/RoutePath';

const FileFormatRead = (type) => {
    const fileType = type.split('/')[0];
    switch (fileType) {

        case 'image':
            return <IoImage className='w-10 h-14 text-red-500' />;
        case 'video':
            return <IoPlay className='w-10 h-14 text-red-500 ' />;
        case 'audio':
            return <IoMusicalNote className='w-10 h-14 text-red-500' />;
        case 'application':
            return <IoDocumentText className='w-10 h-10 text-gray-600' />;;
        case 'text':
            return <IoDocumentText className='w-10 h-14 text-red-300' />;
        default:
            return <IoImage className='w-10 h-14 text-red-500' />;
    }
};

export default FileFormatRead
