import React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import '../assets/app.scss';

class CheckboxComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            checked: false
        }
    }

    async componentDidMount(){
        await this.setState({
            checked: this.props.checked
        })
    }

    onClick(value){
        this.props.onClick?.(value);
    }

    render(){
        return (
            <form>
                <div style={{ display: 'flex', alignItems: 'center',margin: 10 }}>
                    <Checkbox.Root onCheckedChange={(value)=>(this.onClick(value))} defaultChecked={this.state.checked} className="CheckboxRoot" id={this.props.id}>
                        <Checkbox.Indicator className="CheckboxIndicator">
                            <CheckIcon />
                        </Checkbox.Indicator>
                    </Checkbox.Root>
                    <label className="labelCheckbox" htmlFor={this.props.id}>
                        {this.props.label}
                        {`${this.state.checked}`}
                    </label>
                </div>
            </form>
        )
    }
}

export default CheckboxComponent;