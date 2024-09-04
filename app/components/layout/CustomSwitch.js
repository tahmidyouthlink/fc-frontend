import React from 'react';

const CustomSwitch = ({ checked, onChange }) => {
  return (
    <label className="custom-switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="custom-switch-input"
      />
      <span className="custom-switch-slider" />
    </label>
  );
};

export default CustomSwitch;