<?php
namespace QsGridImport\Transcoder\Qsexcel\ColumnType;

class Input extends ColumnType{

    public function validate($val){
        return true;
    }

    public function convertTo(){
        return [];
    }

    public function paraseValue($value)
    {
        return $value;
    }
}