import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class CustomSelect extends Component {
    static propTypes = {
        value: PropTypes.any.isRequired,
        onChange: PropTypes.func.isRequired,
        options: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            showOptions: false
        };
    }

    _toggleShow = () => {
        const {showOptions} = this.state;

        this.setState({
            showOptions: !showOptions
        });
    };

    _setValue = (value) => {
        const {onChange} = this.props;

        onChange && onChange(value);

        this.setState({
            showOptions: false
        });
    };

    render() {
        const {value, options, className, label, subItems, onlySubItems} = this.props;
        const {showOptions} = this.state;

        let selectedOption = null;

        options.length > 0 && options.map((opt, key) => {
            if (opt.value == value) {
                selectedOption = {...opt};
            }

            if (subItems) {
                opt.subItems.length > 0 && opt.subItems.map((sub, k) => {
                    if (sub.value == value) {
                        selectedOption = {...sub};
                    }
                });
            }
        });

        let classes = classNames('custom-dropdown', className);

        return (
            <div className={classes}>
                {label && <div className="custom-dropdown-label">{label}</div>}
                <div
                    className="custom-dropdown-value"
                    onClick={() => this._toggleShow()}>{selectedOption ? selectedOption.name : 'Selecteaza'}
                </div>
                {showOptions && <div className="custom-dropdown-options">
                    {options.map((opt, key) => {
                        if (subItems) {
                            return <Fragment key={key}>
                                <div className={`custom-dropdown-option ${onlySubItems ? 'disabled' : ''}`}
                                     {...(!onlySubItems ? {
                                         onClick: this._setValue(opt.value)
                                     } : {})}>{opt.name}</div>
                                {opt.subItems.length > 0 && opt.subItems.map((sub, k) => {
                                    return <div className="custom-dropdown-option sub-item" key={k}
                                                onClick={() => this._setValue(sub.value)}>{sub.name}</div>;
                                })}
                            </Fragment>;
                        } else {
                            return <div className="custom-dropdown-option" key={key}
                                        onClick={() => this._setValue(opt.value)}>{opt.name}</div>;
                        }
                    })}
                </div>}
            </div>
        );
    }
}