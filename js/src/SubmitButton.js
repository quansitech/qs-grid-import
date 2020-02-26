import React from 'react';
import { Button, Progress } from 'antd';
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
            async,
            asyncProcessNotify,
            ...restProps
        } = this.props;

        this.restProps = restProps;

        this.state = { submitting: false, process: 0 };
        this.submit = this.submit.bind(this);
    }

    syncSubmit(){
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
                throw 'syncSubmit something go error, status:' + res.status;
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

    asyncSubmit(){
        this.setState({ submitting: true, process: 0 });

        const that = this;

        fetch(this.props.submiturl, {
            body: JSON.stringify(this.props.data.row_data),
            method: 'PUT'
        }).then(function(res){
            if(res.ok){
                return res.json();
            }
            else{
                res.text();
                that.setState({ submitting: false});
                throw 'asyncSubmit something go error, status:' + res.status;
            }
        }).then(function(data){
            if(data.error == 1){
                that.setState({ submitting: false});
                that.props.showerr(data.error_msg);
                that.props.update(data.row_data);
            }
            else{
                if(data.trans_id){
                    that.updateAsyncProcess(data.trans_id);
                }
                else{
                    that.setState({ submitting: false});
                    throw 'not found trans_id!';
                }
            }

        });
    }

    updateAsyncProcess(trans_id){

        const that = this;

        fetch(this.props.asyncProcessNotify + '?trans_id=' + trans_id)
            .then(function(res){
                if(res.ok){
                    return res.json();
                }
                else{
                    res.text();
                    that.setState({ submitting: false});
                    throw 'updateAsyncProcess something go error, status:' + res.status;
                }
            }).then(function(data){
                if(data.error == 1){
                    that.setState({ submitting: false});
                    that.props.showerr(data.error_msg);
                    that.props.update(data.row_data);
                }
                else{
                    if(data.process >= 0){
                        that.setState({ process: data.process});

                        if(data.process < 100){
                            setTimeout(function(){
                                that.updateAsyncProcess(trans_id);
                            }, 2000);

                        }
                        else{
                            that.setState({ submitting: false});
                            that.props.success();
                        }

                    }
                    else{
                        throw 'not found process!';
                    }
                }

            });
    }

    submit(){
        if(this.props.async){
            this.asyncSubmit();
        }
        else{
            this.syncSubmit();
        }
    }

    render(){
        let process;
        if(this.props.async && this.state.submitting){
            process = <Progress
                strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                }}
                percent={ this.state.process }
            />;
        }

        return (
            <div style={{ width: "400px"}}>
                <Button { ...this.restProps } type="primary" onClick={ this.submit } loading={ this.state.submitting }>提交</Button>
                {process}
            </div>
        );
    }
}

export default SubmitButton;