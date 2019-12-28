<?php
namespace QsGridImport\Grid\CellType;

class Select extends CellType{

    protected $select_options;

    public function __construct($cell_option)
    {
        $this->select_options = self::paraseOption($cell_option['options']);
    }

    public function validate($val){
        return isset($this->select_options[$val]);
    }

    public function paraseOption($select_options){
        $options = [];
        if(is_array($select_options)){
            $options = $select_options;
        }

        if($select_options instanceof \Closure){
            $options = call_user_func($select_options);
        }

        return $options;
    }
}