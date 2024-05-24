import { IoSearchSharp } from 'react-icons/io5'

const SearchInput = ({ setSearchTerm }) => {

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault()
   
  }

  return (
    <form className='' onSubmit={handleSubmit}>
      <div className='flex items-center gap-2 relative'>
        <input
          name='search' type="text" placeholder='Search...' className="input input-bordered rounded-full w-full" onChange={handleInputChange} />
        <button type='submit' className='btn btn-circle bg-sky-500 text-white absolute right-0'>
          <IoSearchSharp className="w-7 h-7 outline-none" />
        </button>
      </div>
    </form>
  )
}

export default SearchInput