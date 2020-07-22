import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _ from 'lodash';
import { typography, colors, renderThemeKeyOrDefaultValue } from "../styles";

import Dropdown from './Dropdown';
import Label from './Label';
import Caret from './Caret';

const Wrapper = styled.div`
  outline: none;
  user-select: none;
`;

const OptionLabel = styled.span`
  padding: 22px 26px 0 16px;
  color: ${props => renderThemeKeyOrDefaultValue({ props, key: 'white90', defaultValue: colors.white90 })};
`;

const SelectToggle = styled.div`
  position: relative;
  display: flex;
  align-items: normal;
  outline: none;
  width: 100%;
  height: 56px;
  padding: 0;
  text-align: left;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  border: 0;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-radius: 2px;
  border-bottom-color: ${props => {
    if(props.isFocused) {
      return renderThemeKeyOrDefaultValue({ props, key: 'white90', defaultValue: colors.black40 });
    }
    return renderThemeKeyOrDefaultValue({ props, key: 'white40', defaultValue: colors.black40 });
  }};

  cursor: ${props => props.isDisabled ? 'auto' : 'pointer'};

  color: ${props => renderThemeKeyOrDefaultValue({ props, key: 'white60', defaultValue: colors.black60 })};
  background: ${props => renderThemeKeyOrDefaultValue({ props, key: 'primary03', defaultValue: props.theme.background })};

  ${typography.subhead1};
`;

function getNextFocusedOption({isOpen, focusedOption, optionsLength, direction}) {
  if (!isOpen) return focusedOption;
  if (typeof focusedOption !== 'number') return 0;
  if (direction === 'next') {
    return (focusedOption + 1) % optionsLength;
  } else {
    if (focusedOption === 0) {
      return optionsLength - 1;
    }
    return (focusedOption - 1);
  }
}

function handleButtonClick(setState) {
  return function () {
    setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
  }
}

function handleBlur(event) {
  console.log('>>', 'handleBlur');
  this.timeoutID = setTimeout(() => {
    if(this.state.isFocused) {
      this.setState({
        isFocused: false,
        isOpen: false
      });
    }
  }, 0);
}

function handleFocus(event) {
  console.log('>>', 'handleFocus');
  clearTimeout(this.timeoutID);
  if(!this.state.isFocused) {
    this.setState({
      isFocused: true
    });
  }
}

const validKeys = [' ', 'Enter', 'ArrowDown', 'ArrowUp'];

function handleKeyDown({
  setState,
  wrapperElement,
  options,
  isMultiSelect,
  onChange,
  focusedOption,
  isOpen,
  currentOption
}) {
  return function (event) {
    console.log('>>', event.key, options);
    if (!validKeys.includes(event.key)) return;
    if (!isOpen) {
      setState({ isOpen: true });
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOptionSelected({
        setState: setState,
        wrapperElement: wrapperElement,
        isMultiSelect: isMultiSelect,
        onChangeFunction: onChange,
        currentOption: currentOption
      })(options[focusedOption]);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setState({
        isOpen: true,
        focusedOption: getNextFocusedOption({
          isOpen: isOpen,
          focusedOption: focusedOption,
          optionsLength: options.length,
          direction: 'next'
        })
      });
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setState({
        isOpen: true,
        focusedOption: getNextFocusedOption({
          isOpen: isOpen,
          focusedOption: focusedOption,
          optionsLength: options.length,
          direction: 'previous'
        })
      });
      return;
    }

  }
}

function handleOptionSelected({setState, wrapperElement, isMultiSelect, onChangeFunction, currentOption}) {
  return function (option) {
    console.log('>>', 'handleOptionSelected', isMultiSelect, onChangeFunction, 'currentOption: ', currentOption, 'option: ', option);

    wrapperElement.focus();
    setState({
      isOpen: false
    });

    if(isMultiSelect) {
      if (currentOption.includes(option.value)) {
        onChangeFunction(_.without(currentOption, option.value))
      } else {
        onChangeFunction([...currentOption, option.value]);
      }
    } else {
      onChangeFunction(option.value);
    }
  }
}

function isValued(value) {
  if(value === undefined || value === null) return false;
  else if (typeof value === 'boolean') return true;
  else if (typeof value === 'number') return true;
  else if (typeof value === 'string' && value.length > 0) return true;
  else if (Array.isArray(value) && value.length > 0) return true;
  else if (typeof x === 'symbol') return true;

  return typeof value === 'object' && Object.keys(value).length > 0;
}

function SelectedOption(props) {
  const label = () => {
    if (props.isMultiSelect && props.selectedOptions.length > 0) {
      return `${props.selectedOptions.length} Selected`;
    }
    return props.selectedOptions;
  }

  return (
    <OptionLabel>
      {label()}
    </OptionLabel>
  )
}

class Select extends React.Component {
  constructor() {
    super();
    this.state = {
      isFocused: false,
      isOpen: false,
      focusedOption: undefined
    }

    this.setState = this.setState.bind(this);
  }

  render() {
    return (
      <Wrapper
        tabIndex={0}
        onBlur={handleBlur.bind(this)}
        onFocus={handleFocus.bind(this)}
        innerRef={wrapperElement => this.wrapperElement = wrapperElement}
        onKeyDown={handleKeyDown({
          setState: this.setState,
          wrapperElement: this.wrapperElement,
          options: [...this.props.promotedOptions, ...this.props.options],
          isMultiSelect: this.props.multiSelect,
          onChange: this.props.onChange,
          focusedOption: this.state.focusedOption,
          isOpen: this.state.isOpen,
          currentOption: this.props.value
        })}
      >
        <SelectToggle
          tabIndex={-1}
          onClick={handleButtonClick(this.setState)}
          isFocused={this.state.isFocused}
        >
          <Label
            isOptionSelected={isValued(this.props.value)}
            label={this.props.label}
          />
          <Caret isOpen={this.state.isOpen} />
          <SelectedOption
            selectedOptions={this.props.value}
            options={[...this.props.promotedOptions, ...this.props.options]}
            isMultiSelect={this.props.multiSelect}
          />
        </SelectToggle>
        <Dropdown
          onSelect={handleOptionSelected({
            setState: this.setState,
            wrapperElement: this.wrapperElement,
            isMultiSelect: this.props.multiSelect,
            onChangeFunction: this.props.onChange,
            currentOption: this.props.value
          })}
          isOpen={this.state.isOpen}
          isMultiSelect={this.props.multiSelect}
          options={this.props.options}
          promotedOptions={this.props.promotedOptions}
          focusedOption={this.state.focusedOption}
          selectedOptions={this.props.value}
        />
      </Wrapper>
    );
  }
}

Select.defaultProps = {
  value: '',
  label: '',
  options: [],
  promotedOptions: [],
  isDisabled: false,
  theme: {},
  isPlaceHolder: false,
  error: false,
  required: false,
  onChange: _.noop
}

Select.propTypes = {
  value: PropTypes.any,
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any,
    label: PropTypes.any,
  })).isRequired,
  promotedOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any,
    label: PropTypes.any,
  })),
  onChange: PropTypes.func,
  isDisabled: PropTypes.bool,
  isPlaceHolder: PropTypes.bool,
  required: PropTypes.bool,
  multiSelect: PropTypes.bool,
  searchable: PropTypes.bool,
  error: PropTypes.bool
}

export default Select;