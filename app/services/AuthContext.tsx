// AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import supabase from './client';

interface AuthContextProps {
  children: ReactNode;
}

export interface User{
    email: string;
    name: string;
    priority: number;
    id: string;
  } ;


interface AuthContextValue {
  user: User |null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const [user, setUser] = useState<{ email: string; name: string; priority: number; id: string } | null>(null);

  const login  = async(email: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('emailid, password')
        .eq('emailid', email)
        .eq('password', password)
        .single(); // Assuming only one user should match the credentials
        console.log(data);
      if (data) {
        let { data: teacherData, error: teacherError } = await supabase
        .from('teacher')
        .select('email, name, priority, tid')
        .eq('email', email)
        .single();

        if (!teacherData) {
            let { data: studentData, error: studentError } = await supabase
            .from('student')
            .select('email, name, priority, usn')
            .eq('email', email)
            .single();
    
            if (!studentData) {
                let { data: adminData, error: adminError } = await supabase
                .from('admin')
                .select('email, name, priority, id')
                .eq('email', email)
                .single();

                // If found in "admins" table, set user data
                if (adminData) {
                    setUser(adminData);
                } 
                else {
                // Handle authentication error for "admins" table
                    console.error('Admin authentication failed:', adminError?.message);
                }
            } else {
                // If found in "students" table, set user data
                setUser({
                    email: studentData.email,
                    name: studentData.name,
                    priority: studentData.priority,
                    id: studentData.usn,  // Assuming usn is used as id for students
                });
            }
            } else {
            // If found in "teachers" table, set user data
            setUser({
                email: teacherData.email,
                name: teacherData.name,
                priority: teacherData.priority,
                id: teacherData.tid,
            });
        }

      } else {
        // Handle authentication error
        console.error('Authentication failed:', error?.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  };

  const logout = () => {
    setUser(null);
  };



  return <AuthContext.Provider value={ {user,login,logout}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
