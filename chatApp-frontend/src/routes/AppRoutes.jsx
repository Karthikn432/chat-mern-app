import { Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import { Suspense } from "react";
import AppLayout from "../layouts/AppLayout";
import Login from "../screens/auth/Login";
import { routePath } from "./RoutePath";
import NotFound from "../screens/unAuthorize/NotFound";
import Register from "../screens/auth/Register";
import Home from "../screens/app/Home";
import PrivateRoute from "./PrivateRoute";


const AppRoutes = () => {
    return (
        <Routes>
            {/* Auth Routes starts */}
            <Route path={routePath.home} element={<AuthLayout />}>
                <Route path={routePath.auth.login} element={<Suspense fallback={null}><Login /></Suspense>} />
                <Route path={routePath.auth.register} element={<Suspense fallback={null}><Register /></Suspense>} />
            </Route>

            {/* App Routes start */}
            <Route path={routePath.home} element={<PrivateRoute><AppLayout /></PrivateRoute>}>
                <Route path={`${routePath.app.mainPage}`} element={<Suspense fallback={null}><Home /></Suspense>} />
            </Route>
            {/* Invalid Route */}
            <Route path='*' element={<Suspense fallback={null}><NotFound /></Suspense>} />
            {/* App Route ends */}
        </Routes>
    )
}

export default AppRoutes;
