<?php
namespace QsGridImport\Grid\CellType;

abstract class CellType{

    const INPUT = 'input';
    const DATE = 'date';
    const DATETIME = 'dateTime';
    const INPUT_NUMBER = 'inputNumber';
    const SELECT = 'select';
    const MULTI_SELECT = 'multiSelect';

    public static function instance($type_name, $cell_option){
        $type_name = ucfirst($type_name);
        $class_name = "\\QsGridImport\\Grid\\CellType\\{$type_name}";
        if(!class_exists($class_name)) {
            throw new \Exception('column type not found');
        }

        return new $class_name($cell_option);
    }

    abstract public function validate($value);
}