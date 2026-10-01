import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/users',{
          headers: {
            Authorization: `Bearer ${token}`,
          },}); 
      setUsers(response.data);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  if (loading) return <div className="loading-msg">Loading users...</div>;
if (error) return <div className="error-msg">{error}</div>;
if (users.length === 0) return <div className="loading-msg">No users available.</div>;


return (
  <div className="user-list-container">
    <table className="user-table">
      <thead>
        <tr>
          <th className="user-th">Username</th>
          <th className="user-th">Email</th>
          <th className="user-th">Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id} className="user-tr">
            <td className="user-td">{user.username}</td>
            <td className="user-td">{user.email}</td>
            <td className="user-td">{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

};

export default UserList;