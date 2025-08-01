import React, { useEffect, useState } from 'react';

function MainScreen() {
    const [students, setStudents] = useState([]);

    async function fetchStudents() {
        try {
            const response = await fetch('https://687b2e5…….mockapi.io/users');
            if (!response.ok) {
                throw new Error(`Failed to fetch students: ${response.status} ${response.statusText}`);
            }
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid JSON response');
            }
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.error('MainScreen: Error fetching students:', error);
        }
    }

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div>
            <h1>Students</h1>
            <ul>
                {students.map(student => (
                    <li key={student.id}>{student.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default MainScreen;