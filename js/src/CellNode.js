import React from 'react';
import { Input, Select, InputNumber, DatePicker } from 'antd';
import moment from 'moment';

class CellNode extends React.Component{

    constructor(props){
        super(props);

        const {
            text,
            colsetting,
            index,
            topchange,
            ...restProps
        } = this.props;

        this.text = this.props.text;
        this.colSetting = this.props.colsetting;
        this.index = this.props.index;

        this.topchange = this.props.topchange;

        this.restProps = restProps;

        this.cellChange = this.cellChange.bind(this);
        this.cellValueChange = this.cellValueChange.bind(this);
        this.dateChange = this.dateChange.bind(this);
    }

    cellChange(index, columnName){
    
        return (e) => {
          const val = e.target.value;
          this.topchange(val, index, columnName);
        }
    }

    cellValueChange(index, columnName){

        return (val) => {
            this.topchange(val, index, columnName);
        }
    }

    dateChange(index, columnName){

        return (date, dateString) => {
            this.topchange(dateString, index, columnName);
        }
        
    }

    render(){
        

        switch(this.colSetting.type.toUpperCase()){
            case 'INPUT':
                return <Input { ...this.restProps } value={ this.props.text } onChange={ this.cellChange(this.index, this.colSetting.key) } />;
            case 'INPUTNUMBER':
                return <InputNumber { ...this.restProps } value={ this.props.text } onChange={ this.cellValueChange(this.index, this.colSetting.key) } />;
            case 'SELECT':
                return (<Select { ...this.restProps } showSearch value={ this.props.text } onSelect={ this.cellValueChange(this.index, this.colSetting.key) }
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }>
                {Object.keys(this.colSetting.options).map((col) => <Select.Option key={ col } value={ col }>{ this.colSetting.options[col] }</Select.Option>)}
                </Select>);
            case 'DATE':
                return <DatePicker onChange={ this.dateChange(this.index, this.colSetting.key) } value={ moment(this.props.text, 'YYYY/MM/DD') } />
            default:
                throw 'error cell type';
        }
    }
}

export default CellNode;