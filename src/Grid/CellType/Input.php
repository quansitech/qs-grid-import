<?php
namespace QsGridImport\Grid\CellType;

class Input extends CellType{

    public function validate($value){
        return true;
    }
}