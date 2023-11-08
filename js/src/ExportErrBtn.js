import React, {useState} from "react";
import { Button } from 'antd'
import ExportHelper from "./util/export-excel/export-helper";

const ExportErrBtn = (props)=>{
    const {
        data,
        hasDataError,
        exportErrObj,
        ...restProps
    } = props;

    const [submitting, setSubmitting] = useState(false)

    const downloadErrInfo = ()=>{
        setSubmitting(true);
        ExportHelper.exportError(data, exportErrObj);
        setSubmitting(false);
    }

    return <>
        { exportErrObj?.output && hasDataError ?
            <Button { ...restProps } type="danger" onClick={ downloadErrInfo } loading={submitting}>导出错误</Button>
            : <></>
        }
    </>
}

export default ExportErrBtn;