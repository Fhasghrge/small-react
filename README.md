# React源码分析
- parcel作为打包工具(进行项目依赖的管理)
- babel对JSX语法糖进行转换成React.creatElement()对象，同时需要编写.babelrc文件
```shell
npm i babel-core babel-preset-env 
babel-plugin-transform-react-jsx --save-dev
# 上面两个是依赖，最后一个才是核心
```

