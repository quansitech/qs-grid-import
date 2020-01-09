import React from 'react';
import { Button } from 'antd';
import 'antd/dist/antd.css';

class SubmitButton extends React.Component{
    constructor(props){
        super(props);

        const {
            data,
            submiturl,
            update,
            success,
            showerr,
            ...restProps
        } = this.props;

        this.restProps = restProps;

        this.state = { submitting: false };
        this.submit = this.submit.bind(this);
    }

    submit(){
        this.setState({ submitting: true});
        const that = this;

        fetch(this.props.submiturl, {
            body: JSON.stringify(this.props.data.row_data),
            method: 'PUT'
        }).then(function(res){
            that.setState({ submitting: false});
            if(res.ok){
                return res.json();
            }
            else{
                res.text();
                throw 'something go error, status:' + res.status;
            }
        }).then(function(data){
            if(data.error == 1){
                that.props.showerr(data.error_msg);
                that.props.update(data.row_data);
            }
            else{
                that.props.success();
            }

        });
    }

    render(){
        return (
            <Button { ...this.restProps } type="primary" onClick={ this.submit } loading={ this.state.submitting }>提交</Button>
        );
    }
}

export default SubmitButton;