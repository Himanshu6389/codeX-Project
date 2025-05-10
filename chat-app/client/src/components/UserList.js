import React from 'react';

function UserList({ users }) {
  return (
    <div className="users-container">
      <h2>Active Users ({users.length})</h2>
      <ul className="user-list">
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;