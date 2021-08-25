<?php
namespace QsGridImport\Transcoder\QsExcel\ColumnType;

class InputNumber extends ColumnType{

    public function validate($val){
        return is_numeric($val);
    }

    public function convertTo(){
        return [];
    }

    public function paraseValue($value)
    {
        return $value;
    }
}