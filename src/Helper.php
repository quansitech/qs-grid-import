<?php
namespace QsGridImport;

class Helper{

    static public function excelTime($days,$data_format='Y-m-d H:i:s'){
        if($days != ''){
            $n = round(($days - 25569) * 3600 * 24); //转换成1970年以来的秒数
            return gmdate( $data_format, $n);//格式化时间
        }
    }

    static public function getDataOptionByKey($column_options, $key){
        $arr = array_filter($column_options, function($data_option) use($key){
            return $data_option['key'] == $key;
        });
        return array_pop($arr);
    }

    static public function getColumnOptionByLevel($all_options, $level){
        $cur = 0;
        $tmp_option = $all_options;
        do{
            $cur++;
        }while($cur < $level && isset($tmp_option['children']) && $tmp_option = $tmp_option['children']);

        return $tmp_option;
    }
}