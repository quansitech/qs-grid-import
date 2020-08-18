<?php
namespace QsGridImport\Transcoder\QsExcel\ColumnType;

use QsExcel\Builder\ListBuilder;

class MultiSelect extends Select{

    public function validate($val){
        return true;
    }

    public function convertTo(){
        return [
            'type' => ListBuilder::MULTI_LIST_TYPE,
            'data_source' => implode(',', $this->select_options)
        ];
    }

    public function paraseValue($value)
    {
        $arr = $value == '' ? null : explode(',', $value);
        $res = array_map(function($item){
            if(isset(array_flip($this->select_options)[$item])){
                return (string)(array_flip($this->select_options)[$item]);
            }
        }, $arr);
        return array_values(array_filter($res));
    }
}