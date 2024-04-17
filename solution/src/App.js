import React, { useState, useEffect } from 'react';
import { useDebouncedCallback } from "use-debounce";
import './App.css';
import { isNameValid, getLocations } from './mock-api/apis';
import Table from './Table';
import BeatLoader from 'react-spinners/BeatLoader'

const errorMessages = {
  TAKEN: "This name has already been taken",
  INVALID: "This name is invalid"
}

const App = () => {
  const [name, setName] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [options, setOptions] = useState([]); 
  const [location, setLocation] = useState('');
  const [tableData, setTableData] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const isError = errorMessage.length > 0;
  const nameIsEmpty = name.length === 0;
  const addDisabled = isValidating || isError || nameIsEmpty;

  const debouncedValidate = useDebouncedCallback(
    (value) => {

      if(tableData[name]){
        setErrorMessage(errorMessages.TAKEN);
      } else {
        setIsValidating(true);
        isNameValid(value).then((valid) => {
          setIsValidating(false);
          if (!valid){
            setErrorMessage(errorMessages.INVALID);
          }
        })
      }
    },
    400
  );
  
  useEffect(() => {
    getLocations().then((data) => {
      setOptions(data);
      setLocation(data[0]);
    })
  }, []);

  const handleNameChange = (e) => {
    setErrorMessage('');
    setName(e.target.value);
    debouncedValidate(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleClear = () => {
    setName('');
    setErrorMessage('')
    setLocation(options[0] || '');
    setTableData([]);
  };

  const handleAdd = () => {
    if (!isError && !nameIsEmpty){
      setTableData({ ...tableData, [name]: location });
      setName('')
    }
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Name:</label>
          <input id="name" type="text" value={name} onChange={handleNameChange} className="form-input" />
          {isError > 0 ? 
            <p className="error-message">{errorMessage}</p> : null
          }
        </div>
        <div className="form-group">
          <label htmlFor="location" className="form-label">Location:</label>
          <select id="location" value={location} onChange={handleLocationChange} className="form-select">
            {options.map(option => <option value="Canada">{option}</option>)}
          </select>
        </div>
        <div className="form-loader">{isValidating ? <BeatLoader size={15}/> : null}</div>
        <div className="form-actions">
          <button onClick={handleClear} className="form-button">Clear</button>
          <button onClick={handleAdd} className="form-button" disabled={addDisabled}>Add</button>
        </div>
        <Table data={tableData}/>
      </div>
    </div>
  );
};

export default App; 