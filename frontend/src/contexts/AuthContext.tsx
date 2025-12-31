import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    async function signUp(email: string, password: string) {
        await createUserWithEmailAndPassword(auth, email, password);
    }

    async function signIn(email: string, password: string) {
        await signInWithEmailAndPassword(auth, email, password);
    }

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    }

    async function signOut() {
        await firebaseSignOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
