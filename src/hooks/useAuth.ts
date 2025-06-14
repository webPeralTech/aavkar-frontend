import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RootState } from '../redux-store';
import { login, logout } from '../redux-store/slices/auth';

export const useAuth = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const auth = useSelector((state: RootState) => state.auth);

    const loginUser = (email: string, password: string) => {
        dispatch(login({ email, password }) as any);
    };

    const logoutUser = () => {
        dispatch(logout());
        router.replace('/login');
    };

    // Redirect to dashboard after login
    useEffect(() => {
        if (auth.token && auth.user) {
            router.replace('/dashboards/crm');
        }
    }, [auth.token, auth.user, router]);

    return {
        ...auth,
        loginUser,
        logoutUser,
    };
};
