<?php
namespace QsGridImport;

use QsGridImport\Grid\Row;

class Grid{

    protected $rows = [];
    protected $unique = [];
    protected $options;

    public function __construct($options)
    {
        $this->options = $options;
    }

    public function addRow(Row $row){
        array_push($this->rows, $row);
    }

    protected function checkUnique(Row $row, &$tmpArr){
        if(!isset($this->options['unique']) || empty($this->options['unique'])){
            return true;
        }
        $rowData = $row->getRowData();
        $arr = array_map(function($key) use ($rowData){
            return $rowData[$key];
        }, $this->options['unique']);

        $str = serialize($arr);
        if(in_array($str, $tmpArr)){
            return false;
        }
        else{
            array_push($tmpArr, $str);
            return true;
        }

    }

    public function validate(){
        $pass = true;
        $tmpArr = [];
        foreach($this->rows as $row){
            $r = $this->checkUnique($row, $tmpArr);
            if($r === false){
                $row->setError($this->uniqueErrMsg());
                $pass = false;
            }

            $r = $row->validate();
            if($r === false){
                $pass = false;
            }
        }
        return $pass;
    }

    protected function uniqueErrMsg(){
        $arr = [];
        foreach($this->options['data'] as $data){
            if(in_array($data['key'], $this->options['unique'])){
                array_push($arr, $data['title']);
            }
        }

        return join(',', $arr) . ' 必须唯一';
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