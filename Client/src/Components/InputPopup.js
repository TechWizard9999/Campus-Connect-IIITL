import React, { useState } from 'react';

const InputPopup = ({ isOpen, type, onSave }) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave(inputValue);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="input-popup">
            <div className="popup-content retro-style">
                {type === 'name' && (
                    <>
                        <h2 className="retro-title">Enter Your Name</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                className="retro-input"
                                type="text"
                                placeholder="Your Name"
                                value={inputValue}
                                onChange={handleInputChange}
                            />
                            <button className="retro-button" type="submit">
                                Enter
                            </button>
                        </form>
                    </>
                )}
                {type === 'details' && (
                    <>
                        <h2 className="retro-title">Game Details</h2>
                        <p className="retro-content">
                            Abhi Blockchain baaki hai !!!

                        </p>
                        <button className="retro-button" onClick={onSave}>
                            Enter
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default InputPopup;
