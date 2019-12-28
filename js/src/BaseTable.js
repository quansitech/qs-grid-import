import React from 'react';
import { Table, Icon, Tooltip } from 'antd';
import CellNode from './cellNode';
import 'antd/dist/antd.css';

class BaseTable extends React.Component{

    constructor(props){
        super(props);

        this.columns = this.props.columns.data.map(col => {
            return {
                title: col.title,
                dataIndex: col.key,
                key: col.key,
                render: this.renderCell(col)
            }
        });

        this.row_data = this.props.row_data;
        this.dataSource = this.props.row_data.map((col, idx) => {
            const dataSource = col.data;
            dataSource.key = idx;
            return dataSource;
        });

        console.log("baseTable construct: ", this.row_data);

        this.final = this.props.columns.children ? false : true;

        this.renderCell = this.renderCell.bind(this);
        this.expandedRowRender = this.expandedRowRender.bind(this);
        this.updateState = this.updateState.bind(this);
        this.commonChange = this.commonChange.bind(this);
    }

    renderCell(colSetting){

        return (text, record, index) => {
            if(typeof this.props.row_data[index].error != "undefined" && typeof this.props.row_data[index].error[colSetting.key] != "undefined" ){
                return (
                    <div>
                        <CellNode text={text} index={index} colsetting={colSetting} topchange={ this.commonChange } style={{ width: '90%'}} /> 
                        <Tooltip title={ this.props.row_data[index].error[colSetting.key] }>
                            <Icon style={{ marginLeft: 5 }} type="warning" theme="twoTone" twoToneColor="#df0000"/>
                        </Tooltip>
                    </div>
                );
                        
            }
            return <CellNode text={text} index={index} colsetting={colSetting} topchange={ this.commonChange } style={{ width: '100%'}} />;
        };
    }


    commonChange(val, index, columnName){
        this.row_data[index].data[columnName] = val;
        this.updateState(this.row_data, 0, true);
    }

    updateState(data, parentIdx, current = false){
        if(!current){
            this.row_data[parentIdx].children = data;
        }
        this.props.updatestate(this.row_data, this.props.parentIdx);
    }

    expandedRowRender(record,index){
        if( typeof this.props.row_data[index].children == 'undefined'){
            return false;
        }
        else{
            return <BaseTable columns={ this.props.columns.children } row_data={ this.props.row_data[index].children} parentIdx= { index } updatestate={ this.updateState }/>
        }
        
    }


    render(){
        return <Table columns={this.columns} dataSource={this.dataSource} expandedRowRender={ this.expandedRowRender } pagination={ false } defaultExpandAllRows={ true } />
    }
}

export default BaseTable;