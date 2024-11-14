import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <strong>First Name:</strong> {user?.firstname}
            </div>
            <div>
              <strong>Last Name:</strong> {user?.lastname}
            </div>
            <div>
              <strong>Email:</strong> {user?.username}
            </div>
            <Button
              variant="outline"
              onClick={() => {
                logout();
                toast.success('Logged out successfully');
              }}
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;       