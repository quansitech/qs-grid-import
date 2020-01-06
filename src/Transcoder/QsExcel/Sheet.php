<?php
namespace QsGridImport\Transcoder\QsExcel;

class Sheet{

    protected $p_sheet;

    protected $ref_key;

    public $columns;

    public $rows = [];

    public function __construct($options, Sheet $p_sheet = null)
    {
        $this->p_sheet = $p_sheet;

        if(isset($options['ref_key'])){
            $this->ref_key = $options['ref_key'];
        }

        foreach($options['data'] as $col){
            $this->columns[$col['key']] = new Column($col);
        }
    }

    public function convertOptionTo(){
        $ref_columns = [];
        if($this->ref_key){
            $ref_columns = $this->p_sheet->getColumnByRefkey($this->ref_key);
        }

        $columns = array_merge($ref_columns, $this->columns);

        $res = [];
        foreach($columns as $col){
            array_push($res, $col->convertTo());
        }

        return $res;
    }

    public function getColumnByRefkey(array $ref_key){
        $res = [];
        foreach($ref_key as $key){
            $column = clone $this->columns[$key];
            $column->is_ref = true;
            $res[$key] = $column;
        }
        return $res;
    }

    public function setData($data_list){
        foreach($data_list as $row){
            array_push($this->rows, new Row($row, $this));
        }
    }

    public function getAllColumns(){
        $ref_columns = [];
        if($this->p_sheet){
            $ref_columns = $this->p_sheet->getColumnByRefkey($this->ref_key);
        }

        return array_merge($ref_columns, $this->columns);
    }

    public function connectRow(){
        if(empty($this->p_sheet) || empty($this->ref_key)){
            return;
        }

        foreach($this->p_sheet->rows as $p_row){
            foreach($this->rows as $row){
                $p_row->connect($row, $this->ref_key);
            }
        }
    }

    public function convertDataFrom(){

    }

}