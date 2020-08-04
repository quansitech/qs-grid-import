<?php
namespace QsGridImport\Grid\CellType;

class MultiSelect extends Select {

    public function validate($val){
        if(is_null($val)){
            return true;
        }
        $res = array_filter($val,function($item){
            return isset($this->select_options[$item]);
        });
        return count($res) == count($val);
    }
}