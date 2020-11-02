import React from 'react';
import {Table, Tooltip} from 'antd';
import { WarningTwoTone } from '@ant-design/icons';
import CellNode from './cellNode';

class BaseTable extends React.Component {

    constructor(props) {
        super(props);

        this._row_error_key = '_row';

        this.final = this.props.columns.children ? false : true;

        this.tabindex = 0;
        this.currentIndex = 1;

        this.renderCell = this.renderCell.bind(this);
        this.expandedRowRender = this.expandedRowRender.bind(this);
        this.updateState = this.updateState.bind(this);
        this.commonChange = this.commonChange.bind(this);
        this.updateBaseProp = this.updateBaseProp.bind(this);
        this.focusErr = this.focusErr.bind(this);
    }

    focusErr = () => {
        if(this.tabindex == 0){
            return;
        }

        if(this.currentIndex > this.tabindex){
            this.currentIndex = 1;
        }
        location = `#anchor_${this.currentIndex++}`
    }

    updateBaseProp() {
        this.columns = this.props.columns.data.map(col => {
            return {
                title: col.title,
                dataIndex: col.key,
                key: col.key,
                render: this.renderCell(col)
            }
        });
        this.dataSource = this.props.row_data.map((col, idx) => {
            const dataSource = col.data;
            dataSource.key = idx;
            return dataSource;
        });
    }

    renderCell(colSetting) {
        return (text, record, index) => {
            let row_error_tips;
            let cell_error_tips;
            if (colSetting.key == this.props.columns.data[0].key
                && typeof this.props.row_data[index].error != "undefined"
                && typeof this.props.row_data[index].error[this._row_error_key] != "undefined") {
                row_error_tips = true;
            }

            if (typeof this.props.row_data[index].error != "undefined" && typeof this.props.row_data[index].error[colSetting.key] != "undefined") {
                cell_error_tips = true;
            }

                return (
                    <div>
                        { row_error_tips &&
                        //<WarningIcon ref={rowErrRef} tips={this.props.row_data[index].error[this._row_error_key]}></WarningIcon>
                        <Tooltip title={this.props.row_data[index].error[this._row_error_key]}>
                            <a name={ `anchor_${++this.tabindex}` }>
                                <WarningTwoTone  style={{marginRight: 5}} twoToneColor="#df0000"/>
                            </a>
                        </Tooltip>
                        }
                        <CellNode text={text} index={index} colsetting={colSetting} topchange={this.commonChange}
                                  style={{width: '78%'}}/>
                        { cell_error_tips &&
                        //<WarningIcon ref={cellErrRef} tips={this.props.row_data[index].error[colSetting.key]}></WarningIcon>
                            <Tooltip title={this.props.row_data[index].error[colSetting.key]}>
                                <a name={ `anchor_${++this.tabindex}` }>
                                    <WarningTwoTone  style={{marginLeft: 5}} twoToneColor="#df0000"/>
                                </a>
                            </Tooltip>
                        }
                    </div>
                );

        };
    }


    commonChange(val, index, columnName) {
        this.props.row_data[index].data[columnName] = val;
        this.updateState(this.props.row_data, 0, true);
        this.updateBaseProp();
    }

    updateState(data, parentIdx, current = false) {
        if (!current) {
            this.props.row_data[parentIdx].children = data;
        }
        this.props.updatestate(this.props.row_data, this.props.parentIdx);
    }

    expandedRowRender(record, index) {
        if (typeof this.props.row_data[index].children == 'undefined') {
            return false;
        } else {
            return <BaseTable columns={this.props.columns.children} row_data={this.props.row_data[index].children}
                              parentIdx={index} updatestate={this.updateState}/>
        }

    }


    render() {
        this.updateBaseProp();
        return <Table columns={this.columns} dataSource={this.dataSource} expandedRowRender={this.expandedRowRender}
                   pagination={false} defaultExpandAllRows={true}/>

    }
}

export default BaseTable;