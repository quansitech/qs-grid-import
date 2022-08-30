<?php
namespace QsGridImport\Grid;


use QsGridImport\Grid\CellType\CellType;

class Cell{

    protected $title;
    public $key;
    protected $cell_type;
    protected $required = false;
    protected $validate_callback;
    protected $value;
    protected $error = '';
    protected $validate_err_msg = '格式不正确';
    protected $row = null;
    protected $required_err_msg = '必填';

    public function __construct($option, $value, $row)
    {
        $this->title = $option['title'];
        $this->key = $option['key'];
        isset($option['required']) && $this->required = $option['required'];
        $this->validate_callback = $option['validate_callback'];
        $this->cell_type = CellType::instance($option['type'], $option);
        isset($option['validate_err_msg']) && $this->validate_err_msg = $option['validate_err_msg'];
        isset($option['required_err_msg']) && $this->required_err_msg = $option['required_err_msg'];

        $this->setValue($value);
        $this->row = $row;
    }

    public function setValue($value){
        $this->value = $value;
    }

    public function getValue(){
        return $this->value;
    }

    public function validate(){
        //非必填，且为空，就不需要验证了
        if($this->required === false && $this->isEmpty()){
            return true;
        }

        $flag = self::checkRequired();
        $flag !== false && $flag = self::checkTypeValidate();
        $flag !== false && $flag = self::checkValidateCallback();

        return $flag;
    }

    protected function checkRequired(){
        $required = false;

        if($this->required instanceof \Closure){
            $row_datas = array_map(function(Cell $cell){
                return $cell->getValue();
            }, $this->row->getCells());

            $required = call_user_func($this->required, $this->value, $row_datas);
        }
        else{
            $required = $this->required;
        }

        if($required === true && $this->isEmpty()){
            $this->setError($this->required_err_msg);
            return false;
        }
        return true;
    }

    protected function isEmpty(){
        if(is_string($this->value) && trim($this->value) === ''){
            return true;
        }

        if(is_array($this->value) && count($this->value) === 0){
            return true;
        }

        if(is_null($this->value)){
            return true;
        }

        return false;
    }

    protected function checkTypeValidate(){
        $r = $this->cell_type->validate($this->value);
        if($r === false){
            $this->setError($this->validate_err_msg);
        }
        return $r;
    }

    protected function checkValidateCallback(){
        if($this->validate_callback instanceof \Closure  && trim($this->value) != ''){

            $row_datas = array_map(function(Cell $cell){
                return $cell->getValue();
            }, $this->row->getCells());

            $error = call_user_func($this->validate_callback, $this->value, $row_datas);
            $error !== true && $this->setError($error);
            if($error === true){
                return true;
            }
            else{
                return false;
            }
        }
        return true;
    }

    protected function setError($error){
        $this->error = $error;
    }

    public function getError(){
        return $this->error;
    }

}