## 介绍
> 在实际项目中，经常能遇到用户想用excel导入数据的场景。而通过excel编辑的数据很难控制数据的准确性和规范性。
> 而Grid-import要求用户先将excel数据导入系统，系统会自动转换出对应的web表格数据，让用户编辑和查看对应的出错提示，提交导入系统。
> 从而将不可控数据转变成可控的过程。

## 特点
+ 采用ant组件开发
+ 理论上支持无限嵌套子母表
+ 自动完成excel到grid格式的转换，开发者仅需关心业务逻辑接口
+ [qs-excel](https://github.com/tiderjian/qs-excel)完成excel的操作, gridImport仅关心web表格生成和完成两个组件间不同的数据格式转换

## 安装
```php
composer require tiderjian/qs-gridImport

//找到代码包里的js文件夹
npm i //完成前端依赖包的安装
npm run build //编译js文件，编译出的文件在dist/grid-import-bundle.js 该文件的使用见下面的教程
```

## 截图
将excel数据转换成web grid
<img src="https://user-images.githubusercontent.com/1665649/71555235-cc3f0600-2a64-11ea-8b6e-8f45adae5750.png" />

导入出错错误提示
<img src="https://user-images.githubusercontent.com/1665649/71555252-263fcb80-2a65-11ea-86d0-f789be74a7fc.png" />

错误提示2
<img src="https://user-images.githubusercontent.com/1665649/71555263-4b343e80-2a65-11ea-8877-1226d8de6fa8.png" />

导入成功，确定跳转
<img src="https://user-images.githubusercontent.com/1665649/71555287-846cae80-2a65-11ea-8015-c9aae20271bf.png" />
## 用法

### 定义表格配置
+ data 配置值

    >1. title 标题
    >2. key 列关键字
    >3. [type 列类型](#列类型)
    >4. [required 是否必填](#是否必填)
    >5. [validate_callback 验证回调](#验证回调)
 
+ 代码示例
```php
$options = [
    'data' => [
        [
            'title' => '项目',
            'key' => 'project_id',
            'type' => CellType::SELECT,
            'options' => [ 1 => '项目1', 2 => '项目2'],
            'required' => true,
            'valiate_callback' => function($val){
                //验证逻辑
            }
        ],
        [
            //省略第二列的配置
        ]       
    ]
];
```

+ [children 子母表配置](#子母表)

#### 列类型

1. CellType::INPUT  单行输入框

2. CellType::Date  日期

3. CellType::INPUTNUMBER 数字

4. CellType::SELECT 下拉选择
     > 类型为下拉选择是，配置值必须设置 options 下拉值，格式为键值对的数组
     > ```php
     > $project_arr = [
     >     1 => '项目1',
     >     2 => '项目2',
     >     3 => '项目3'
     > ];
     > 
     > //省略详细配置，仅演示options的设置，以下雷同，不重复提示
     > 'options' => $project_arr
     >```

PS. 除INPUT类型外，其余类型都在提交时会对提交值分别进行类型有效性验证

#### 是否必填

支持2种设置类型

1. 布尔值

    > true表示必填，false表示非必填，默认为false

2. 闭包函数
    
    > 可通过该机制动态决定是否为必填项
    > ```php
    > 'required' => function() {
    >    //业务逻辑 最后 return是否必填的布尔值
    > }
    >```

#### 验证回调

> 仅支持闭包函数，接受两个参数, 返回true表示验证通过，返回字符串表示验证不通过，同时表示不通过原因
> 1. 第一个参数为该单元格值
> 2. 第二个参数为该行的所有值
>
> ```php
> 'validate_callback' => function($val, $row){
>     //业务逻辑
> }
> ```

#### 子母表
> 子母表用于处理多层的数据导入情况，如用户需要在一个excel中，录入不同sheet数据，而不同sheet之间存在数据关联的情形。

> 举例： 一个项目，下面还存在不同的团队需要录入时，此时就可以通过设置二级子母表来一次完成项目和团队的数据导入


 + children值配置
 
    > children下的配置值其实与父级的配置一样，唯一不同的是多了个ref_key的值需要配置。该值接收一个数组，每个值表示与父级的关联字段
    > ```php
    > $options = [
    >   'data' => [
    >     [
    >         'title' => '项目',
    >         'key' => 'project_id',
    >         'type' => CellType::SELECT,
    >         'options' => [ 1 => '项目1', 2 => '项目2'],
    >         'required' => true,
    >         'valiate_callback' => function($val){
    >             //验证逻辑
    >         }
    >     ]
    >   ],
    >   'children' => [
    >      'ref_key' => [ 'project_id' ],
    >      'data' => [
    >          [
    >             'title' => '团队名称',
    >             'key' => 'team_name',
    >             'type' => CellType::INPUT,
    >             'required' => true
    >          ]
    >       ] 
    >   ]
    > ];
    >```
                
 PS. 子母表理论上支持无限嵌套，children下还可以继续设置children值，可按实际业务设置更复杂的导入方式。
 
 ### 根据配置值设置导出excel模板
 
 ```php
//第一个参数为转换驱动
//第二个参数为上面定义好的$options
$transcoder = new TranscoderFactory("QsExcel", $options);

//这里的的project和team与上面定义的options子母表关系对应，有多少层嵌套关系就可以转出多少个excel配置值，这里是两层关系
list($project, $team) = $transcoder->convertTo();

//这里是QsExcel的配置格式，可查看上面的qs-excel链接查看说明文档
$project_options = [
    'row_count' => 500,
    'headers' => $project
];

$team_options = [
    'row_count' => 500,
    'headers' => $team
];

//创建QsExcel对象，完成模板生成
$excel = new Excel();
$excel->addBuild((new \QsExcel\Builder\ListBuilder($project_options))->setSheetName('项目信息'));
$excel->addBuild((new \QsExcel\Builder\ListBuilder($team_options))->setSheetName('团队信息'));
$excel->output('项目团队资料导入.xlsx');
```

### 导入excel表格，生成grid  web表格

```php
//上传excel文件的路径
$file_path = '项目团队资料导入.xlsx';
$excel = new Excel();
$excel->setLoadFile($file_path);
//excel有多少张sheet需要读取数据，就设置多少个Loader
$excel->addLoader(new ListLoader());
$excel->addLoader(new ListLoader());
$list = $excel->load();

//这里将表头去掉，否则会出错
$res = [];
foreach($list as $v){
    unset($v[0]);
    $res[] = $v;
}

//根据$options生成转换器对象
$transcoder = new TranscoderFactory("QsExcel", $options);
//将上传的excel数据导入转换器
$transcoder->setData($res);
//$grid_data为通过转换器后，将excel数据转换成grid的数据格式
$grid_data = $transcoder->convertFrom();
```

下面是前端页面代码

```javascript
<script type="text/javascript" src="__PUBLIC__/libs-extra/grid-import-bundle.js"></script>
<script>
var opt = {
    submitUrl: "", //设置数据提交到的后端地址
    successRedirectUrl: "", //这里设置导入成功后，点击确定按钮要跳转到的地址
    data: {json_encode($grid_data)} //将上面生成的grid_data转成json格式赋给data
};
importGrid('id', opt); //第一个参数是需要渲染的dom id， 第二个参数为上面的配置对象
</script>
```

完成这部，就可以看到导入的数据已经转换成web表格，确认没错后可点击提交

### grid数据提交处理
```php
//$options不在说明了，就是最开始定义的配置
$grid_import = new GridImport($options);
//完成提交数据的填充和验证
//如果验证有问题，会返回false

$r = $grid_import->fill()->validate();
if($r === false){
    $errArr = $grid_import->responaseErrArr();
    //将$errArr数组转换成json格式返回
    //前端grid组件接收到后，会在对应的单元格显示出错误提示
}

//验证通过，通过toArray方法返回导入的数组数据
$import_datas = $grid_import->toArray();
//剩下就是实际的业务逻辑了
//在处理的过程中如果有进一步出错，可以通过一下代码给grid组件返回出错提示
//$error_msg为需要显示的错误信息
$errArr = $grid_import->responaseErrArr($error_msg);
//将$errArr数组转换成json格式返回
//前端grid组件接收到后，会通过警告提示显示出错误原因

//如果数据已经成功插入
//返回一个200响应即可，grid组件会显示导入成功提示
```