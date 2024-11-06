// src/components/DataTable.js
import React, { useEffect, useState } from 'react';

const DataTable = () => {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        const response = await fetch('http://localhost:5000/api/users');
        const result = await response.json();
        setData(result);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <h1>User Data</h1>
            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Password</th>
                        <th>About Me</th>
                        <th>Address</th>
                        <th>Birthdate</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((user, index) => (
                        <tr key={index}>
                            <td>{user.email}</td>
                            <td>{user.password}</td>
                            <td>{user.aboutMe}</td>
                            <td>{`${user.address.street}, ${user.address.city}, ${user.address.state} ${user.address.zip}`}</td>
                            <td>{user.birthdate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
