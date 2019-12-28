<?php
namespace QsGridImport\Grid\CellType;

class Date extends CellType{

    public function validate($value){
        return $value != date('Y-m-d', strtotime($value)) ? false : true;
    }
}