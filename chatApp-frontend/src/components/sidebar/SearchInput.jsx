import { IoSearchSharp } from 'react-icons/io5'

const SearchInput = ({ setSearchTerm }) => {

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault()
   
  }

  // const conversation = 

  return (
    <form className='' onSubmit={handleSubmit}>
      <div className='flex items-center gap-2'>
        <input
          name='search' type="text" placeholder='Search...' className="input input-bordered rounded-full" onChange={handleInputChange} />
        <button type='submit' className='btn btn-circle bg-sky-500 text-white'>
          <IoSearchSharp className="w-6 h-6 outline-none" />
        </button>
      </div>
    </form>

  )
}

export default SearchInput