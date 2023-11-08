import React from 'react';
import { Input, Select, InputNumber } from 'antd';
import DatePicker from './components/DatePicker';
import format from 'dayjs';

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
        this.getSourceVal = this.getSourceVal.bind(this);
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

    getSourceVal(val,colSetting){
        switch (colSetting.type.toUpperCase()){
            case 'INPUT':
            case 'INPUTNUMBER':
                return val;
            case 'SELECT':
                return colSetting.options?.[val];
            case 'DATE':
                return val;
            case 'DATETIME':
                return val;
            case 'MULTISELECT':
                let textArr = [];
                for (const [key, value] of Object.entries(colSetting.options)) {
                    if(val.includes(key)) textArr.push(value)
                }

                return textArr.join(",");
            default:
                throw 'error cell type';
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
                {this.colSetting.options != null && Object.keys(this.colSetting.options).map((col) => <Select.Option key={ col } value={ col }>{ this.colSetting.options[col] }</Select.Option>)}
                </Select>);
            case 'DATE':
                if(this.props.text){
                    return <DatePicker onChange={ this.dateChange(this.index, this.colSetting.key) } value={ format(this.props.text, 'YYYY/MM/DD') } />
                }
                else{
                    return <DatePicker onChange={ this.dateChange(this.index, this.colSetting.key) } />
                }
            case 'DATETIME':
                if(this.props.text){
                    console.log(this.props.text);
                    console.log(format(this.props.text, 'YYYY/MM/DD HH:mm:ss'));
                    return <DatePicker onChange={ this.dateChange(this.index, this.colSetting.key) } value={ format(this.props.text, 'YYYY/MM/DD HH:mm:ss') } showTime />
                }
                else{
                    return <DatePicker onChange={ this.dateChange(this.index, this.colSetting.key) } showTime />
                }
            case 'MULTISELECT':
                if(this.props.text){
                    this.restProps.defaultValue = this.props.text
                }
                return  (<Select mode="multiple" { ...this.restProps } showSearch onChange={ this.cellValueChange(this.index, this.colSetting.key) }
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }>
                    {this.colSetting.options != null && Object.keys(this.colSetting.options).map((col) => <Select.Option key={ col } value={ col }>{ this.colSetting.options[col] }</Select.Option>)}
                </Select>);
            default:
                throw 'error cell type';
        }
    }
}

export default CellNode;