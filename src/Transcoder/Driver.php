<?php
namespace QsGridImport\Transcoder;

abstract class Driver{

    protected $grid_options;

    public function __construct($grid_options)
    {
        $this->grid_options = $grid_options;
    }

    abstract function convertTo() : array;

    abstract function convertFrom() : array;

    abstract function setData(array $data_list);
}