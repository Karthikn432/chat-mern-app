import { IoIosSend } from 'react-icons/io'
import { useSendMessageMutation } from '../../features/rtkquery/app-query/usersQuery';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

const MessageInput = () => {
  const chatSelectedData = useSelector(state => state.chatContactsData);

  const { handleSubmit, formState: { errors }, register, reset } = useForm();

  const [sendMessage, { error, isLoading, isSuccess }] = useSendMessageMutation();

  const onSubmit = async (data) => {
    try {
      const result = await sendMessage({ message: data.message, id: chatSelectedData.id })
      if (result.data) {
        console.log({ out: result.data })
        reset()
      } else {
        console.log({ error: result.error })
      }
    } catch (error) {
      console.log({ error })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="px-4 my-3">
        <div className="w-full relative">
          <input
            type="text"
            className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white"
            placeholder='Send a message'
            name='message'
            {...register("message")}
          />
          <button type='submit' className="absolute inset-y-0 end-0 flex items-center pe-3 hover:text-white">
            <IoIosSend />
          </button>
        </div>
      </div>
    </form>
  )
}

export default MessageInput