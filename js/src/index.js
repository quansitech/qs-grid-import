import React from 'react';
import ReactDOM from 'react-dom';
import { Spin, Result, Button, message, Space } from 'antd';
import BaseTable from './BaseTable';
import SubmitButton from './SubmitButton';
import "./grid-import.css";
import ExportErrBtn from "./ExportErrBtn";

class ImportGrid extends React.Component{

    constructor(props){
        super(props);


        this.state = { data: null, submitting: false, importSuccess: false, hasDataError: false };
        this.updateState = this.updateState.bind(this);
        this.importSuccess = this.importSuccess.bind(this);
        this.redirect = this.redirect.bind(this);
        this.focusErr = this.focusErr.bind(this);
        this.getCellSourceVal = this.getCellSourceVal.bind(this);
        this.getRowErr = this.getRowErr.bind(this);
        this.getCellErr = this.getCellErr.bind(this);
        this.existsDataErr = this.existsDataErr.bind(this);
        this.error = this.error.bind(this);

        this.tableRef = React.createRef();
    }

    componentDidMount() {
        // const that = this;
        // fetch(this.props.getDataUrl).then(function(res){
        //     if(res.ok){
        //     return res.json();
        //     }
        //     else{
        //     throw 'something go error, status:' . res.status;
        //     }
        // }).then(function(data){
        //     that.setState({ data });
        // });

        this.setState({ data: this.props.data, hasDataError: this.existsDataErr() })
    }

    focusErr() {
        this.tableRef.current.focusErr();
    }

    existsDataErr() {
        return this.props.data.row_data.some(item => item?.error && JSON.stringify(item.error) !== "{}");
    }

    getCellSourceVal(val, colSetting) {
        return this.tableRef.current.getCellSourceVal(val, colSetting);
    }

    getRowErr(rowData){
        return this.tableRef.current.getRowErr(rowData);
    }

    getCellErr(key, rowData){
        return this.tableRef.current.getCellErr(key, rowData);
    }

    updateState(data){
        const state_data = this.state.data;
        state_data.row_data = data;
        this.setState({ data: state_data, hasDataError: this.existsDataErr() });
    }

    importSuccess(){
        this.setState({ importSuccess: true, hasDataError: false });
    }

    error(msg = ''){
        this.setState({ hasDataError: true });
        let err_msg;
        if(msg == ''){
            err_msg = '导入失败，点击错误提示查看原因！'
        }
        else{
            err_msg = msg;
        }
        message.error(err_msg);
    }

    redirect(){
        location.href = this.props.redirect;
    }

    render(){
        if(this.state.importSuccess){
            return <Result
                status="success"
                title="导入成功"
                subTitle=""
                extra={[
                <Button type="primary" key="confirm" onClick={ this.redirect }>
                    确定
                </Button>
            ]}></Result>
        }

        if(this.state.data) {
            return (<div>
                    <Space>
                        <SubmitButton async={ this.props.async } asyncProcessNotify={ this.props.asyncProcessNotify } data={ this.state.data } submiturl={ this.props.submitUrl } success={ this.importSuccess } update={ this.updateState } showerr={ this.error } style={{ marginBottom: "5px" }} />
                        <ExportErrBtn
                            style={{ marginBottom: "5px", marginLeft: "-335px"}}
                            data={ this.state.data }
                            hasDataError={ this.state.hasDataError }
                            exportErrObj = {{ ...this.props.exportErrObj,
                                getCellSourceVal:this.getCellSourceVal,
                                getRowErr:this.getRowErr,
                                getCellErr:this.getCellErr }}

                        />
                    </Space>

                    <p>提示：ctrl+q可快速定位错误</p>
                    <BaseTable ref={this.tableRef} columns={ this.state.data.columns } row_data={ this.state.data.row_data} updatestate={ this.updateState }/>
                </div>)
        }
        else {
            return (<div style={{ width: "100vw", height:"100vh", display: "flex",  justifyContent: "center", alignItems: "center"}}>
                    <Spin size="large" />
                </div>);
        }
    }
}

function importGrid(id, opt){
    const defaultOpt = { submitUrl: '', async: false, asyncProcessNotify: '', successRedirectUrl: '', data: null, exportErrObj : {output:false}};
    Object.assign(defaultOpt, opt);

    const gridRef = React.createRef();

    document.addEventListener('keydown', (e) => {
        if(e.ctrlKey && e.key=='q'){
            gridRef.current.focusErr();
        }
    });

    ReactDOM.render(<ImportGrid ref={gridRef} submitUrl={ defaultOpt.submitUrl } redirect={ defaultOpt.successRedirectUrl }
                                data={ defaultOpt.data} async={ defaultOpt.async } asyncProcessNotify={ defaultOpt.asyncProcessNotify }
                                exportErrObj={ defaultOpt.exportErrObj }
    />, document.getElementById(id));
}
  
window.importGrid = importGrid;