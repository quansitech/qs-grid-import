<?php
namespace QsGridImport\Transcoder\Qsexcel\ColumnType;

class InputNumber extends ColumnType{

    public function validate($val){
        return is_int($val);
    }

    public function convertTo(){
        return [];
    }

    public function paraseValue($value)
    {
        return $value;
    }
}