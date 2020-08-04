<?php
namespace QsGridImport\Transcoder\QsExcel\ColumnType;

use QsExcel\Builder\ListBuilder;

class MultiSelect extends Select{

    public function validate($val){
        return true;
    }

    public function convertTo(){
        return [];
    }

    public function paraseValue($value)
    {
        $arr = $value == '' ? null : explode(',', $value);
        $res = array_map(function($item){
            if(isset(array_flip($this->select_options)[$item])){
                return (string)(array_flip($this->select_options)[$item]);
            }
        }, $arr);
        return array_filter($res);
    }
}