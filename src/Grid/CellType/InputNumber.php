<?php
namespace QsGridImport\Grid\CellType;

class InputNumber extends CellType{

    public function validate($value){
        return is_numeric($value);
    }
}