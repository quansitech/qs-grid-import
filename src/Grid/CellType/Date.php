<?php
namespace QsGridImport\Grid\CellType;

class Date extends CellType{

    public function validate($value){
        //处理空提交
        if($value == ''){
            $value = '1970-01-01';
        }
        return $value != date('Y-m-d', strtotime($value)) ? false : true;
    }
}