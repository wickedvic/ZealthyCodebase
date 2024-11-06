import React, { useState, useEffect } from 'react';

const Admin = () => {
    const [pageComponents, setPageComponents] = useState({});

    // Fetch configuration from Firebase when component mounts
    useEffect(() => {
        const fetchPageConfig = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/getPageConfig');
                const data = await response.json();
                setPageComponents(data); // Set initial state from Firebase data
            } catch (error) {
                console.error('Error fetching page configuration:', error);
            }
        };

        fetchPageConfig();
    }, []);

    const handleChange = (page, component) => {
        const newComponents = { ...pageComponents };
        if (!newComponents[page].includes(component)) {
            newComponents[page].push(component);
        } else {
            newComponents[page] = newComponents[page].filter(c => c !== component);
        }
        setPageComponents(newComponents);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/saveComponents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pageComponents }), // Send updated components as JSON
            });

            const data = await response.json();
            
            if (response.ok) {
                console.log('Data saved successfully:', data);
            } else {
                console.error('Error saving data:', data.message);
            }
        } catch (error) {
            console.error('Error sending data to backend:', error);
        }
    };

    return (
        <div>
            <h1>Admin Section</h1>
            <h2>Page 2 Components</h2>
            <label>
                <input type="checkbox" checked={pageComponents.page2?.includes('birthdate')} onChange={() => handleChange('page2', 'birthdate')} />
                Birthdate
            </label>
            <label>
                <input type="checkbox" checked={pageComponents.page2?.includes('aboutMe')} onChange={() => handleChange('page2', 'aboutMe')} />
                About Me
            </label>
            <h2>Page 3 Components</h2>
            <label>
                <input type="checkbox" checked={pageComponents.page3?.includes('address')} onChange={() => handleChange('page3', 'address')} />
                Address
            </label>
            <button onClick={handleSubmit}>Save Configuration</button>
        </div>
    );
};

export default Admin;
