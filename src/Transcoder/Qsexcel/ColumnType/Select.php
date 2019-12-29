<?php
namespace QsGridImport\Transcoder\Qsexcel\ColumnType;

use QsExcel\Builder\ListBuilder;

class Select extends ColumnType{

    protected $select_options;

    public function __construct($col_option)
    {
        $this->select_options = self::paraseOption($col_option['options']);
    }

    public function validate($val){
        return in_array($val, $this->select_options);
    }

    public function paraseOption($select_options){
        $options = [];
        if(is_array($select_options)){
            $options = $select_options;
        }

        if($select_options instanceof \Closure){
            $options = call_user_func($select_options);
        }

        return $options;
    }

    public function convertTo(){
        return [
            'type' => ListBuilder::LIST_TYPE,
            'data_source' => implode(',', $this->select_options)
        ];
    }

    public function paraseValue($value)
    {
        return (string)(array_flip($this->select_options)[$value]);
    }
}