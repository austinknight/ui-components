
import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import _ from 'lodash';
import { RequiredText } from '../RequiredText/RequiredText';
import { isValued } from './utils';

import { checkDocumentEvent, openOptionsList, closeOptionsList, toggleOptionsListOnSearch } from '../SelectInput';
import SelectOptions from '../SelectInput/SelectOptions';
import {
  colors,
  typography,
  renderThemeIfPresentOrDefault,
  renderThemeKeyOrDefaultValue,
  ifThemeInPropsIsPresentUse
} from '../styles';
import PropTypes from 'prop-types';

const padding = '16px';

export const Label = styled.div`
  color: ${props => {
    if (props.error) {
      return renderThemeKeyOrDefaultValue({ props, key: 'warning01', defaultValue: colors.red });
    }
    return renderThemeKeyOrDefaultValue({ props, key: 'white90', defaultValue: props.theme.labelColor || colors.black40 })
  }};
  transition: all 200ms;
  transform: translateY(-50%);
  position: absolute;
  left: ${(props) => {
    if (props.theme.leftDisplayPosition) {
      return props.theme.leftDisplayPosition;
    }

    return padding;
  }};
  top: 50%;

  ${props => isValued(props.value) && `
    top: 30%;
    ${typography.caption}
  `}
`

const Caret = styled.div`
  position: absolute;
  right: 24px;
  top: ${(props) => {
    if (props.theme.caretTopPosition) {
      return props.theme.caretTopPosition;
    }

    return '50%';
  }};
  transform: translateY(-50%);
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    margin: auto;
    border-left: 5px transparent solid;
    border-right: 5px transparent solid;
    border-${props => props.open ? 'bottom' : 'top'}: 5px ${props => {
      if (props.theme.borderColor){
        return renderThemeKeyOrDefaultValue({ props, key: 'brand01', defaultValue: props.theme.borderColor });
      }
      return props.open ? renderThemeKeyOrDefaultValue({ props, key: 'white90', defaultValue: colors.black90 }) : renderThemeKeyOrDefaultValue({ props, key: 'white40', defaultValue: colors.black40 });
    }} solid;
  }
`;

export const Value = styled.div`
  border: 0;
  display: block;
  width: 100%;
  text-align: left;
  ${typography.subhead1};
  color: ${props => {
    if (props.error) {
      return renderThemeKeyOrDefaultValue({ props, key: 'warning01', defaultValue: colors.red });
    }
    if (props.isPlaceHolder) {
      return renderThemeKeyOrDefaultValue({ props, key: 'white60', defaultValue: colors.black60 });
    }

    if (props.theme.valueColor){
      return renderThemeKeyOrDefaultValue({ props, key: 'white90', defaultValue: props.theme.valueColor });
    }
    return renderThemeKeyOrDefaultValue({ props, key: 'white90', defaultValue: colors.black90 })
  }};
  height: 56px;
  padding: 22px 26px 0 ${(props) => {
    if (props.theme.leftDisplayPosition) {
      return props.theme.leftDisplayPosition;
    }

    return padding;
  }};
  background: ${(props) => {
    if (props.theme.background) {
      return renderThemeKeyOrDefaultValue({ props, key: 'primary03', defaultValue: props.theme.background });
    }

    return renderThemeKeyOrDefaultValue({ props, key: 'primary03', defaultValue: colors.grayA });
  }};
  box-sizing: border-box;
  border-bottom-width: ${(props) => {
    if (props.theme.borderWidth) {
      return props.theme.borderWidth;
    }

    return '2px';
  }};
  border-bottom-style: solid;
  border-bottom-color: ${props => {
    if (props.isDisabled){
      return 'transparent';
    } else if (props.error) {
      return renderThemeKeyOrDefaultValue({ props, key: 'warning01', defaultValue: colors.red });
    } else if (props.theme.borderColor) {
      return renderThemeKeyOrDefaultValue({ props, key: 'white40', defaultValue: props.theme.borderColor });
    }

    return renderThemeKeyOrDefaultValue({ props, key: 'white40', defaultValue: colors.black40 });
  }};
  cursor: ${props => props.isDisabled ? 'auto' : 'pointer'};
  border-radius: ${(props) => {
    if (props.theme.borderRadius) {
      return props.theme.borderRadius;
    }

    return '2px';
  }};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;



export const Wrapper = styled.div`
  position: relative;
  ${typography.subhead1};
  width: ${(props) => {
    if (props.theme.selectDisplayWidth) {
      return props.theme.selectDisplayWidth;
    }

    return 'auto';
  }};
`;

export const SelectToggle = styled.button`
  display: block;
  background: transparent;
  border: 0;
  width: 100%;
  padding: 0;
  margin: 0;
  outline: 0;
  cursor: pointer;
  ${typography.subhead1}
  ${props => props.isDisabled && `
    opacity: 0.6;
  `}

  &:focus ${Value} {
    outline: 0;
    border-color: ${props => {
      if (props.error) {
        return renderThemeKeyOrDefaultValue({ props, key: 'warning01', defaultValue: colors.red });
      }
      return props.isDisabled ? renderThemeKeyOrDefaultValue({ props, key: 'white10', defaultValue: 'transparent' }) : renderThemeKeyOrDefaultValue({ props, key: 'white', defaultValue: colors.green })
    }};
  }
`;

export default class SelectInputLabelBox extends React.Component {

  constructor() {
    super();
    this.state = {
      optionsListVisible: false,
      searchFilter: ''
    }
  }

  checkDocumentEvent = (e) => { checkDocumentEvent.call(this, e) }

  openOptionsList = () => { openOptionsList.call(this) }

  closeOptionsList = () => { closeOptionsList.call(this) }

  toggleOptionsList = (e) => { toggleOptionsListOnSearch.bind(this)(e) }

  filterOptions = (searchFilter) => {
    this.setState({
      searchFilter
    });
  }

  filterOptionsWithSearch = (options) => _.filter(options, (option) => {
    if (!_.isObject(option)) return true;
    if ( !(_.isString(option.label) || _.isObject(option.label)) ) return true;
    if (_.isObject(option.label) && !_.isString(option.optionValue)) return true;

    const labelString = _.isString(option.label) ? option.label : option.optionValue;
    const searchFilter = this.state.searchFilter || '';
    return _.includes(labelString.toLowerCase(), searchFilter.toLowerCase());
  });


  onChange = (newValue) => {
    if(this.props.multiSelect) {
      if(_.includes(this.props.value, newValue)) {
        this.props.onChange(_.without(this.props.value, newValue));
      } else if (_.isArray(this.props.value)) {
        this.props.onChange(_.concat(this.props.value, [newValue]));
      } else {
        this.props.onChange([newValue]);
      }
    } else {
      this.props.onChange(newValue);
      this.closeOptionsList();
    }
  }

  renderRequiredText = () => {
    const { required, value } = this.props;
    const message = "Required";

    if (!value && !_.isBoolean(value) && !this.state.optionsListVisible && required) {
      return (<RequiredText>{message}{required}</RequiredText>);
    }
  }

  determineLabel = () => {
    const { defaultLabel, options, promotedOptions, value, multiSelect } = this.props;

    let copiedOptions = _.map(options, _.clone);

    if (promotedOptions && promotedOptions.length) {
      copiedOptions = [...promotedOptions, ...options];
    }

    let inputLabel;
    let placeholder = '';

    if (defaultLabel) {
      placeholder = defaultLabel;
    }

    // Determine what the input label should be
    if (!_.isNil(value)) {
      const optionObject = _.find(copiedOptions, { value });

      if (multiSelect && _.isArray(value) && _.size(value)) {
        inputLabel = `${_.size(value)} Selected`;
      } else if (optionObject && optionObject.label) {
        inputLabel = optionObject.label;
      } else {
        inputLabel = placeholder;
      }
    } else {
      inputLabel = placeholder;
    }

    return inputLabel || this.props.value;
  }

  render() {
    const optionLabel = this.determineLabel();

    const options = this.filterOptionsWithSearch(this.props.options);
    const promotedOptions = this.filterOptionsWithSearch(this.props.promotedOptions);

    return (
      <ThemeProvider theme={this.props.theme}>
        <Wrapper
          className={this.props.className}
          ref={(el) => { this.clickEventElement = el }}
          >
          <SelectToggle
          onClick={this.toggleOptionsList} isDisabled={this.props.isDisabled}
          className="pb-test__select-input"
          >
            <Caret open={this.state.optionsListVisible} />
            <Label error={this.props.error}value={this.props.value}>{this.props.label}</Label>
            <Value
              open={this.state.optionsListVisible}
              isDisabled={this.props.isDisabled}
              title={optionLabel}
              isPlaceHolder={this.props.isPlaceHolder}
              className="select-input-label-box-value"
              error={this.props.error}
            >{optionLabel}</Value>
          </SelectToggle>
          {this.renderRequiredText()}
          <SelectOptions
            isDisabled={this.props.isDisabled}
            selectedOptions={this.props.value}
            promotedOptions={promotedOptions}
            onOptionUpdate={this.onChange}
            options={options}
            width={this.props.optionsWidth}
            hideDivider={_.isEmpty(this.props.options)}
            visible={this.state.optionsListVisible}
            multiSelect={this.props.multiSelect}
            maxHeight="240px"
            searchable={this.props.searchable}
            onSearch={this.filterOptions}
          />
        </Wrapper>
      </ThemeProvider>
    )
  }
}

SelectInputLabelBox.defaultProps = {
  value: '',
  label: '',
  isDisabled: false,
  theme: {},
  isPlaceHolder: false,
  error: false,
  onChange: _.noop
}

SelectInputLabelBox.propTypes = {
  value: PropTypes.any,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any,
    label: PropTypes.any,
  })).isRequired,
  onChange: PropTypes.func,
  label: PropTypes.string,
  isDisabled: PropTypes.bool,
  isPlaceHolder: PropTypes.bool,
  multiSelect: PropTypes.bool,
  searchable: PropTypes.bool,
  error: PropTypes.bool
}
