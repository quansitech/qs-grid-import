<?php
namespace QsGridImport\Transcoder\Qsexcel\ColumnType;

abstract class ColumnType{

    public static function instance($type_name, $col_option){
        $type_name = ucfirst($type_name);
        $class_name = "\\QsGridImport\\Transcoder\\Qsexcel\\ColumnType\\{$type_name}";
        if(!class_exists($class_name)) {
            throw new \Exception('column type not found');
        }

        return new $class_name($col_option);
    }

    abstract public function validate($val);

    abstract public function convertTo();

    abstract public function paraseValue($value);
}