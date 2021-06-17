<?php
namespace QsGridImport\Grid\CellType;

class DateTime extends CellType{

    public function validate($value){
        //处理空提交
        if($value == ''){
            $value = '1970-01-01 00:00:00';
        }
        return $value != date('Y-m-d H:i:s', strtotime($value)) ? false : true;
    }
}