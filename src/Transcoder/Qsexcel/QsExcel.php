<?php
namespace QsGridImport\Transcoder\Qsexcel;

use QsGridImport\TranscoderFactory;
use QsGridImport\Transcoder\Driver;

class QsExcel extends Driver{

    protected $sheets = [];

    public function __construct($grid_options)
    {
        parent::__construct($grid_options);

        self::genSheets($grid_options);
    }

    protected function genSheets($grid_options){
        $p_sheet = new Sheet($grid_options);
        $this->sheets[] = $p_sheet;
        while(isset($grid_options['children'])){
            $p_sheet = new Sheet($grid_options['children'], $p_sheet);
            $this->sheets[] = $p_sheet;
            $grid_options = $grid_options['children'];
        }
    }

    public function convertTo() : array{
        return array_map(function($sheet){
            return $sheet->convertOptionTo();
        }, $this->sheets);
    }

    public function setData($data_list){
        foreach($this->sheets as $sheet){
            $sheet_data = array_shift($data_list);
            $sheet->setData($sheet_data);
        }
    }

    public function convertFrom() : array{
        $row_data = self::convertDataFrom();
        return [
            'columns' => $this->grid_options,
            'row_data' => $row_data
        ];
    }

    protected function convertDataFrom(){
        self::connect();

        $row_data = [];
        foreach($this->sheets[0]->rows as $row){
            $row_data[] = $row->convertFrom();
        }

        return $row_data;
    }


    //链接子母数据
    protected function connect(){
        $sheets = $this->sheets;
        while($sheet = array_pop($sheets)){
            $sheet->connectRow();
        }
    }

    //根据columnoption的设置将excel的rowdata转换成grid格式
    protected function convertRowToGridFormat($row_data, $column_option){
        $tmp = [];
        $index = 0;
        if(isset($column_option['ref_key'])){
            for($n = 0; $n < count($column_option['ref_key']); $n++){
                $index++;
                $tmp[$column_option['ref_key'][$n]] = $row_data[$n];
            }
        }

        for($n = $index; $n < count($row_data); $n++){
//            $tmp[$column_option[$n - $index]]
        }
    }

    //根据option(具体某一列的配置)将excel的cell数据转换成grid格式
    //返回包含两个值的数组
    protected function convertCellToGridFormat($cell_data, $column_option){
        switch($column_option['type']){
            case 'select':
                $cell_data = in_array($cell_data, TranscoderFactory::parseSelectOptions($column_option['options'])) ? $cell_data : '';
                break;
            case 'date':

                break;
            default:
                break;
        }


    }

    //根据level获取对应层级的column option
    public function getColumnOptionByLevel($level, $options){
        $options = $options['columns'];
        while(--$level > 0 && isset($options['children'])){
            $options = $options['children'];
        }
        return $options;
    }

    protected function convertFromOne($data_list, $column_option){
        $converted = [];
        for($n = 0; $n < count($data_list); $n++){
            $row = $data_list[$n];
            $tmp = [];
            for($l = 0; $l < count($row); $l++){
                $tmp['data'][$column_option[$l]['key']] = $row[$l];
            }
            $converted[] = $tmp;
        }
        return $converted;
    }

}