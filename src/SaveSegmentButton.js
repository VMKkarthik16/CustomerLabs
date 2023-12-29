import React, { useState, useEffect } from 'react';
import './App.css';

const SaveSegmentButton = () => {
  const initialAvailableSchemas = [
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' },
  ];

  const [showPopup, setShowPopup] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [availableSchemas, setAvailableSchemas] = useState(initialAvailableSchemas);
  const [newSchema, setNewSchema] = useState('');

  const handleAddNewSchema = () => {
    if (newSchema !== '') {
      setSelectedSchemas([...selectedSchemas, { label: newSchema, value: newSchema.toLowerCase().replace(/\s/g, '_') }]);
      setNewSchema('');
    }
  };

  const handleSaveSegment = () => {
    setShowPopup(false);
    const segmentData = {
      segment_name: segmentName,
      schema: selectedSchemas.map(schema => ({ [schema.value]: schema.label })),
    };
    fetch('https://webhook.site/c1373d6a-86f4-4414-8ef4-8d753c52556b', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(segmentData),
    })
      .then(response => {
        console.log('Data sent successfully:', response);
      })
      .catch(error => {
        console.error('Error sending data:', error);
      });
  };

  const handleRemoveSchema = (valueToRemove) => {
    const updatedSchemas = selectedSchemas.filter(schema => schema.value !== valueToRemove);
    setSelectedSchemas(updatedSchemas);
  };

  useEffect(() => {
    setAvailableSchemas(prevAvailableSchemas => {
      const unselectedOptions = prevAvailableSchemas.filter(
        schema => !selectedSchemas.some(selected => selected.value === schema.value)
      );
      return unselectedOptions;
    });
  }, [selectedSchemas]);

  const handleCancel = () => {
    setShowPopup(false);
    setSegmentName(''); 
    setSelectedSchemas([]);
    setNewSchema('');
    setAvailableSchemas(initialAvailableSchemas);
  };

  return (
    <div>
      {!showPopup && (
        <button className='Save-Segemt' onClick={() => setShowPopup(true)}>Save segment</button>
      )}
      {showPopup && (
        <div className="popup">
          <input
            className="input-field"
            type="text"
            placeholder="Enter segment name"
            value={segmentName}
            onChange={(e) => setSegmentName(e.target.value)}
          />
          <div className="blue-box">
            {selectedSchemas.map((schema, index) => (
              <div key={index} className="schema-dropdown">
                <select value={schema.label} onChange={(e) => handleRemoveSchema(schema.value)}>
                  <option value={schema.label}>{schema.label}</option>
                </select>
              </div>
            ))}
            <div className="schema-dropdown">
              <select className="select-field Select-Shem" value={newSchema} onChange={(e) => setNewSchema(e.target.value)}>
                <option value="">Select schema to add</option>
                {availableSchemas.map((schema, index) => (
                  <option key={index} value={schema.label}>
                    {schema.label}
                  </option>
                ))}
              </select>
              <button className="add-button" onClick={handleAddNewSchema}>+ Add new schema</button>
            </div>
          </div>
          <div>
            <button className="save-button" onClick={handleSaveSegment}>Save the segment</button>
            <button className="cancel-button" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaveSegmentButton;
