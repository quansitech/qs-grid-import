<?php
namespace QsGridImport;

use QsGridImport\Grid\Row;

class Grid{

    protected $rows = [];

    public function addRow(Row $row){
        array_push($this->rows, $row);
    }

    public function validate(){
        $pass = true;
        foreach($this->rows as $row){
            $r = $row->validate();
            if($r === false){
                $pass = false;
            }
        }
        return $pass;
    }

    public function toArray(){
        $res = [];
        foreach($this->rows as $row){
            $res[] = $row->toArray();
        }
        return $res;
    }

    public function getRows(){
        return $this->rows;
    }

    public function removeRow($index){
        unset($this->rows[$index]);
    }

    public function isEmpty(){
        return count($this->rows) > 0 ? false : true;
    }
}