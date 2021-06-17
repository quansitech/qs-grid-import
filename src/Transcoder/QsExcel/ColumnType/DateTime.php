<?php
namespace QsGridImport\Transcoder\QsExcel\ColumnType;

use QsExcel\Builder\ListBuilder;
use QsGridImport\Helper;

class DateTime extends ColumnType{

    public function validate($val){
        $date = self::formatDate($val);
        return $date != date('n/j/Y H:i:s', strtotime($date)) ? false : true;
    }

    public function convertTo(){
        return [
            'type' => ListBuilder::DATE_TYPE
        ];
    }

    protected function formatDate($val){
        $date = str_replace('-', '/', $val);
        is_numeric($date) && $date = Helper::excelTime($date, 'n/j/Y H:i:s');
        return $date;
    }

    public function paraseValue($val){
        $date = self::formatDate($val);
        return date('Y-m-d H:i:s', strtotime($date));
    }
}