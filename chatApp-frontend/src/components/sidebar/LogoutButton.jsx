import { CiLogout } from "react-icons/ci";
import { useLogoutMutation } from "../../features/rtkquery/auth-query/authApi";
import { useNavigate } from "react-router-dom";
import { routePath } from "../../routes/RoutePath";
import { useAuthContext } from "../../context/AuthContext";


const LogoutButton = () => {
  const navigate = useNavigate()
  const { authUser, setAuthUser } = useAuthContext()
  const [logOut, { error, isLoading, isSuccess }] = useLogoutMutation()

  const handleLogout = async () => {
    const result = await logOut()
    if (result.data) {
      setAuthUser(null)
      localStorage.removeItem("chat-user")
      navigate(routePath.auth.login)
    }
  }
  return (
    <div className='mt-auto'>
      <div className="hover:bg-white text-white hover:text-gray-800 rounded-full p-2 w-10 h-10 cursor-pointer "  onClick={handleLogout} >
        <CiLogout className="w-6 h-6"/>
      </div>
    </div>
  )
}

export default LogoutButton