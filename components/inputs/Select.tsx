import React, { CSSProperties } from 'react';
import Select, { ControlProps } from 'react-select';

const StyledSelect = (props: any) => {
  const customStyles = {
    control: (provided: CSSProperties, state: ControlProps) => ({
      ...provided,
      '&:hover': {
        borderColor: 'rgba(255, 255, 255, 1)',
      },
      background: 'none',
      borderColor: state.isFocused
        ? 'rgba(255, 255, 255, 1)'
        : 'rgba(255, 255, 255, 0.5)',
      borderRadius: '10px',
      borderWidth: '2px',
      boxShadow: 'none',
      color: 'white',
      cursor: 'pointer',
    }),

    dropdownIndicator: (provided: CSSProperties) => ({
      ...provided,
      '&:hover': {
        color: 'rgba(255, 255, 255, 1)',
      },
      color: 'rgba(255, 255, 255, 0.6)',
    }),

    input: (provided: CSSProperties) => ({
      ...provided,
      color: 'white',
    }),

    menu: (provided: CSSProperties) => ({
      ...provided,
      background: '#561253',
      borderRadius: '10px',
      zIndex: 10,
    }),

    option: (provided: CSSProperties, state: any) => ({
      ...provided,
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.2)',
      },
      background: state.isSelected ? 'rgba(255, 255, 255, 0.2)' : 'none',
      color: 'white',
      cursor: 'pointer',
    }),
    placeholder: (provided: CSSProperties) => ({
      ...provided,
      color: 'rgba(255,255,255, 0.6)',
    }),
    singleValue: (provided: CSSProperties) => ({
      ...provided,
      color: 'white',
    }),
  };

  return (
    <Select
      {...props}
      styles={customStyles}
    />
  );
};

export default StyledSelect;
