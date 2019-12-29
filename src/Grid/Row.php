<?php
namespace QsGridImport\Grid;

use QsGridImport\Grid;
use QsGridImport\Helper;

class Row{

    protected $cells = [];

    protected $children;

    public function __construct($option, $data)
    {
        foreach($data as $key => $val){
            $data_option = Helper::getDataOptionByKey($option, $key);
            if(!$data_option){
                continue;
            }
            $cell = new Cell($data_option, $val, $this);
            $this->addCell($cell);
        }
    }

    public function addCell(Cell $cell){
        $this->cells[$cell->key] = $cell;
    }

    public function addGrid(Grid $grid){
        $this->children = $grid;
    }

    public function getCells(){
        return $this->cells;
    }

    public function validate(){
        $pass = true;
        foreach($this->cells as $cell){
            $r = $cell->validate();
            if($r === false){
                $pass = false;
            }
        }

        if($this->children && $this->children->validate() === false){
            $pass = false;
        };

        return $pass;
    }

    public function toArray(){
        $res = [];
        $error = [];
        foreach($this->cells as $key => $cell){
            $res['data'][$key] = $cell->getValue();
            if($cell->getError() != ''){
                $error[$key] = $cell->getError();
            }
        }

        count($error) > 0 && $res['error'] = $error;
        if($this->children){
            $res['children'] = $this->children->toArray();
        }

        return $res;
    }

}