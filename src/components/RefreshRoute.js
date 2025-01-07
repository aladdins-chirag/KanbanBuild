import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function RefreshRoute() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const userID = localStorage.getItem('userID');

        // If the user is logged in and tries to access /, redirect to /dashboard
        if (userID && location.pathname === '/') {
            navigate('/dashboard');
        }

        // Prevent navigating back to / when already logged in
        const handleBackButton = (e) => {
            if (userID && location.pathname === '/') {
                e.preventDefault();
                navigate('/dashboard', { replace: true });  // Replace in history stack to prevent back navigation
            }
        };

        window.addEventListener('popstate', handleBackButton);

        return () => {
            window.removeEventListener('popstate', handleBackButton);  // Cleanup listener when component unmounts
        };

    }, [location, navigate]);

    return null;
}

export default RefreshRoute;






// import { useEffect } from 'react'
// import { useLocation, useNavigate } from 'react-router-dom'

// function RefreshRoute() {
//     const location = useLocation()
//     const navigate = useNavigate()

//     useEffect(() => {
//         if (location.pathname === '/dashboard' && localStorage.getItem('userID') !== null) {
//             navigate('/dashboard')
//         }
//     }, [location, navigate])
//     return (
//         null
//     )
// }

// export default RefreshRoute