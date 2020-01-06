<?php
namespace QsGridImport\Transcoder\QsExcel;

class Cell{

    protected $value;
    protected $column;
    public $is_ref;

    public function __construct(Column $column, $is_ref = false)
    {
        $this->column = $column;
        $this->is_ref = $is_ref;
    }

    public function setValue($val){
        $this->value = $this->column->column_type->validate($val) ? $this->column->column_type->paraseValue($val) : '';
    }

    public function getValue(){
        return $this->value;
    }
}