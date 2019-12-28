<?php
namespace QsGridImport\Transcoder\Qsexcel;

use QsGridImport\Transcoder\Qsexcel\ColumnType\ColumnType;

class Column{

    protected $title;
    public $key;
    public $column_type;
    protected $required;
    protected $validate;
    public $is_ref = false;

    public function __construct($col_option)
    {
        $this->title = $col_option['title'];
        $this->key = $col_option['key'];
        $this->column_type = ColumnType::instance($col_option['type'], $col_option);
        $this->required = $col_option['required'];
        $this->validate = $col_option['validate'];
    }

    public function convertTo(){
        $column_type_option = $this->column_type->convertTo();

        return array_merge([
            'title' => $this->title
        ], $column_type_option);
    }
}