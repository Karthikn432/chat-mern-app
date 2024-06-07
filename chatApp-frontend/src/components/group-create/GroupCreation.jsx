import React, { useState } from 'react'
import { IoIosCheckmarkCircleOutline, IoIosSend } from 'react-icons/io';
import { IoAdd, IoClose, IoCloseCircle } from 'react-icons/io5';
import { useAuthContext } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { useGetConversationUsersQuery } from '../../features/rtkquery/app-query/usersQuery';
import SearchInput from '../sidebar/SearchInput';
import { useCreateGroupMutation } from '../../features/rtkquery/app-query/groupChat';

function GroupCreation() {
    const { authUser } = useAuthContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [addMembers, setAddMembers] = useState([]);
    const [confirmedMembers, setConfirmedMembers] = useState([])
    const showNoOfBatchs = 2;


    const { data: conversationUsers, isLoading } = useGetConversationUsersQuery({
        search: searchTerm,
        page: "",
        per_page: "",
    });

    const [GroupCreationApi] = useCreateGroupMutation()

    const { handleSubmit, formState: { errors }, register, reset, watch, setError, clearErrors } = useForm();

    const handleCreateGroupModalOpen = () => {
        document.getElementById('group-modal').showModal()
    }

    const handleAdddMembersModalOpen = () => {
        document.getElementById('members-modal').showModal()
    }



    const handleAddRemoveMembers = (id, name) => {
        setAddMembers((prevMembers) => {
            const isMemberPresent = prevMembers.some((member) => member.id === id);

            const newMember = { id, name };

            return isMemberPresent
                ? prevMembers.filter((member) => member.id !== id)
                : [...prevMembers, newMember]
        });
    };

    const handleConfirmedUsers = () => {
        console.log('called')
        setConfirmedMembers(addMembers)
        if (addMembers.length > 0) {
            clearErrors("participants")
        }
        document.getElementById('members-modal').close();
    }
   
    const onSubmit = async(data) => {
        console.log({ data });
        if (!data.groupName) {
            return setError("groupName", { type: "manual", message: "Please Enter Group Name" });
        }
        if (confirmedMembers.length === 0) {
            return setError("participants", { type: "manual", message: "Please add one or more participants" });
        }
        try {
            const result = await GroupCreationApi({groupName : data.groupName, participants : confirmedMembers})
            if(result.data){
                console.log({out : result.data})
            }else{
                console.log({err : result.error})
            }
            console.log('onSubmit')
            setIsModalOpen(false)
            setConfirmedMembers([])
            setAddMembers([])
            reset()
        } catch (error) {
            console.error("Group creation failed:", error);
        }
    };



    return (
        <>
            <div className=''>
                <div className="tooltip" data-tip="Create Group">
                    <button className="btn btn-outline btn-warning btn-md rounded-full bg-white" onClick={() => setIsModalOpen(true)}>
                        <IoAdd className='w-6 h-6 text-black' />
                    </button>
                </div>
            </div>

            {
                isModalOpen && (
                    <dialog className="modal modal-open">
                        <div className="modal-box rounded-2xl">
                            <form onSubmit={handleSubmit(onSubmit)} >
                                    <button 
                                    type='button' 
                                    className='btn btn-sm btn-error btn-circle absolute -right-0.5 -top-0.5'
                                    onClick={() => setIsModalOpen(false)}
                                    >
                                        <IoClose className='w-6 h-6 text-white'/>
                                    </button>
                                    <div className='flex flex-col gap-5 items-center p-4'>
                                    <input
                                        type="text"
                                        className={`pl-5 text-lg rounded-lg block w-full h-14 bg-gray-200 border-gray-600 text-gray-800 `}
                                        placeholder='Group name'
                                        name='groupName'
                                        // defaultValue={editMsgData?.message}
                                        {...register("groupName")}
                                    />
                                    <div className="mt-2">
                                        {Object.keys(errors).map((key) => (
                                            <p
                                                key={key}
                                                className="text-red-500 font-bold tracking-wider text-xs rounded-t-md py-2 text-start ps-5 p-1"
                                            >
                                                {errors[key].message}
                                            </p>
                                        ))}
                                    </div>

                                    {
                                        confirmedMembers.length ? (
                                            <div className='flex flex-col items-center gap-5'>
                                                <p> Group Members : {confirmedMembers.length}</p>
                                                <div className='flex gap-2'>
                                                    {
                                                        confirmedMembers.slice(0, showNoOfBatchs).map((member) => (
                                                            <div key={member.id} className="badge badge-secondary py-3 px-3">{member.name}</div>
                                                        ))
                                                    }
                                                    {
                                                        confirmedMembers.length > showNoOfBatchs && (
                                                            <div className="badge badge-info py-3 px-3">
                                                                +{confirmedMembers.length - showNoOfBatchs} more
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        ) : (
                                            <p className='text-'>No members added</p>
                                        )
                                    }

                                    <button
                                        className='btn btn-outline btn-warning font-semibold rounded-full'
                                        onClick={handleAdddMembersModalOpen}
                                        type='button'
                                    >
                                        Add Members+
                                    </button>
                                    <button
                                        className={`btn btn-accent`}
                                        type='submit'
                                    >
                                        Create Group <IoIosSend className='w-6 h-6' />
                                    </button>
                                </div>
                            </form >
                        </div>
                    </dialog>
                )
            }


            <dialog id="members-modal" className="modal">
                <div className="modal-box flex flex-col gap-3 sm:w-80 min-h-[500px] overflow-auto px-8 ">
                    <p className='bg-gray-500 text-white font-semibold py-2 px-2 text-center rounded-md'>Selected Members : {addMembers.length}</p>
                    <SearchInput setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
                    <div className='mt-4'>
                        {
                            conversationUsers?.filteredUsers && (
                                conversationUsers.filteredUsers?.map((member, idx) => (
                                    <div key={idx} className={`flex gap-5 items-center hover:bg-yellow-500 rounded-xl p-2 py-1 cursor-pointer border-2  mt-2`}
                                        onClick={() => handleAddRemoveMembers(member._id, member.fullName)}
                                    >
                                        <div className='avatar'>
                                            <div className="w-8 rounded-full">
                                                <img src={member?.profilePic} alt="user avatar" />
                                            </div>
                                        </div>

                                        <div className="flex flex-col flex-1">
                                            <div className="flex gap-3 justify-between">
                                                <p className="font-bold text-black">{member.fullName}</p>
                                            </div>
                                        </div>
                                        {
                                            addMembers.map((user, idx) => (
                                                member._id === user.id && (
                                                    <div className='bg-white rounded-full' key={idx}>
                                                        <IoIosCheckmarkCircleOutline className='w-6 h-6 text-success' />
                                                    </div>
                                                )

                                            ))
                                        }
                                    </div>
                                ))
                            )
                        }
                    </div>

                    <div className='mt-auto flex justify-center'>
                        <button
                            type='button'
                            onClick={handleConfirmedUsers} className='btn btn-sm btn-success tracking-wider text-md'>
                            Confirm
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    )
}

export default GroupCreation;
