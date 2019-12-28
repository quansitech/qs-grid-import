import React from 'react';
import ReactDOM from 'react-dom';
import { Spin } from 'antd';
import BaseTable from './BaseTable';
import SubmitButton from './SubmitButton';

class ImportGrid extends React.Component{

    constructor(props){
        super(props);

        this.state = { data: null, submitting: false };
        this.updateState = this.updateState.bind(this);
    }

    componentDidMount() {
        const that = this;
        fetch(this.props.getDataUrl).then(function(res){
            if(res.ok){
            return res.json();
            }
            else{
            throw 'something go error, status:' . res.status;
            }
        }).then(function(data){
            that.setState({ data });
        });
    }

    updateState(data){
        const state_data = this.state.data;
        state_data.row_data = data;
        this.setState({ data: state_data });
    }

    render(){
        if(this.state.data) {
            return (<div>
                    <BaseTable columns={ this.state.data.columns } row_data={ this.state.data.row_data} updatestate={ this.updateState }/>
                    <SubmitButton data={ this.state.data } submiturl={ this.props.submitUrl } update={ this.updateState } style={{ marginTop: "5px" }} />
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
    const defaultOpt = { getDataUrl: '', submitUrl: ''};
    Object.assign(defaultOpt, opt);
    ReactDOM.render(<ImportGrid getDataUrl={ defaultOpt.getDataUrl } submitUrl={ defaultOpt.submitUrl } />, document.getElementById(id));
}
  
window.importGrid = importGrid;