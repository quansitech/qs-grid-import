import { saveAs } from 'file-saver';
import * as ExcelJs from "exceljs";

const ExportHelper = {
    genHeaders : (columns) =>{
        return columns.map((col) => {
            return {
                // 显示的 name
                header: col.title,
                // 用于数据匹配的 key
                key: col.key,
                // 列宽
                width: col.width / 5 || 10,
            };
        })
    },
    genRowData : (row_data, exportErrObj, colSetting) =>{
        return row_data.map((row, idx) => {
            let dataSource = {...row.data}
            colSetting.forEach(col =>{
                const colKey = col.key;
                dataSource[colKey] = exportErrObj.getCellSourceVal(dataSource[colKey], col);
            })
            dataSource.key = idx;
            return dataSource;
        })
    },
    saveWorkbook : (wb, fileName) =>{
        wb.xlsx.writeBuffer().then((data) => {
            const blob = new Blob([data], { type: '' });
            saveAs(blob, fileName);
        });
    },
    transcodeToExcel: (ws, columns, rowDataSource, exportErrObj) =>{
        columns.forEach(col => {
            const wsCol = ws.getColumn(col.key);
            wsCol.eachCell(function(cell, rowNumber) {
                if (rowNumber>1){
                    const rowDataIndex = rowNumber-2;

                    if (col.type === 'select' && col?.options !== null){
                        cell.dataValidation = {
                            type: 'list',
                            allowBlank: !col.required,
                            formulae: ['"'+Object.values(col.options).join(',')+'"']
                        };
                    }

                    const cellErr = exportErrObj.getCellErr(col.key, rowDataSource[rowDataIndex])
                    if (cellErr){
                        cell.fill = {
                            type: 'pattern',
                            pattern:'solid',
                            fgColor:{argb:'FFFF0000'}
                        };
                        cell.note = cellErr;
                    }
                }
            });
        });

        rowDataSource.forEach((rowData,index) => {
            const rowNumber = index+2;
            const rowErr = exportErrObj.getRowErr(rowDataSource[index]);

            if (rowErr){
                const wsRow = ws.getRow(rowNumber);
                const wsCell = wsRow.getCell(wsRow.cellCount+1);

                wsCell.font = {
                    color: { argb: 'FFFF0000' },
                };
                wsCell.value = rowErr;
            }
        });
    },
    exportError : (data, exportErrObj)=>{
        const {columns, row_data} = data;
        // 创建工作簿
        const workbook = new ExcelJs.Workbook();
        // 添加sheet
        const worksheet = workbook.addWorksheet('sheet1');
        // 设置列
        worksheet.columns = ExportHelper.genHeaders(columns.data)
        // 添加行
        worksheet.addRows(ExportHelper.genRowData(row_data, exportErrObj,columns.data));
        // 处理数据源
        ExportHelper.transcodeToExcel(worksheet, columns.data, row_data, exportErrObj);
        // 导出excel
        ExportHelper.saveWorkbook(workbook, exportErrObj?.filename||'错误信息.xlsx');
    }
}
export default ExportHelper;