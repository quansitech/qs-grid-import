<?php
namespace QsGridImport\Transcoder\QsExcel;

class Row{

    protected $sheet;
    public $cells;
    protected $children = [];

    public function __construct($row_data, Sheet $sheet)
    {
        $this->sheet = $sheet;
        self::genCells($row_data);
    }

    protected function genCells($row_data){
        $columns = $this->sheet->getAllColumns();
        foreach($row_data as $data){
            $column = array_shift($columns);
            if(!$column){
                break;
            }
            $cell = new Cell($column, $column->is_ref);
            $cell->setValue($data);;
            $this->cells[$column->key] = $cell;
        }
    }

    public function connect(Row $row, $ref_key){
        foreach($ref_key as $key){
            if($this->cells[$key]->getValue() == $row->cells[$key]->getValue()){
                continue;
            }
            else{
                return false;
            }
        }

        array_push($this->children, $row);
        return true;
    }

    public function convertFrom(){
        $data = array_map(function(Cell $cell){
            return $cell->getValue();
        }, array_filter($this->cells, function(Cell $cell){
            return !$cell->is_ref;
        }));

        if(count($this->children) > 0){
            $children = array_map(function(Row $row){
                return $row->convertFrom();
            }, $this->children);
        }

        $res = [
            'data' => $data
        ];

        if(!empty($children)){
            $res['children'] = $children;
        }

        return $res;
    }
}