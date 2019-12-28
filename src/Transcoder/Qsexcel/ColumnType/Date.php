<?php
namespace QsGridImport\Transcoder\Qsexcel\ColumnType;

use QsExcel\Builder\ListBuilder;
use QsGridImport\Helper;

class Date extends ColumnType{

    public function validate($val){
        $date = self::formatDate($val);
        return $date != date('Y-n-j', strtotime($date)) ? false : true;
    }

    public function convertTo(){
        return [
            'type' => ListBuilder::DATE_TYPE
        ];
    }

    protected function formatDate($val){
        $date = str_replace('/', '-', $val);
        is_numeric($date) && $date = Helper::excelTime($date, 'Y-m-d');
        return $date;
    }

    public function paraseValue($val){
        $date = self::formatDate($val);
        return date('Y-m-d', strtotime($date));
    }
}