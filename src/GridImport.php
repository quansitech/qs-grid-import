<?php
namespace QsGridImport;

use QsGridImport\Grid\Row;

class GridImport{

    protected $option;
    protected $first_grid;

    public function __construct($option)
    {
        $this->option = $option;
    }


    public function fill()
    {
        $json = file_get_contents('php://input');
        $row_data = json_decode(htmlspecialchars_decode($json), true);

        $this->first_grid = self::init($row_data);
        return $this;
    }

    protected function init($row_data, $level = 1) : Grid
    {
        $grid = new Grid();
        $column_options = Helper::getColumnOptionByLevel($this->option, $level);
        foreach($row_data as $data){
            $row = new Row($column_options, $data['data']);
            $grid->addRow($row);
            if(isset($data['children'])){
                $row->addGrid(self::init($data['children'], ++$level));
                $level--;
            }
        }

        return $grid;
    }

    public function validate(){
        if(!$this->first_grid){
            return false;
        }

        return $this->first_grid->validate();
    }

    public function responaseErrArr(){
        $row_data = $this->first_grid->toArray();
        return [
            'error' => 1,
            'row_data' => $row_data
        ];
    }


}