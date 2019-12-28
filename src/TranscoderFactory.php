<?php
namespace QsGridImport;

class TranscoderFactory{

    private $driver;

    public function __construct(string $convert_driver, array $options)
    {
        $driver_name = ucfirst($convert_driver);
        $class_name = "\\QsGridImport\\Transcoder\\{$driver_name}\\{$driver_name}";
        if(!class_exists($class_name)) {
            throw new \Exception('driver not found');
        }

        $this->driver = new $class_name($options);
    }

    public function convertTo() : array{
        return $this->driver->convertTo();
    }

    public function setData($data_list){
        $this->driver->setData($data_list);
    }

    public function convertFrom() : array{
        return $this->driver->convertFrom();
    }

}