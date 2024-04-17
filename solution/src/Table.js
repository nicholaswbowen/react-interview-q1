import React, {useMemo} from 'react';
import './Table.css';

const Table = ({ data }) => {
    // memoizes the Object to array mapping so it doesn't run every render.
    const tableValues = useMemo(
        () => Object.entries(data).map(([name, location]) => ({ name, location }) )
    ,[data]);
    return (
    <div className="table-container">
        <table className="table">
        <thead>
            <tr>
            <th>Name</th>
            <th>Location</th>
            </tr>
        </thead>
        <tbody>
            {tableValues.map((item, index) => (
            <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.location}</td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    );
};

export default Table;