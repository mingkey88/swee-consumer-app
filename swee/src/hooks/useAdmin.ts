'use client';

import { useState, useEffect } from 'react';

interface AdminUser {
  name: string;
  email: string;
  role: string;
}

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for admin access in localStorage
    const adminAccess = localStorage.getItem('adminAccess');
    const adminUserData = localStorage.getItem('adminUser');
    
    if (adminAccess === 'true' && adminUserData) {
      try {
        const userData = JSON.parse(adminUserData);
        setIsAdmin(true);
        setAdminUser(userData);
      } catch (error) {
        // Clear invalid admin data
        localStorage.removeItem('adminAccess');
        localStorage.removeItem('adminUser');
        setIsAdmin(false);
        setAdminUser(null);
      }
    } else {
      setIsAdmin(false);
      setAdminUser(null);
    }
    
    setLoading(false);
  }, []);

  const loginAsAdmin = (userData: AdminUser) => {
    localStorage.setItem('adminAccess', 'true');
    localStorage.setItem('adminUser', JSON.stringify(userData));
    setIsAdmin(true);
    setAdminUser(userData);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('adminAccess');
    localStorage.removeItem('adminUser');
    setIsAdmin(false);
    setAdminUser(null);
  };

  return {
    isAdmin,
    adminUser,
    loading,
    loginAsAdmin,
    logoutAdmin,
  };
}
